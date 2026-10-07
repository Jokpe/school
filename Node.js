const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/jokpe_edutrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
    schoolCode: { type: String, unique: true },
    users: [{
        username: String,
        password: String,
        role: String,
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

// API Routes

// Register School
app.post('/api/register', async (req, res) => {
    try {
        const { schoolName, address, region, district, circuit, community, 
                digitalAddress, phone, email, headmaster, username, password } = req.body;
        
        // Generate school code
        const schoolCode = generateSchoolCode(schoolName);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
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
                email
            }]
        });
        
        await school.save();
        res.json({ success: true, schoolCode, message: 'School registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { schoolCode, username, password } = req.body;
        
        const school = await School.findOne({ schoolCode });
        if (!school) {
            return res.status(401).json({ success: false, error: 'Invalid school code' });
        }
        
        const user = school.users.find(u => u.username === username);
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
        }, 'jokpe_secret_key', { expiresIn: '24h' });
        
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
        res.status(500).json({ success: false, error: error.message });
    }
});

// Sync Data
app.post('/api/sync', async (req, res) => {
    try {
        const { schoolCode, data } = req.body;
        const school = await School.findOne({ schoolCode });
        
        if (!school) {
            return res.status(404).json({ success: false, error: 'School not found' });
        }
        
        // Update school data
        // This is a simplified example - you'd need to handle specific updates
        school.classes = data.classes || school.classes;
        await school.save();
        
        res.json({ success: true, message: 'Data synced successfully' });
    } catch (error) {
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
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper function
function generateSchoolCode(schoolName) {
    const prefix = schoolName.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
    const digits = Math.floor(1000 + Math.random() * 9000);
    return prefix + digits;
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

