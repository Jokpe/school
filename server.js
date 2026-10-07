const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jokpe_edutrack';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

// Schema Models
const SchoolSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  address: String,
  region: String,
  district: String,
  circuit: String,
  community: String,
  digitalAddress: String,
  phone: String,
  email: String,
  headmaster: String,
  schoolCode: { type: String, unique: true, required: true, index: true },
  users: [{
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    email: String
  }],
  classes: [{
    className: String,
    teacher: String,
    students: [{
      name: String,
      gender: String,
      attendance: [Boolean],
      sba: Object
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

const School = mongoose.model('School', SchoolSchema);

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'jokpe_secret_key', (error, user) => {
    if (error) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
}

// Helper function
function generateSchoolCode(schoolName) {
  const prefix = (schoolName || 'JOKPE')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase();

  const validPrefix = prefix || 'JOKP';
  const digits = Math.floor(1000 + Math.random() * 9000);

  return `${validPrefix}${digits}`;
}

// API Routes

// Register School
app.post('/api/register', async (req, res) => {
  try {
    const {
      schoolName,
      address,
      region,
      district,
      circuit,
      community,
      digitalAddress,
      phone,
      email,
      headmaster,
      username,
      password
    } = req.body;

    if (!schoolName || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'School name, username and password are required'
      });
    }

    const schoolCode = generateSchoolCode(schoolName);
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingSchool = await School.findOne({ schoolCode });
    if (existingSchool) {
      return res.status(409).json({
        success: false,
        error: 'School code already exists. Please try again.'
      });
    }

    const school = new School({
      schoolName,
      address,
      region,
      district,
      circuit,
      community,
      digitalAddress,
      phone,
      email,
      headmaster,
      schoolCode,
      users: [{
        username,
        password: hashedPassword,
        role: 'admin',
        email: email || ''
      }]
    });

    await school.save();

    res.status(201).json({
      success: true,
      schoolCode,
      message: 'School registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { schoolCode, username, password } = req.body;

    if (!schoolCode || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'School code, username and password are required'
      });
    }

    const school = await School.findOne({ schoolCode: schoolCode.trim() });
    if (!school) {
      return res.status(401).json({ success: false, error: 'Invalid school code' });
    }

    const user = school.users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid username' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const token = jwt.sign({
      schoolId: school._id,
      username: user.username,
      role: user.role
    }, process.env.JWT_SECRET || 'jokpe_secret_key', { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      school: {
        schoolName: school.schoolName,
        schoolCode: school.schoolCode,
        users: school.users
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sync Data
app.post('/api/sync', authenticateToken, async (req, res) => {
  try {
    const { schoolCode, data } = req.body;

    if (!schoolCode) {
      return res.status(400).json({ success: false, error: 'School code is required' });
    }

    const school = await School.findOne({ schoolCode });
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    if (data && data.classes) {
      school.classes = data.classes;
    }

    if (data && data.users) {
      school.users = data.users;
    }

    if (data && data.schoolName) {
      school.schoolName = data.schoolName;
    }

    await school.save();

    res.json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get School Data
app.get('/api/school/:schoolCode', async (req, res) => {
  try {
    const school = await School.findOne({ schoolCode: req.params.schoolCode });
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    res.json({ success: true, school });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
