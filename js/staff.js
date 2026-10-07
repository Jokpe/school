// ===== STAFF MANAGEMENT SYSTEM =====
let staffRowCount = 0;
let currentStaffSortColumn = -1;
let currentStaffSortDirection = 'asc';

// ===== STAFF LOGIN CREDENTIALS STORAGE =====
const STAFF_LOGIN_KEY = 'jokpe_staff_logins';

// ===== INITIALIZE STAFF TABLE =====
function initStaffTable() {
    // Hide all other content
    document.querySelectorAll('.table-container > div').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show staff container
    const staffContainer = document.getElementById('staff-container');
    if (!staffContainer) {
        createStaffContainer();
    }
    document.getElementById('staff-container').classList.remove('hidden');
    
    // Load existing staff data
    loadStaffData();
    updateStaffStats();
}

// ===== CREATE STAFF CONTAINER =====
function createStaffContainer() {
    const container = document.createElement('div');
    container.id = 'staff-container';
    container.className = 'staff-container hidden';
    
    container.innerHTML = `
        <div class="staff-header">
            <h2><i class="fas fa-chalkboard-teacher"></i> Staff Management</h2>
            <p class="warning-text">
                ⚠️ Staff ID and Ghana Card Number are required for login access
            </p>
        </div>
        
        <div class="staff-controls">
            <button onclick="addStaffRow()"><i class="fas fa-user-plus"></i> Add Staff</button>
            <button onclick="saveStaffData()"><i class="fas fa-save"></i> Save All</button>
            <button onclick="exportStaffToExcel()"><i class="fas fa-file-excel"></i> Export Excel</button>
            <button onclick="exportStaffToPDF()"><i class="fas fa-file-pdf"></i> Export PDF</button>
            <div class="staff-delete-control">
                <input type="number" id="staff-delete-row" placeholder="Row #" min="1" style="width:60px; height:30px;">
                <button onclick="deleteStaffRow()" class="danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
        
        <div class="staff-search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="staff-search" placeholder="Search staff records..." oninput="searchStaffTable()">
            <button onclick="clearStaffSearch()" class="clear-btn">
                <i class="fas fa-times"></i> Clear
            </button>
        </div>
        
        <div class="staff-table-wrapper">
            <table id="staff-table" class="staff-table">
                <thead>
                    <tr>
                        <th onclick="sortStaffTable(0)" style="width:40px;">Sn<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(1)" style="min-width:150px;">Staff Full Name<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(2)" style="min-width:80px;">Sex<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(3)" style="min-width:120px;">Date of Birth<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(4)" style="min-width:120px;">Phone Number<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(5)" style="min-width:140px;">First Appointment Date<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(6)" style="min-width:120px;">Grade Appointed On<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(7)" style="min-width:120px; background-color: #e74c3c; color: white;">Staff ID *<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(8)" style="min-width:140px; background-color: #e74c3c; color: white;">Ghana Card No *<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(9)" style="min-width:120px;">SSNIT No<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(10)" style="min-width:100px;">Bank Name<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(11)" style="min-width:100px;">Branch<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(12)" style="min-width:140px;">Bank Account No<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(13)" style="min-width:150px;">Next of Kin Name<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(14)" style="min-width:120px;">Relation to Next of Kin<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(15)" style="min-width:140px;">Next of Kin Phone<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(16)" style="min-width:100px;">Marital Status<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(17)" style="min-width:120px;">Language Spoken<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(18)" style="min-width:100px;">No. of Children<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(19)" style="min-width:180px;">Home Address<span class="sort-indicator">↕</span></th>
                        <th onclick="sortStaffTable(20)" style="min-width:140px;">Digital Address<span class="sort-indicator">↕</span></th>
                        <th style="min-width:120px; background-color: #2ecc71; color: white;">Login Status</th>
                        <th style="min-width:100px;">Actions</th>
                    </tr>
                </thead>
                <tbody id="staff-body"></tbody>
            </table>
        </div>
        
        <div class="staff-stats">
            <span>Total Staff: <strong id="staff-total">0</strong></span>
            <span>With Login Access: <strong id="staff-login-count">0</strong></span>
            <span>Without Login: <strong id="staff-no-login-count" style="color:#e74c3c;">0</strong></span>
        </div>
        
        <div id="staffMessage" class="staff-message"></div>
    `;
    
    document.querySelector('.table-container').appendChild(container);
}

// ===== ADD STAFF ROW =====
function addStaffRow(data = null) {
    const tbody = document.getElementById('staff-body');
    const row = document.createElement('tr');
    const sn = tbody.children.length + 1;

    // Format dates if exists
    const formattedDob = data?.dob ? formatStaffDate(data.dob) : '';
    const formattedAppointmentDate = data?.appointmentDate ? formatStaffDate(data.appointmentDate) : '';

    row.innerHTML = `
        <td>${sn}</td>
        <td><input class="cell-input" type="text" placeholder="FEKPE ELIKPLIM" value="${data?.name || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <select class="cell-input">
                <option value="">Select</option>
                <option value="MALE" ${data?.sex === 'MALE' ? 'selected' : ''}>MALE</option>
                <option value="FEMALE" ${data?.sex === 'FEMALE' ? 'selected' : ''}>FEMALE</option>
            </select>
        </td>
        <td>
            <div class="date-container">
                <input class="cell-input date-input" type="text" placeholder="31ST JAN, 2026" value="${formattedDob}" onclick="setupStaffDatePicker(this)" readonly>
            </div>
        </td>
        <td><input class="cell-input" type="text" placeholder="0241224773" value="${data?.phone || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <div class="date-container">
                <input class="cell-input date-input" type="text" placeholder="31ST JAN, 2026" value="${formattedAppointmentDate}" onclick="setupStaffDatePicker(this)" readonly>
            </div>
        </td>
        <td>
            <select class="cell-input">
                <option value="">Select Grade</option>
                <option value="GRADE I" ${data?.grade === 'GRADE I' ? 'selected' : ''}>GRADE I</option>
                <option value="GRADE II" ${data?.grade === 'GRADE II' ? 'selected' : ''}>GRADE II</option>
                <option value="GRADE III" ${data?.grade === 'GRADE III' ? 'selected' : ''}>GRADE III</option>
                <option value="GRADE IV" ${data?.grade === 'GRADE IV' ? 'selected' : ''}>GRADE IV</option>
                <option value="GRADE V" ${data?.grade === 'GRADE V' ? 'selected' : ''}>GRADE V</option>
            </select>
        </td>
        <td><input class="cell-input required-field" type="text" placeholder="STAFF-001" value="${data?.staffId || ''}" oninput="this.value = this.value.toUpperCase()" style="background-color: #fff0f0;"></td>
        <td><input class="cell-input required-field" type="text" placeholder="GHA-0000000000-1" value="${data?.ghanaCard || ''}" oninput="this.value = this.value.toUpperCase()" style="background-color: #fff0f0;"></td>
        <td><input class="cell-input" type="text" placeholder="SSNIT-001" value="${data?.ssnit || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="GCB" value="${data?.bankName || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="HO MAIN" value="${data?.branch || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="0000000000" value="${data?.accountNo || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="FEKPE EMEFA" value="${data?.nextOfKin || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="SPOUSE" value="${data?.relation || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="0241224773" value="${data?.nextOfKinPhone || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <select class="cell-input">
                <option value="">Select</option>
                <option value="SINGLE" ${data?.maritalStatus === 'SINGLE' ? 'selected' : ''}>SINGLE</option>
                <option value="MARRIED" ${data?.maritalStatus === 'MARRIED' ? 'selected' : ''}>MARRIED</option>
                <option value="DIVORCED" ${data?.maritalStatus === 'DIVORCED' ? 'selected' : ''}>DIVORCED</option>
                <option value="WIDOWED" ${data?.maritalStatus === 'WIDOWED' ? 'selected' : ''}>WIDOWED</option>
            </select>
        </td>
        <td><input class="cell-input" type="text" placeholder="ENGLISH, EWE " value="${data?.languages || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="number" min="0" placeholder="0" value="${data?.children || ''}"></td>
        <td><input class="cell-input" type="text" placeholder="HO, VOLTA REGION" value="${data?.homeAddress || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="AK-0097-6878" value="${data?.digitalAddress || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <span class="login-status ${hasLoginAccess(data) ? 'active' : 'inactive'}">
                ${hasLoginAccess(data) ? '✅ ACTIVE' : '❌ INACTIVE'}
            </span>
        </td>
        <td>
            <button class="action-btn login" onclick="generateStaffLogin(this)" ${hasLoginAccess(data) ? 'disabled style="opacity:0.5;"' : ''}>
                <i class="fas fa-key"></i> Generate Login
            </button>
            <button class="action-btn reset" onclick="resetStaffLogin(this)">
                <i class="fas fa-undo"></i> Reset
            </button>
        </td>
    `;

    tbody.appendChild(row);
    staffRowCount++;
    updateStaffSerialNumbers();
    document.getElementById('staffMessage').textContent = '';
    updateStaffStats();
    searchStaffTable();
}

// ===== CHECK IF STAFF HAS LOGIN ACCESS =====
function hasLoginAccess(data) {
    if (!data) return false;
    // Staff ID and Ghana Card must both be present for login access
    return data.staffId && data.staffId.trim() !== '' && 
           data.ghanaCard && data.ghanaCard.trim() !== '';
}

// ===== GENERATE STAFF LOGIN =====
function generateStaffLogin(button) {
    const row = button.closest('tr');
    const staffIdInput = row.cells[7].querySelector('input');
    const ghanaCardInput = row.cells[8].querySelector('input');
    const nameInput = row.cells[1].querySelector('input');
    
    const staffId = staffIdInput.value.trim();
    const ghanaCard = ghanaCardInput.value.trim();
    const name = nameInput.value.trim();
    
    if (!staffId) {
        showStaffMessage('Staff ID is required to generate login credentials!', 'error');
        staffIdInput.focus();
        staffIdInput.style.border = '2px solid #e74c3c';
        setTimeout(() => staffIdInput.style.border = '', 3000);
        return;
    }
    
    if (!ghanaCard) {
        showStaffMessage('Ghana Card Number is required to generate login credentials!', 'error');
        ghanaCardInput.focus();
        ghanaCardInput.style.border = '2px solid #e74c3c';
        setTimeout(() => ghanaCardInput.style.border = '', 3000);
        return;
    }
    
    if (!name) {
        showStaffMessage('Staff name is required for login credentials!', 'error');
        nameInput.focus();
        nameInput.style.border = '2px solid #e74c3c';
        setTimeout(() => nameInput.style.border = '', 3000);
        return;
    }
    
    // Check if staff ID already exists in the system
    const staffLogins = JSON.parse(localStorage.getItem(STAFF_LOGIN_KEY) || '{}');
    if (staffLogins[staffId]) {
        showStaffMessage(`Staff ID "${staffId}" already has login credentials!`, 'error');
        staffIdInput.focus();
        staffIdInput.style.border = '2px solid #e74c3c';
        setTimeout(() => staffIdInput.style.border = '', 3000);
        return;
    }
    
    // Check if Ghana Card already exists in the system
    for (const [id, data] of Object.entries(staffLogins)) {
        if (data.ghanaCard === ghanaCard) {
            showStaffMessage(`Ghana Card "${ghanaCard}" is already registered to staff ID "${id}"!`, 'error');
            ghanaCardInput.focus();
            ghanaCardInput.style.border = '2px solid #e74c3c';
            setTimeout(() => ghanaCardInput.style.border = '', 3000);
            return;
        }
    }
    
    // Generate login credentials
    const username = staffId.toLowerCase();
    const password = generateStaffPassword();
    
    // Store login credentials
    staffLogins[staffId] = {
        staffId: staffId,
        ghanaCard: ghanaCard,
        name: name,
        username: username,
        password: password,
        schoolCode: currentSchool?.schoolCode || 'default',
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(STAFF_LOGIN_KEY, JSON.stringify(staffLogins));
    
    // Update login status in table
    const statusCell = row.cells[21];
    statusCell.innerHTML = '<span class="login-status active">✅ ACTIVE</span>';
    
    // Disable the generate button
    button.disabled = true;
    button.style.opacity = '0.5';
    
    // Show credentials to user
    showStaffMessage(
        `✅ Login credentials generated successfully!<br>
         <strong>Username:</strong> ${username}<br>
         <strong>Password:</strong> ${password}<br>
         <strong>School Code:</strong> ${currentSchool?.schoolCode || 'default'}`,
        'success'
    );
    
    updateStaffStats();
}

// ===== GENERATE STAFF PASSWORD =====
function generateStaffPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// ===== RESET STAFF LOGIN =====
function resetStaffLogin(button) {
    const row = button.closest('tr');
    const staffIdInput = row.cells[7].querySelector('input');
    const staffId = staffIdInput.value.trim();
    
    if (!staffId) {
        showStaffMessage('Staff ID not found!', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to reset login credentials for staff ID "${staffId}"? This will remove their access.`)) {
        return;
    }
    
    // Remove from login storage
    const staffLogins = JSON.parse(localStorage.getItem(STAFF_LOGIN_KEY) || '{}');
    if (staffLogins[staffId]) {
        delete staffLogins[staffId];
        localStorage.setItem(STAFF_LOGIN_KEY, JSON.stringify(staffLogins));
        
        // Update login status in table
        const statusCell = row.cells[21];
        statusCell.innerHTML = '<span class="login-status inactive">❌ INACTIVE</span>';
        
        // Enable the generate button
        const generateBtn = row.cells[22].querySelector('.action-btn.login');
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.style.opacity = '1';
        }
        
        showStaffMessage(`Login credentials for "${staffId}" have been reset successfully.`, 'info');
        updateStaffStats();
    } else {
        showStaffMessage(`No login credentials found for staff ID "${staffId}".`, 'info');
    }
}

// ===== STAFF DATE PICKER SETUP =====
function setupStaffDatePicker(input) {
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.style.position = 'absolute';
    datePicker.style.opacity = '0';
    datePicker.style.pointerEvents = 'none';
    datePicker.style.width = '0';
    datePicker.style.height = '0';
    datePicker.style.zIndex = '-1';
    
    const currentValue = input.value;
    const parsedDate = parseStaffDate(currentValue);
    if (parsedDate) {
        datePicker.value = parsedDate;
    }
    
    const rect = input.getBoundingClientRect();
    datePicker.style.left = rect.left + 'px';
    datePicker.style.top = rect.top + 'px';
    
    document.body.appendChild(datePicker);
    
    setTimeout(() => {
        datePicker.showPicker();
    }, 10);
    
    datePicker.addEventListener('input', function() {
        if (this.value) {
            input.value = formatStaffDate(this.value);
            input.dispatchEvent(new Event('change'));
        }
        document.body.removeChild(this);
    });
    
    datePicker.addEventListener('blur', function() {
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 100);
    });
    
    datePicker.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            setTimeout(() => {
                if (document.body.contains(this)) {
                    document.body.removeChild(this);
                }
            }, 50);
        }
    });
}

// ===== DATE FORMATTING FUNCTIONS =====
function formatStaffDate(dateValue) {
    if (!dateValue) return '';
    
    let dateObj;
    
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = dateValue.split('-');
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else if (dateValue instanceof Date) {
        dateObj = dateValue;
    } else {
        dateObj = new Date(dateValue);
    }
    
    if (isNaN(dateObj.getTime())) return '';
    
    const day = dateObj.getDate();
    let ordinal = 'th';
    if (day === 1 || day === 21 || day === 31) ordinal = 'st';
    else if (day === 2 || day === 22) ordinal = 'nd';
    else if (day === 3 || day === 23) ordinal = 'rd';
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    return `${day}${ordinal.toUpperCase()} ${month}, ${year}`;
}

function parseStaffDate(formattedDate) {
    if (!formattedDate) return '';
    
    const match = formattedDate.match(/^(\d+)(?:st|nd|rd|th)\s+([A-Z]{3}),\s+(\d{4})$/i);
    if (match) {
        const day = parseInt(match[1]);
        const month = match[2].toUpperCase();
        const year = parseInt(match[3]);
        
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthIndex = months.indexOf(month);
        
        if (monthIndex !== -1) {
            return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
    }
    
    const dateObj = new Date(formattedDate);
    if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    return '';
}

// ===== DELETE STAFF ROW =====
function deleteStaffRow() {
    const rowNum = parseInt(document.getElementById('staff-delete-row').value);
    if (isNaN(rowNum) || rowNum < 1) {
        alert('Please enter a valid row number.');
        return;
    }

    const tbody = document.getElementById('staff-body');
    const rows = tbody.querySelectorAll('tr');
    if (rowNum > rows.length) {
        alert(`Row ${rowNum} does not exist.`);
        return;
    }

    if (!confirm(`Delete staff record #${rowNum}? This cannot be undone.`)) return;

    // Check if staff has login credentials
    const row = rows[rowNum - 1];
    const staffIdInput = row.cells[7].querySelector('input');
    const staffId = staffIdInput.value.trim();
    
    if (staffId) {
        const staffLogins = JSON.parse(localStorage.getItem(STAFF_LOGIN_KEY) || '{}');
        if (staffLogins[staffId]) {
            if (!confirm(`Staff ID "${staffId}" has login credentials. Delete anyway? This will remove their login access.`)) {
                return;
            }
            delete staffLogins[staffId];
            localStorage.setItem(STAFF_LOGIN_KEY, JSON.stringify(staffLogins));
        }
    }

    row.remove();
    updateStaffSerialNumbers();
    document.getElementById('staff-delete-row').value = '';
    document.getElementById('staffMessage').textContent = '';
    updateStaffStats();
}

// ===== UPDATE STAFF SERIAL NUMBERS =====
function updateStaffSerialNumbers() {
    const rows = document.querySelectorAll('#staff-body tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// ===== UPDATE STAFF STATS =====
function updateStaffStats() {
    const tbody = document.getElementById('staff-body');
    const allRows = tbody.querySelectorAll('tr');
    
    let totalStaff = 0;
    let loginCount = 0;
    
    allRows.forEach(row => {
        const staffId = row.cells[7].querySelector('input').value.trim();
        const ghanaCard = row.cells[8].querySelector('input').value.trim();
        const name = row.cells[1].querySelector('input').value.trim();
        
        // Only count rows with name
        if (name) {
            totalStaff++;
            if (staffId && ghanaCard) {
                loginCount++;
            }
        }
    });
    
    document.getElementById('staff-total').textContent = totalStaff;
    document.getElementById('staff-login-count').textContent = loginCount;
    document.getElementById('staff-no-login-count').textContent = totalStaff - loginCount;
}

// ===== SEARCH STAFF TABLE =====
function searchStaffTable() {
    const searchTerm = document.getElementById('staff-search').value.toUpperCase();
    const tbody = document.getElementById('staff-body');
    const rows = tbody.querySelectorAll('tr');
    
    if (!searchTerm) {
        rows.forEach(row => row.style.display = '');
        updateStaffStats();
        return;
    }
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let show = false;
        
        cells.forEach((cell, index) => {
            if (index === 0) return;
            const input = cell.querySelector('input, select');
            const value = input ? input.value.toUpperCase() : cell.textContent.toUpperCase();
            if (value.includes(searchTerm)) {
                show = true;
            }
        });
        
        row.style.display = show ? '' : 'none';
    });
    
    updateStaffStats();
}

// ===== CLEAR STAFF SEARCH =====
function clearStaffSearch() {
    document.getElementById('staff-search').value = '';
    searchStaffTable();
}

// ===== SORT STAFF TABLE =====
function sortStaffTable(columnIndex) {
    const tbody = document.getElementById('staff-body');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    if (currentStaffSortColumn === columnIndex) {
        currentStaffSortDirection = currentStaffSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentStaffSortColumn = columnIndex;
        currentStaffSortDirection = 'asc';
    }
    
    updateStaffSortIndicators(columnIndex);
    
    rows.sort((a, b) => {
        const aValue = getStaffCellValue(a, columnIndex);
        const bValue = getStaffCellValue(b, columnIndex);
        
        if (currentStaffSortDirection === 'asc') {
            return compareStaffValues(aValue, bValue);
        } else {
            return compareStaffValues(bValue, aValue);
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    updateStaffSerialNumbers();
    updateStaffStats();
}

function getStaffCellValue(row, columnIndex) {
    const cell = row.cells[columnIndex];
    if (!cell) return '';
    
    const input = cell.querySelector('input, select');
    if (input) {
        return input.value || '';
    }
    return cell.textContent.trim();
}

function compareStaffValues(a, b) {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
    }
    return a.toString().localeCompare(b.toString());
}

function updateStaffSortIndicators(columnIndex) {
    const headers = document.querySelectorAll('#staff-table th');
    headers.forEach((th, index) => {
        if (index === columnIndex) {
            th.innerHTML = th.textContent.replace(/ [▲▼]/, '') + 
                (currentStaffSortDirection === 'asc' ? ' ▲' : ' ▼');
        } else {
            th.innerHTML = th.textContent.replace(/ [▲▼]/, '');
        }
    });
}

// ===== SHOW STAFF MESSAGE =====
function showStaffMessage(message, type = 'info') {
    const messageEl = document.getElementById('staffMessage');
    messageEl.innerHTML = message;
    messageEl.className = 'staff-message ' + type;
    
    // Auto-clear success messages after 10 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'staff-message';
        }, 10000);
    }
}

// ===== SAVE STAFF DATA =====
function saveStaffData() {
    const rows = document.querySelectorAll('#staff-body tr');
    if (rows.length === 0) {
        showStaffMessage('No staff data to save.', 'info');
        return;
    }
    
    const data = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        const dobInput = cells[3].querySelector('.date-input');
        const appointmentDateInput = cells[5].querySelector('.date-input');
        
        return {
            name: cells[1].querySelector('input').value.toUpperCase(),
            sex: cells[2].querySelector('select').value,
            dob: dobInput ? dobInput.value : '',
            phone: cells[4].querySelector('input').value.toUpperCase(),
            appointmentDate: appointmentDateInput ? appointmentDateInput.value : '',
            grade: cells[6].querySelector('select').value,
            staffId: cells[7].querySelector('input').value.toUpperCase(),
            ghanaCard: cells[8].querySelector('input').value.toUpperCase(),
            ssnit: cells[9].querySelector('input').value.toUpperCase(),
            bankName: cells[10].querySelector('input').value.toUpperCase(),
            branch: cells[11].querySelector('input').value.toUpperCase(),
            accountNo: cells[12].querySelector('input').value.toUpperCase(),
            nextOfKin: cells[13].querySelector('input').value.toUpperCase(),
            relation: cells[14].querySelector('input').value.toUpperCase(),
            nextOfKinPhone: cells[15].querySelector('input').value.toUpperCase(),
            maritalStatus: cells[16].querySelector('select').value,
            languages: cells[17].querySelector('input').value.toUpperCase(),
            children: cells[18].querySelector('input').value,
            homeAddress: cells[19].querySelector('input').value.toUpperCase(),
            digitalAddress: cells[20].querySelector('input').value.toUpperCase()
        };
    });

    const key = `staffData_${currentSchool?.schoolCode || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
    showStaffMessage('Staff data saved successfully!', 'success');
    updateStaffStats();
}

// ===== LOAD STAFF DATA =====
function loadStaffData() {
    const key = `staffData_${currentSchool?.schoolCode || 'default'}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
        updateStaffStats();
        return;
    }

    try {
        const data = JSON.parse(raw);
        const tbody = document.getElementById('staff-body');
        tbody.innerHTML = '';
        
        data.forEach(staff => {
            addStaffRow(staff);
        });
        
        updateStaffStats();
    } catch (e) {
        console.error('Error loading staff data:', e);
        updateStaffStats();
    }
}

// ===== EXPORT STAFF TO EXCEL =====
function exportStaffToExcel() {
    const table = document.getElementById('staff-table');
    if (!table) {
        showStaffMessage('No staff data to export.', 'error');
        return;
    }
    
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Staff Data' });
    const title = document.getElementById('school-name').value || 'School';
    XLSX.writeFile(wb, `${title}_Staff_Data.xlsx`);
    showStaffMessage('Staff data exported to Excel successfully!', 'success');
}

// ===== EXPORT STAFF TO PDF =====
function exportStaffToPDF() {
    const doc = new jsPDF({
        orientation: 'landscape'
    });
    
    const table = document.getElementById('staff-table');
    if (!table) {
        showStaffMessage('No staff data to export.', 'error');
        return;
    }
    
    // Clone the table for PDF
    const tableClone = table.cloneNode(true);
    // Remove action buttons column
    const lastTh = tableClone.querySelector('thead tr:last-child th:last-child');
    if (lastTh) lastTh.remove();
    tableClone.querySelectorAll('tr').forEach(row => {
        const lastTd = row.querySelector('td:last-child');
        if (lastTd) lastTd.remove();
    });
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.appendChild(tableClone);
    document.body.appendChild(tempDiv);
    
    doc.autoTable({
        html: tableClone,
        styles: { 
            fontSize: 7,
            cellPadding: 2,
            overflow: 'linebreak'
        },
        margin: { top: 20 },
        didDrawPage: function(data) {
            const title = document.getElementById('school-name').value || 'School';
            doc.text(`${title} - Staff Data`, data.settings.margin.left, 15);
        }
    });
    
    document.body.removeChild(tempDiv);
    
    const title = document.getElementById('school-name').value || 'School';
    doc.save(`${title}_Staff_Data.pdf`);
    showStaffMessage('Staff data exported to PDF successfully!', 'success');
}

// ===== STAFF LOGIN VERIFICATION =====
function verifyStaffLogin(staffId, password) {
    const staffLogins = JSON.parse(localStorage.getItem(STAFF_LOGIN_KEY) || '{}');
    const staffData = staffLogins[staffId];
    
    if (!staffData) {
        return { success: false, error: 'Invalid staff ID' };
    }
    
    if (staffData.password !== password) {
        return { success: false, error: 'Invalid password' };
    }
    
    return { success: true, data: staffData };
}

// ===== GET ALL STAFF WITH LOGIN ACCESS =====
function getStaffWithLogin() {
    const staffLogins = JSON.parse(localStorage.getItem(STAFF_LOGIN_KEY) || '{}');
    return Object.values(staffLogins).filter(staff => 
        staff.schoolCode === (currentSchool?.schoolCode || 'default')
    );
}

// ===== STAFF LOGIN FOR SCHOOL SYSTEM =====
function staffLogin(staffId, password) {
    const result = verifyStaffLogin(staffId, password);
    if (result.success) {
        // Set session
        sessionStorage.setItem('staff_session', JSON.stringify({
            staffId: result.data.staffId,
            name: result.data.name,
            loginTime: new Date().toISOString()
        }));
        return { success: true, message: 'Login successful!' };
    }
    return result;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if staff container exists when staff management is clicked
    const staffMenuItem = document.querySelector('[onclick="showContent(\'addStaff\')"]');
    if (staffMenuItem) {
        staffMenuItem.addEventListener('click', function(e) {
            setTimeout(initStaffTable, 100);
        });
    }
    
    // Also handle the staffList menu item
    const staffListMenuItem = document.querySelector('[onclick="showContent(\'staffList\')"]');
    if (staffListMenuItem) {
        staffListMenuItem.addEventListener('click', function(e) {
            setTimeout(initStaffTable, 100);
        });
    }
});