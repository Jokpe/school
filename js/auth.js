// ===== CONFIGURATION =====
let currentUser = null;
let currentSchool = null;

// ===== HIERARCHICAL ADMIN SYSTEM =====

// Admin levels
const ADMIN_LEVELS = {
    NATION: 'nation',
    REGIONAL: 'regional',
    DISTRICT: 'district',
    CIRCUIT: 'circuit',
    SCHOOL: 'school'
};

// Role hierarchy (who can create whom)
const ROLE_HIERARCHY = {
    nation: ['regional'],
    regional: ['district'],
    district: ['circuit'],
    circuit: ['school'],
    school: ['teacher']
};

// Data visibility hierarchy
const DATA_VISIBILITY = {
    nation: ['nation', 'regional', 'district', 'circuit', 'school'],
    regional: ['regional', 'district', 'circuit', 'school'],
    district: ['district', 'circuit', 'school'],
    circuit: ['circuit', 'school'],
    school: ['school']
};

// ===== AUTHENTICATION SYSTEM =====

// Initialize auth on load
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    // Call initTables from tables.js (will be available globally)
    if (typeof initTables === 'function') {
        initTables();
    }
});

function initAuth() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('jokpe_current_user');
    const savedSchool = localStorage.getItem('jokpe_current_school');
    
    if (savedUser && savedSchool) {
        currentUser = JSON.parse(savedUser);
        currentSchool = JSON.parse(savedSchool);
        showApp();
    } else {
        showAuth();
    }

    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            document.getElementById(tabName + 'Form').classList.add('active');
            
            // Update switch text
            const switchText = document.getElementById('authSwitchText');
            if (tabName === 'login') {
                switchText.innerHTML = 'Don\'t have a school account? <a onclick="switchAuthTab(\'register\')">Register your school</a>';
            } else {
                switchText.innerHTML = 'Already have an account? <a onclick="switchAuthTab(\'login\')">Login</a>';
            }
        });
    });
}

function switchAuthTab(tabName) {
    document.querySelector(`.auth-tab[data-tab="${tabName}"]`).click();
}

function showAuth() {
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('userBadge').style.display = 'none';
}

function showApp() {
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('userBadge').style.display = 'flex';
    
    // Update user badge
    document.getElementById('userDisplayName').textContent = currentUser.username;
    document.getElementById('roleBadge').textContent = currentUser.role || 'Admin';
    
    // Set school name and load settings
    if (currentSchool) {
        document.getElementById('school-name').value = currentSchool.schoolName || '';
        loadSchoolSettings();
    }
    
    // Load school data if exists
    if (currentSchool && currentSchool.schoolName) {
        const savedData = localStorage.getItem(`schoolData_${currentSchool.schoolName}`);
        if (savedData) {
            loadSpecificData(currentSchool.schoolName);
        }
    }
    
    // Show admin dashboard for non-school level admins
    const adminLevel = currentSchool?.adminLevel || 'school';
    if (adminLevel !== 'school') {
        setTimeout(() => {
            showAdminDashboard();
        }, 500);
    }
}

// ===== HIERARCHICAL USER MANAGEMENT =====

function canCreateAccount(creatorLevel, targetLevel) {
    const allowedTargets = ROLE_HIERARCHY[creatorLevel] || [];
    return allowedTargets.includes(targetLevel);
}

function canViewData(adminLevel, targetAdminLevel) {
    const visibleLevels = DATA_VISIBILITY[adminLevel] || [];
    return visibleLevels.includes(targetAdminLevel);
}

// ===== REGISTER NEW USER WITH HIERARCHY =====

function registerAdminUser(creatorData, newUserData) {
    const schools = JSON.parse(localStorage.getItem('jokpe_schools') || '{}');
    
    // Validate creator has permission
    const creatorSchool = schools[creatorData.schoolCode];
    if (!creatorSchool) {
        return { success: false, error: 'Creator school not found' };
    }
    
    const creatorLevel = creatorSchool.adminLevel || 'nation';
    
    // Check if creator can create this level
    if (!canCreateAccount(creatorLevel, newUserData.adminLevel)) {
        return { success: false, error: `You don't have permission to create ${newUserData.adminLevel} level admins` };
    }
    
    // Generate school code for new admin
    let schoolCode = generateSchoolCode(newUserData.schoolName || newUserData.adminLevel);
    
    // Check if school code already exists
    while (schools[schoolCode]) {
        schoolCode = generateSchoolCode(newUserData.schoolName + Date.now());
    }
    
    // Create the new admin school/entity
    const newSchool = {
        schoolName: newUserData.schoolName || `${newUserData.adminLevel.toUpperCase()} Admin`,
        address: newUserData.address || '',
        region: newUserData.region || creatorData.region || '',
        district: newUserData.district || creatorData.district || '',
        circuit: newUserData.circuit || creatorData.circuit || '',
        community: newUserData.community || '',
        digitalAddress: newUserData.digitalAddress || '',
        phone: newUserData.phone || '',
        email: newUserData.email || '',
        headmaster: newUserData.headmaster || '',
        adminLevel: newUserData.adminLevel,
        parentCode: creatorData.schoolCode, // Track who created this
        createdAt: new Date().toISOString(),
        schoolCode: schoolCode,
        users: {
            [newUserData.username]: {
                password: hashPassword(newUserData.password),
                role: newUserData.adminLevel,
                email: newUserData.email,
                createdAt: new Date().toISOString()
            }
        }
    };
    
    // Save to localStorage
    schools[schoolCode] = newSchool;
    localStorage.setItem('jokpe_schools', JSON.stringify(schools));
    
    return {
        success: true,
        schoolCode: schoolCode,
        message: `${newUserData.adminLevel.toUpperCase()} level admin created successfully`,
        adminLevel: newUserData.adminLevel
    };
}

// ===== GET HIERARCHICAL DATA =====

function getHierarchicalData(adminLevel, schoolCode) {
    const schools = JSON.parse(localStorage.getItem('jokpe_schools') || '{}');
    const currentSchool = schools[schoolCode];
    
    if (!currentSchool) return { success: false, error: 'School not found' };
    
    const results = {};
    
    // Get all schools under this admin's hierarchy
    Object.keys(schools).forEach(code => {
        const school = schools[code];
        if (canViewData(adminLevel, school.adminLevel || 'school')) {
            // Check if under this admin's tree
            if (isUnderHierarchy(schools, code, schoolCode)) {
                results[code] = school;
            }
        }
    });
    
    return {
        success: true,
        adminLevel: adminLevel,
        totalEntities: Object.keys(results).length,
        data: results
    };
}

// ===== CHECK HIERARCHY TREE =====

function isUnderHierarchy(schools, targetCode, parentCode) {
    let current = schools[targetCode];
    
    while (current) {
        if (current.parentCode === parentCode) {
            return true;
        }
        if (!current.parentCode) break;
        current = schools[current.parentCode];
    }
    
    return targetCode === parentCode;
}

// ===== ADMIN DASHBOARD =====

function showAdminDashboard() {
    const currentSchool = JSON.parse(localStorage.getItem('jokpe_current_school'));
    if (!currentSchool) {
        alert('Please login first');
        return;
    }
    
    // Hide all tables and containers
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('report-cards-container').classList.add('hidden');
    document.getElementById('analytics-container').classList.add('hidden');
    document.getElementById('settings-container').classList.add('hidden');
    document.getElementById('change-password-container').classList.add('hidden');
    
    // Show admin dashboard
    const container = document.getElementById('admin-dashboard-container');
    container.classList.remove('hidden');
    
    const adminLevel = currentSchool.adminLevel || 'school';
    const data = getHierarchicalData(adminLevel, currentSchool.schoolCode);
    
    if (!data.success) {
        alert('Error loading hierarchical data');
        return;
    }
    
    // Display dashboard
    const dashboardHTML = `
        <div class="admin-dashboard">
            <h2><i class="fas fa-sitemap"></i> Admin Dashboard</h2>
            <div class="admin-info">
                <h3>${adminLevel.toUpperCase()} Level Admin</h3>
                <p><strong>School:</strong> ${currentSchool.schoolName}</p>
                <p><strong>Code:</strong> ${currentSchool.schoolCode}</p>
                <p><strong>Total Entities Under You:</strong> ${data.totalEntities}</p>
                <p><strong>Your Level:</strong> ${adminLevel.toUpperCase()}</p>
            </div>
            <div class="admin-actions">
                <button onclick="showCreateAdminForm()"><i class="fas fa-user-plus"></i> Create New Admin</button>
                <button onclick="showEntityList()"><i class="fas fa-list"></i> View All Entities</button>
                <button onclick="showDataTracking()"><i class="fas fa-chart-line"></i> Monitor Data</button>
            </div>
            <div id="admin-content"></div>
        </div>
    `;
    
    container.innerHTML = dashboardHTML;
}

// ===== CREATE ADMIN FORM =====

function showCreateAdminForm() {
    const currentSchool = JSON.parse(localStorage.getItem('jokpe_current_school'));
    const adminLevel = currentSchool.adminLevel || 'nation';
    const allowedLevels = ROLE_HIERARCHY[adminLevel] || [];
    
    if (allowedLevels.length === 0) {
        document.getElementById('admin-content').innerHTML = `
            <div class="alert alert-info">
                <h4>You cannot create any more admin levels.</h4>
                <p>You are at the lowest level (${adminLevel.toUpperCase()}).</p>
            </div>
        `;
        return;
    }
    
    const targetLevel = allowedLevels[0];
    
    const formHTML = `
        <div class="create-admin-form">
            <h4><i class="fas fa-user-plus"></i> Create ${targetLevel.toUpperCase()} Level Admin</h4>
            <div class="form-group">
                <label>School/Entity Name *</label>
                <input type="text" id="newAdminName" placeholder="Enter name">
            </div>
            <div class="form-group">
                <label>Region</label>
                <input type="text" id="newAdminRegion" placeholder="Region">
            </div>
            <div class="form-group">
                <label>District</label>
                <input type="text" id="newAdminDistrict" placeholder="District">
            </div>
            <div class="form-group">
                <label>Circuit</label>
                <input type="text" id="newAdminCircuit" placeholder="Circuit">
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="newAdminEmail" placeholder="Email address">
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" id="newAdminPhone" placeholder="Phone number">
            </div>
            <div class="form-group">
                <label>Admin Username *</label>
                <input type="text" id="newAdminUsername" placeholder="Choose username">
            </div>
            <div class="form-group">
                <label>Admin Password *</label>
                <input type="password" id="newAdminPassword" placeholder="Password (min 6 chars)">
            </div>
            <div class="form-group">
                <label>Confirm Password *</label>
                <input type="password" id="newAdminConfirmPassword" placeholder="Confirm password">
            </div>
            <button onclick="createNewAdmin()"><i class="fas fa-save"></i> Create Admin</button>
            <div id="createAdminMessage"></div>
        </div>
    `;
    
    document.getElementById('admin-content').innerHTML = formHTML;
}

function createNewAdmin() {
    const currentSchool = JSON.parse(localStorage.getItem('jokpe_current_school'));
    const adminLevel = currentSchool.adminLevel || 'nation';
    const allowedLevels = ROLE_HIERARCHY[adminLevel] || [];
    
    if (allowedLevels.length === 0) {
        alert('You cannot create admins at this level.');
        return;
    }
    
    const targetLevel = allowedLevels[0];
    
    // Get form data
    const name = document.getElementById('newAdminName').value.trim();
    const username = document.getElementById('newAdminUsername').value.trim();
    const password = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('newAdminConfirmPassword').value;
    const email = document.getElementById('newAdminEmail').value.trim();
    const phone = document.getElementById('newAdminPhone').value.trim();
    const region = document.getElementById('newAdminRegion').value.trim();
    const district = document.getElementById('newAdminDistrict').value.trim();
    const circuit = document.getElementById('newAdminCircuit').value.trim();
    
    const messageEl = document.getElementById('createAdminMessage');
    
    // Validation
    if (!name || !username || !password || !email) {
        messageEl.textContent = 'Please fill all required fields (marked with *)';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    if (password.length < 6) {
        messageEl.textContent = 'Password must be at least 6 characters';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    if (password !== confirmPassword) {
        messageEl.textContent = 'Passwords do not match';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
        messageEl.textContent = 'Please enter a valid email address';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Create the admin
    const result = registerAdminUser(currentSchool, {
        schoolName: name,
        username: username,
        password: password,
        email: email,
        phone: phone,
        region: region || currentSchool.region,
        district: district || currentSchool.district,
        circuit: circuit || currentSchool.circuit,
        adminLevel: targetLevel
    });
    
    if (result.success) {
        messageEl.innerHTML = `
            <div class="success-message">
                <h4>✅ ${targetLevel.toUpperCase()} admin created successfully!</h4>
                <p><strong>School Code:</strong> <span class="highlight">${result.schoolCode}</span></p>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Level:</strong> ${targetLevel.toUpperCase()}</p>
            </div>
        `;
        messageEl.style.color = '#27ae60';
        
        // Clear form
        document.getElementById('newAdminName').value = '';
        document.getElementById('newAdminUsername').value = '';
        document.getElementById('newAdminPassword').value = '';
        document.getElementById('newAdminConfirmPassword').value = '';
        document.getElementById('newAdminEmail').value = '';
        document.getElementById('newAdminPhone').value = '';
        document.getElementById('newAdminRegion').value = '';
        document.getElementById('newAdminDistrict').value = '';
        document.getElementById('newAdminCircuit').value = '';
    } else {
        messageEl.textContent = result.error;
        messageEl.style.color = '#e74c3c';
    }
}

// ===== ENTITY LIST =====

function showEntityList() {
    const currentSchool = JSON.parse(localStorage.getItem('jokpe_current_school'));
    const adminLevel = currentSchool.adminLevel || 'nation';
    const data = getHierarchicalData(adminLevel, currentSchool.schoolCode);
    
    if (!data.success) {
        alert('Error loading data');
        return;
    }
    
    let listHTML = `
        <div class="entity-list">
            <h4><i class="fas fa-list"></i> Entities Under Your Control</h4>
            <div class="entity-count">Total: ${data.totalEntities} entities</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Code</th>
                        <th>Region</th>
                        <th>District</th>
                        <th>Circuit</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let count = 1;
    Object.keys(data.data).forEach(code => {
        const entity = data.data[code];
        listHTML += `
            <tr>
                <td>${count++}</td>
                <td><strong>${entity.schoolName}</strong></td>
                <td><span class="level-badge level-${entity.adminLevel || 'school'}">${(entity.adminLevel || 'school').toUpperCase()}</span></td>
                <td><code>${code}</code></td>
                <td>${entity.region || '-'}</td>
                <td>${entity.district || '-'}</td>
                <td>${entity.circuit || '-'}</td>
            </tr>
        `;
    });
    
    listHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('admin-content').innerHTML = listHTML;
}

// ===== DATA TRACKING =====

function showDataTracking() {
    const currentSchool = JSON.parse(localStorage.getItem('jokpe_current_school'));
    const adminLevel = currentSchool.adminLevel || 'nation';
    const data = getHierarchicalData(adminLevel, currentSchool.schoolCode);
    
    if (!data.success) {
        alert('Error loading data');
        return;
    }
    
    let trackingHTML = `
        <div class="data-tracking">
            <h4><i class="fas fa-chart-line"></i> Data Monitoring Dashboard</h4>
            <div class="tracking-stats">
    `;
    
    // Calculate statistics
    let totalStudents = 0;
    let totalClasses = 0;
    let totalTeachers = 0;
    
    Object.keys(data.data).forEach(code => {
        const entity = data.data[code];
        // Count students from saved data
        const schoolData = localStorage.getItem(`schoolData_${code}`);
        if (schoolData) {
            try {
                const parsed = JSON.parse(schoolData);
                if (parsed.register && parsed.register.students) {
                    totalStudents += parsed.register.students.length;
                }
                if (parsed.header && parsed.header.classes) {
                    totalClasses += parsed.header.classes.length;
                }
            } catch (e) {}
        }
    });
    
    trackingHTML += `
                <div class="stat-card">
                    <h5>Total Students</h5>
                    <div class="stat-number">${totalStudents}</div>
                    <div class="stat-trend up">↑ Across all entities</div>
                </div>
                <div class="stat-card">
                    <h5>Total Classes</h5>
                    <div class="stat-number">${totalClasses}</div>
                    <div class="stat-trend up">↑ Across all entities</div>
                </div>
                <div class="stat-card">
                    <h5>Total Schools/Entities</h5>
                    <div class="stat-number">${data.totalEntities}</div>
                    <div class="stat-trend up">↑ Under your control</div>
                </div>
            </div>
            <div class="tracking-chart">
                <h5>Data Overview</h5>
                <div class="chart-container">
                    <canvas id="hierarchyChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-content').innerHTML = trackingHTML;
    
    // Render chart if Chart.js is available
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            renderHierarchyChart(totalStudents, totalClasses, data.totalEntities);
        }
    }, 100);
}

function renderHierarchyChart(students, classes, entities) {
    const ctx = document.getElementById('hierarchyChart');
    if (!ctx) return;
    
    // Destroy existing chart if any
    if (window.hierarchyChartInstance) {
        window.hierarchyChartInstance.destroy();
    }
    
    window.hierarchyChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Students', 'Classes', 'Entities'],
            datasets: [{
                data: [students || 1, classes || 1, entities || 1],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                borderColor: ['#2980b9', '#27ae60', '#c0392b'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// ===== LOGIN HANDLER =====

function handleLogin() {
    const schoolCode = document.getElementById('loginSchoolCode').value.trim();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';

    if (!schoolCode || !username || !password) {
        errorEl.textContent = 'Please fill all fields';
        return;
    }

    // Check if school exists
    const schools = JSON.parse(localStorage.getItem('jokpe_schools') || '{}');
    let foundSchool = null;
    let foundUser = null;

    for (const [code, school] of Object.entries(schools)) {
        if (code === schoolCode) {
            foundSchool = school;
            // Check if user exists in this school
            if (school.users && school.users[username]) {
                const user = school.users[username];
                if (user.password === hashPassword(password)) {
                    foundUser = { username, role: user.role || 'admin' };
                }
            }
            break;
        }
    }

    if (!foundSchool) {
        errorEl.textContent = 'Invalid school code';
        return;
    }

    if (!foundUser) {
        errorEl.textContent = 'Invalid username or password';
        return;
    }

    // Login successful
    currentUser = foundUser;
    currentSchool = foundSchool;
    
    localStorage.setItem('jokpe_current_user', JSON.stringify(currentUser));
    localStorage.setItem('jokpe_current_school', JSON.stringify(currentSchool));
    
    showApp();
}

// ===== REGISTER HANDLER =====

function handleRegister() {
    const schoolName = document.getElementById('regSchoolName').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    const region = document.getElementById('regRegion').value.trim();
    const district = document.getElementById('regDistrict').value.trim();
    const circuit = document.getElementById('regCircuit').value.trim();
    const community = document.getElementById('regCommunity').value.trim();
    const digitalAddress = document.getElementById('regDigitalAddress').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const headmaster = document.getElementById('regHeadmaster').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const errorEl = document.getElementById('registerError');
    const successEl = document.getElementById('registerSuccess');

    errorEl.textContent = '';
    successEl.textContent = '';

    // Validate required fields
    if (!schoolName || !address || !region || !district || !circuit || !community || !phone || !email || !headmaster || !username || !password) {
        errorEl.textContent = 'Please fill all required fields (marked with *)';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        return;
    }

    if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        return;
    }

    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
        errorEl.textContent = 'Please enter a valid email address';
        return;
    }

    // Generate school code
    let schoolCode = generateSchoolCode(schoolName);
    
    // Check if school already exists
    const schools = JSON.parse(localStorage.getItem('jokpe_schools') || '{}');
    
    for (const [code, school] of Object.entries(schools)) {
        if (school.schoolName.toLowerCase() === schoolName.toLowerCase()) {
            errorEl.textContent = 'School already registered';
            return;
        }
        if (code === schoolCode) {
            // Regenerate if collision
            schoolCode = generateSchoolCode(schoolName + Date.now());
        }
    }

    // Create school
    const newSchool = {
        schoolName: schoolName,
        address: address,
        region: region,
        district: district,
        circuit: circuit,
        community: community,
        digitalAddress: digitalAddress,
        phone: phone,
        email: email,
        headmaster: headmaster,
        adminLevel: 'nation', // Default: Nation level admin
        createdAt: new Date().toISOString(),
        users: {
            [username]: {
                password: hashPassword(password),
                role: 'admin',
                email: email,
                createdAt: new Date().toISOString()
            }
        },
        schoolCode: schoolCode
    };

    schools[schoolCode] = newSchool;
    localStorage.setItem('jokpe_schools', JSON.stringify(schools));

    // Show success with school code
    successEl.innerHTML = `
        <div class="school-code-display">
            <h3>School Registered Successfully!</h3>
            <p>Your School Code is:</p>
            <div class="code">${schoolCode}</div>
            <p style="margin-top: 10px;">Share this code with teachers to login.</p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Admin Level:</strong> NATION</p>
        </div>
    `;
    
    // Clear form
    document.getElementById('regSchoolName').value = '';
    document.getElementById('regAddress').value = '';
    document.getElementById('regRegion').value = '';
    document.getElementById('regDistrict').value = '';
    document.getElementById('regCircuit').value = '';
    document.getElementById('regCommunity').value = '';
    document.getElementById('regDigitalAddress').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regHeadmaster').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';
}

// ===== HELPER FUNCTIONS =====

function generateSchoolCode(schoolName) {
    // Generate a unique code: first 4 letters of school + 4 random digits
    const prefix = schoolName.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
    const digits = Math.floor(1000 + Math.random() * 9000);
    return prefix + digits;
}

function hashPassword(password) {
    // Simple hash for demo - in production use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36);
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function handleLogout() {
    if (confirm('Logout from ' + currentUser.username + '?')) {
        localStorage.removeItem('jokpe_current_user');
        localStorage.removeItem('jokpe_current_school');
        currentUser = null;
        currentSchool = null;
        location.reload();
    }
}

// ===== SETTINGS SYSTEM =====

function showSettings() {
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('report-cards-container').classList.add('hidden');
    document.getElementById('change-password-container').classList.add('hidden');
    document.getElementById('admin-dashboard-container').classList.add('hidden');
    document.getElementById('settings-container').classList.remove('hidden');
    
    // Load settings into form
    if (currentSchool) {
        document.getElementById('settingsSchoolName').value = currentSchool.schoolName || '';
        document.getElementById('settingsAddress').value = currentSchool.address || '';
        document.getElementById('settingsRegion').value = currentSchool.region || '';
        document.getElementById('settingsDistrict').value = currentSchool.district || '';
        document.getElementById('settingsCircuit').value = currentSchool.circuit || '';
        document.getElementById('settingsCommunity').value = currentSchool.community || '';
        document.getElementById('settingsDigitalAddress').value = currentSchool.digitalAddress || '';
        document.getElementById('settingsPhone').value = currentSchool.phone || '';
        document.getElementById('settingsEmail').value = currentSchool.email || '';
        document.getElementById('settingsHeadmaster').value = currentSchool.headmaster || '';
        document.getElementById('settingsSchoolCode').value = currentSchool.schoolCode || '';
    }
    
    document.getElementById('settingsMessage').textContent = '';
    document.getElementById('userDropdown').classList.remove('show');
}

function closeSettings() {
    document.getElementById('settings-container').classList.add('hidden');
    document.getElementById('register-table').classList.remove('hidden');
    document.getElementById('settingsMessage').textContent = '';
    
    // Show admin dashboard if admin level is not school
    const adminLevel = currentSchool?.adminLevel || 'school';
    if (adminLevel !== 'school') {
        showAdminDashboard();
    }
}

function saveSettings() {
    const messageEl = document.getElementById('settingsMessage');
    messageEl.textContent = '';
    
    if (!currentSchool) {
        messageEl.textContent = 'No school data found. Please login again.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    // Get school info
    const schoolName = document.getElementById('settingsSchoolName').value.trim();
    const address = document.getElementById('settingsAddress').value.trim();
    const region = document.getElementById('settingsRegion').value.trim();
    const district = document.getElementById('settingsDistrict').value.trim();
    const circuit = document.getElementById('settingsCircuit').value.trim();
    const community = document.getElementById('settingsCommunity').value.trim();
    const digitalAddress = document.getElementById('settingsDigitalAddress').value.trim();
    const phone = document.getElementById('settingsPhone').value.trim();
    const email = document.getElementById('settingsEmail').value.trim();
    const headmaster = document.getElementById('settingsHeadmaster').value.trim();
    
    // Validate required fields
    if (!schoolName || !address || !region || !district || !circuit || !community || !phone || !email || !headmaster) {
        messageEl.textContent = 'Please fill all required school information fields.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    // Update school information
    const schools = JSON.parse(localStorage.getItem('jokpe_schools') || '{}');
    const schoolCode = currentSchool.schoolCode;
    const schoolData = schools[schoolCode];
    
    if (!schoolData) {
        messageEl.textContent = 'School data not found.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    schoolData.schoolName = schoolName;
    schoolData.address = address;
    schoolData.region = region;
    schoolData.district = district;
    schoolData.circuit = circuit;
    schoolData.community = community;
    schoolData.digitalAddress = digitalAddress;
    schoolData.phone = phone;
    schoolData.email = email;
    schoolData.headmaster = headmaster;
    
    // Save to localStorage
    schools[schoolCode] = schoolData;
    localStorage.setItem('jokpe_schools', JSON.stringify(schools));
    
    // Update current school
    currentSchool = schoolData;
    localStorage.setItem('jokpe_current_school', JSON.stringify(currentSchool));
    
    // Update UI
    document.getElementById('school-name').value = schoolName;
    
    messageEl.textContent = 'Settings saved successfully!';
    messageEl.style.color = '#27ae60';
    
    setTimeout(() => {
        messageEl.textContent = '';
    }, 3000);
}

// ===== CHANGE PASSWORD SYSTEM =====

function showChangePassword() {
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('report-cards-container').classList.add('hidden');
    document.getElementById('settings-container').classList.add('hidden');
    document.getElementById('admin-dashboard-container').classList.add('hidden');
    document.getElementById('change-password-container').classList.remove('hidden');
    
    // Clear password fields
    document.getElementById('changeCurrentPassword').value = '';
    document.getElementById('changeNewPassword').value = '';
    document.getElementById('changeConfirmPassword').value = '';
    document.getElementById('changePasswordMessage').textContent = '';
    document.getElementById('userDropdown').classList.remove('show');
}

function closeChangePassword() {
    document.getElementById('change-password-container').classList.add('hidden');
    document.getElementById('register-table').classList.remove('hidden');
    document.getElementById('changePasswordMessage').textContent = '';
    
    // Show admin dashboard if admin level is not school
    const adminLevel = currentSchool?.adminLevel || 'school';
    if (adminLevel !== 'school') {
        showAdminDashboard();
    }
}

function changePassword() {
    const messageEl = document.getElementById('changePasswordMessage');
    messageEl.textContent = '';
    
    if (!currentSchool) {
        messageEl.textContent = 'No school data found. Please login again.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    const currentPassword = document.getElementById('changeCurrentPassword').value;
    const newPassword = document.getElementById('changeNewPassword').value;
    const confirmPassword = document.getElementById('changeConfirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        messageEl.textContent = 'Please fill all password fields.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    if (newPassword.length < 6) {
        messageEl.textContent = 'New password must be at least 6 characters.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    if (newPassword !== confirmPassword) {
        messageEl.textContent = 'New passwords do not match.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    // Verify current password
    const schools = JSON.parse(localStorage.getItem('jokpe_schools') || '{}');
    const schoolCode = currentSchool.schoolCode;
    const schoolData = schools[schoolCode];
    
    if (!schoolData) {
        messageEl.textContent = 'School data not found.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    const hashedCurrent = hashPassword(currentPassword);
    let passwordValid = false;
    let userToUpdate = null;

    for (const [username, user] of Object.entries(schoolData.users)) {
        if (user.password === hashedCurrent) {
            passwordValid = true;
            userToUpdate = username;
            break;
        }
    }

    if (!passwordValid) {
        messageEl.textContent = 'Current password is incorrect.';
        messageEl.style.color = '#e74c3c';
        return;
    }

    // Update password
    if (userToUpdate) {
        schoolData.users[userToUpdate].password = hashPassword(newPassword);
        
        // Save to localStorage
        schools[schoolCode] = schoolData;
        localStorage.setItem('jokpe_schools', JSON.stringify(schools));
        
        // Clear fields
        document.getElementById('changeCurrentPassword').value = '';
        document.getElementById('changeNewPassword').value = '';
        document.getElementById('changeConfirmPassword').value = '';
        
        messageEl.textContent = 'Password changed successfully!';
        messageEl.style.color = '#27ae60';
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 3000);
    }
}

function loadSchoolSettings() {
    if (!currentSchool) return;
    
    // Load school info into main form fields
    document.getElementById('school-name').value = currentSchool.schoolName || '';
    document.getElementById('region').value = currentSchool.region || '';
    document.getElementById('community').value = currentSchool.community || '';
    document.getElementById('district').value = currentSchool.district || '';
    document.getElementById('circuit').value = currentSchool.circuit || '';
}