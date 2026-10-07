// ===== ADMISSION TABLE =====
let admissionRowCount = 0;
let currentSortColumn = -1;
let currentSortDirection = 'asc';

function createAdmissionTable() {
    // Load saved data on initialization
    loadAdmissionData();
    populateClassroomDropdown();
}

// ===== POPULATE CLASSROOM DROPDOWN =====
function populateClassroomDropdown() {
    const classroomSelects = document.querySelectorAll('.classroom-select');
    if (classroomSelects.length === 0) return;
    
    // Get all saved files from localStorage
    const savedFiles = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('schoolData_')) {
            const saveName = key.replace('schoolData_', '');
            savedFiles.push(saveName);
        }
    }
    
    // Populate all classroom dropdowns
    classroomSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Classroom</option>';
        
        savedFiles.forEach(fileName => {
            const option = document.createElement('option');
            option.value = fileName;
            option.textContent = fileName;
            select.appendChild(option);
        });
        
        // Restore previous selection if exists
        if (currentValue && savedFiles.includes(currentValue)) {
            select.value = currentValue;
            // Make sure the selected text is visible
            select.style.color = 'black';
        }
    });
}

// ===== DATE FORMATTING FUNCTIONS =====
function formatDate(dateValue) {
    if (!dateValue) return '';
    
    let dateObj;
    
    // If it's a string in YYYY-MM-DD format (from date input)
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = dateValue.split('-');
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else if (dateValue instanceof Date) {
        dateObj = dateValue;
    } else {
        // Try to parse as a date
        dateObj = new Date(dateValue);
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    // Get day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const day = dateObj.getDate();
    let ordinal = 'th';
    if (day === 1 || day === 21 || day === 31) ordinal = 'st';
    else if (day === 2 || day === 22) ordinal = 'nd';
    else if (day === 3 || day === 23) ordinal = 'rd';
    
    // Get month in 3-letter uppercase format
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[dateObj.getMonth()];
    
    // Get year
    const year = dateObj.getFullYear();
    
    // Return formatted date: 31ST JAN, 2026
    return `${day}${ordinal.toUpperCase()} ${month}, ${year}`;
}

// ===== PARSE FORMATTED DATE BACK TO YYYY-MM-DD =====
function parseFormattedDate(formattedDate) {
    if (!formattedDate) return '';
    
    // Try to parse "31ST JAN, 2026" format
    const match = formattedDate.match(/^(\d+)(?:st|nd|rd|th)\s+([A-Z]{3}),\s+(\d{4})$/i);
    if (match) {
        const day = parseInt(match[1]);
        const month = match[2].toUpperCase();
        const year = parseInt(match[3]);
        
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthIndex = months.indexOf(month);
        
        if (monthIndex !== -1) {
            // Return as YYYY-MM-DD for date input
            return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
    }
    
    // Try to parse as date string
    const dateObj = new Date(formattedDate);
    if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    return '';
}

// ===== GET FORMATTED DATE FROM VALUE =====
function getFormattedDate(value) {
    if (!value) return '';
    
    // If it's already in formatted format (31ST JAN, 2026), return as is
    if (value.match(/^(\d+)(?:st|nd|rd|th)\s+([A-Z]{3}),\s+(\d{4})$/i)) {
        return value;
    }
    
    // If it's a date string or YYYY-MM-DD, format it
    return formatDate(value);
}

// ===== DATE INPUT HANDLER =====
function handleDateInput(input) {
    let value = input.value.trim();
    
    // If empty, clear the input
    if (!value) {
        input.value = '';
        return;
    }
    
    // Convert to uppercase for consistent formatting
    value = value.toUpperCase();
    
    // If it's already in the correct format, keep it
    if (value.match(/^(\d+)(?:ST|ND|RD|TH)\s+([A-Z]{3}),\s+(\d{4})$/)) {
        input.value = value;
        return;
    }
    
    // Try to parse as a date
    const dateObj = new Date(value);
    if (!isNaN(dateObj.getTime())) {
        input.value = formatDate(dateObj);
        return;
    }
    
    // If it's YYYY-MM-DD format, format it
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        input.value = formatDate(value);
        return;
    }
}

// ===== DATE PICKER SETUP =====
function setupDatePicker(input) {
    // Create a hidden date input for the picker
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.style.position = 'absolute';
    datePicker.style.opacity = '0';
    datePicker.style.pointerEvents = 'none';
    datePicker.style.width = '0';
    datePicker.style.height = '0';
    datePicker.style.zIndex = '-1';
    
    // Parse current value to set the date picker value
    const currentValue = input.value;
    const parsedDate = parseFormattedDate(currentValue);
    if (parsedDate) {
        datePicker.value = parsedDate;
    }
    
    // Position the date picker near the input
    const rect = input.getBoundingClientRect();
    datePicker.style.left = rect.left + 'px';
    datePicker.style.top = rect.top + 'px';
    
    document.body.appendChild(datePicker);
    
    // Show the date picker
    setTimeout(() => {
        datePicker.showPicker();
    }, 10);
    
    // When date is selected, update the input
    datePicker.addEventListener('input', function() {
        if (this.value) {
            input.value = formatDate(this.value);
            // Trigger change event for stats update
            input.dispatchEvent(new Event('change'));
        }
        document.body.removeChild(this);
    });
    
    // Clean up if user cancels
    datePicker.addEventListener('blur', function() {
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 100);
    });
    
    // Also clean up on escape key
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

function addAdmissionRow(data = null) {
    const tbody = document.getElementById('admission-body');
    const row = document.createElement('tr');
    const sn = tbody.children.length + 1;

    // Get all saved files for classroom dropdown
    const savedFiles = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('schoolData_')) {
            const saveName = key.replace('schoolData_', '');
            savedFiles.push(saveName);
        }
    }

    // Build dropdown options
    let dropdownOptions = '<option value="">Select Classroom</option>';
    savedFiles.forEach(fileName => {
        dropdownOptions += `<option value="${fileName}" ${data?.classroom === fileName ? 'selected' : ''}>${fileName}</option>`;
    });

    // Format the date if it exists
    const formattedDate = getFormattedDate(data?.dob);
    const formattedAdmissionDate = getFormattedDate(data?.date);

    row.innerHTML = `
        <td style="background-color: goldenrod;">${sn}</td>
        <td><input class="cell-input" type="text" placeholder="FEKPE ELIKPLIM" value="${data?.name || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <select class="cell-input">
                <option value="">Select</option>
                <option value="MALE" ${data?.sex === 'MALE' ? 'selected' : ''}>MALE</option>
                <option value="FEMALE" ${data?.sex === 'FEMALE' ? 'selected' : ''}>FEMALE</option>
            </select>
        </td>
        <td><input class="cell-input" type="text" placeholder="00001" value="${data?.admissionNo || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <div class="date-container">
                <input class="cell-input date-input" style="background-color: lightsalmon;" type="text" placeholder="31ST JAN, 2026" value="${formattedDate}" onchange="handleDateInput(this)" onclick="setupDatePicker(this)" readonly>
            </div>
        </td>
        <td><input class="cell-input" type="text" placeholder="GHA-0000000000-1" value="${data?.ghanaCard || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="FEKPE EMEFA" value="${data?.guardianName || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <select class="cell-input">
                <option value="">Select</option>
                <option value="MALE" ${data?.guardianSex === 'MALE' ? 'selected' : ''}>MALE</option>
                <option value="FEMALE" ${data?.guardianSex === 'FEMALE' ? 'selected' : ''}>FEMALE</option>
            </select>
        </td>
        <td>
            <select class="cell-input">
                <option value="">Select Class</option>
                <option value="KG1" ${data?.class === 'KG1' ? 'selected' : ''}>KG1</option>
                <option value="KG2" ${data?.class === 'KG2' ? 'selected' : ''}>KG2</option>
                <option value="BASIC1" ${data?.class === 'BASIC1' ? 'selected' : ''}>BASIC 1</option>
                <option value="BASIC2" ${data?.class === 'BASIC2' ? 'selected' : ''}>BASIC 2</option>
                <option value="BASIC3" ${data?.class === 'BASIC3' ? 'selected' : ''}>BASIC 3</option>
                <option value="BASIC4" ${data?.class === 'BASIC4' ? 'selected' : ''}>BASIC 4</option>
                <option value="BASIC5" ${data?.class === 'BASIC5' ? 'selected' : ''}>BASIC 5</option>
                <option value="BASIC6" ${data?.class === 'BASIC6' ? 'selected' : ''}>BASIC 6</option>
                <option value="JHS1" ${data?.class === 'JHS1' ? 'selected' : ''}>JHS 1</option>
                <option value="JHS2" ${data?.class === 'JHS2' ? 'selected' : ''}>JHS 2</option>
                <option value="JHS3" ${data?.class === 'JHS3' ? 'selected' : ''}>JHS 3</option>
                <option value="SHS1" ${data?.class === 'SHS1' ? 'selected' : ''}>SHS 1</option>
                <option value="SHS2" ${data?.class === 'SHS2' ? 'selected' : ''}>SHS 2</option>
                <option value="SHS3" ${data?.class === 'SHS3' ? 'selected' : ''}>SHS 3</option>
            </select>
        </td>
        <td><input class="cell-input" type="text" placeholder="ANDO-NYAMANU" value="${data?.community || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="NC-0097-6878" value="${data?.digitalAddress || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td><input class="cell-input" type="text" placeholder="0241224773" value="${data?.phone || ''}" oninput="this.value = this.value.toUpperCase()"></td>
        <td>
            <div class="date-container">
                <input class="cell-input date-input" style="background-color: lightsalmon;" type="text" placeholder="31ST JAN, 2026" value="${formattedAdmissionDate}" onchange="handleDateInput(this)" onclick="setupDatePicker(this)" readonly>
            </div>
        </td>
        <td>
            <select class="cell-input classroom-select" onchange="onClassroomChange(this)" style="color: black;">
                ${dropdownOptions}
            </select>
        </td>
    `;

    tbody.appendChild(row);
    admissionRowCount++;
    updateAdmissionSerialNumbers();
    document.getElementById('admissionMessage').textContent = '';
    
    // Add event listeners to update stats when name or sex changes
    const nameInput = row.cells[1].querySelector('input');
    const sexSelect = row.cells[2].querySelector('select');
    
    nameInput.addEventListener('input', updateAdmissionStats);
    sexSelect.addEventListener('change', updateAdmissionStats);
    
    // Ensure existing data is converted to uppercase
    const textInputs = row.querySelectorAll('input[type="text"]:not(.date-input)');
    textInputs.forEach(input => {
        if (input.value) {
            input.value = input.value.toUpperCase();
        }
    });
    
    searchTable(); // Apply current search to new row
    updateAdmissionStats(); // Update stats
}

// ===== CLASSROOM CHANGE HANDLER =====
function onClassroomChange(selectElement) {
    const selectedClassroom = selectElement.value;
    
    // Make sure the selected classroom name is visible
    if (selectedClassroom) {
        selectElement.style.color = 'black';
        selectElement.style.fontWeight = 'bold';
    } else {
        selectElement.style.color = 'gray';
        selectElement.style.fontWeight = 'normal';
    }
    
    if (!selectedClassroom) return;
    
    // Get the row containing this select
    const row = selectElement.closest('tr');
    const nameInput = row.cells[1].querySelector('input');
    const sexSelect = row.cells[2].querySelector('select');
    
    const studentName = nameInput.value.trim();
    const studentSex = sexSelect.value;
    
    if (!studentName || !studentSex) {
        alert('Please enter student name and sex before assigning to a classroom.');
        selectElement.value = '';
        selectElement.style.color = 'gray';
        selectElement.style.fontWeight = 'normal';
        return;
    }
    
    // Load the classroom data
    const rawData = localStorage.getItem(`schoolData_${selectedClassroom}`);
    if (!rawData) {
        alert(`Classroom "${selectedClassroom}" not found.`);
        selectElement.value = '';
        selectElement.style.color = 'gray';
        selectElement.style.fontWeight = 'normal';
        return;
    }
    
    try {
        const data = JSON.parse(rawData);
        
        // Check if student already exists in this classroom
        const existingStudent = data.register?.students?.find(s => 
            s.name.toUpperCase() === studentName.toUpperCase()
        );
        
        if (existingStudent) {
            alert(`Student "${studentName}" already exists in classroom "${selectedClassroom}".`);
            selectElement.value = '';
            selectElement.style.color = 'gray';
            selectElement.style.fontWeight = 'normal';
            return;
        }
        
        // Add student to the classroom data
        if (!data.register) data.register = { students: [] };
        if (!data.register.students) data.register.students = [];
        
        // Convert sex to M/F format (uppercase)
        const genderCode = studentSex === 'MALE' ? 'M' : 'F';
        
        // Create attendance array (16 weeks × 5 days)
        const attendance = Array(TOTAL_WEEKS * DAYS_PER_WEEK).fill(false);
        
        data.register.students.push({
            name: studentName,
            gender: genderCode,
            attendance: attendance
        });
        
        // Update the classroom data in localStorage
        localStorage.setItem(`schoolData_${selectedClassroom}`, JSON.stringify(data));
        
        // Auto-load the classroom data into the main tables
        autoLoadData(selectedClassroom);
        
        alert(`Student "${studentName}" added to classroom "${selectedClassroom}" successfully!`);
        
    } catch (error) {
        console.error('Error updating classroom data:', error);
        alert('Error updating classroom data. Please try again.');
        selectElement.value = '';
        selectElement.style.color = 'gray';
        selectElement.style.fontWeight = 'normal';
    }
}

function deleteAdmissionRow() {
    const rowNum = parseInt(document.getElementById('admission-delete-row').value);
    if (isNaN(rowNum) || rowNum < 1) {
        alert('Please enter a valid row number.');
        return;
    }

    const tbody = document.getElementById('admission-body');
    const rows = tbody.querySelectorAll('tr');
    if (rowNum > rows.length) {
        alert(`Row ${rowNum} does not exist.`);
        return;
    }

    if (!confirm(`Delete admission record #${rowNum}? This cannot be undone.`)) return;

    rows[rowNum - 1].remove();
    updateAdmissionSerialNumbers();
    document.getElementById('admission-delete-row').value = '';
    document.getElementById('admissionMessage').textContent = '';
    updateAdmissionStats(); // Update stats
}

function updateAdmissionSerialNumbers() {
    const rows = document.querySelectorAll('#admission-body tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// ===== STATS UPDATE FUNCTION =====
function updateAdmissionStats() {
    const tbody = document.getElementById('admission-body');
    const allRows = tbody.querySelectorAll('tr');
    const visibleRows = Array.from(allRows).filter(row => row.style.display !== 'none');
    
    // Count only rows with name AND sex filled in
    let completeRows = 0;
    let completeVisibleRows = 0;
    
    allRows.forEach(row => {
        const nameInput = row.cells[1].querySelector('input');
        const sexSelect = row.cells[2].querySelector('select');
        
        const hasName = nameInput && nameInput.value.trim() !== '';
        const hasSex = sexSelect && sexSelect.value !== '';
        
        if (hasName && hasSex) {
            completeRows++;
            if (row.style.display !== 'none') {
                completeVisibleRows++;
            }
        }
    });
    
    document.getElementById('admission-total').textContent = completeRows;
    document.getElementById('admission-visible').textContent = completeVisibleRows;
}

// ===== SORT FUNCTION =====
function sortTable(columnIndex) {
    const tbody = document.getElementById('admission-body');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Toggle sort direction
    if (currentSortColumn === columnIndex) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = columnIndex;
        currentSortDirection = 'asc';
    }
    
    // Update sort indicator in header
    updateSortIndicators(columnIndex);
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = getCellValue(a, columnIndex);
        const bValue = getCellValue(b, columnIndex);
        
        if (currentSortDirection === 'asc') {
            return compareValues(aValue, bValue);
        } else {
            return compareValues(bValue, aValue);
        }
    });
    
    // Re-append rows in sorted order
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    
    // Update serial numbers
    updateAdmissionSerialNumbers();
    updateAdmissionStats(); // Update stats
}

function getCellValue(row, columnIndex) {
    const cell = row.cells[columnIndex];
    if (!cell) return '';
    
    const input = cell.querySelector('input, select');
    if (input) {
        let value = input.value || '';
        return value.toUpperCase();
    }
    return cell.textContent.trim().toUpperCase();
}

function compareValues(a, b) {
    // Try to compare as numbers first
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
    }
    
    // Compare as dates if they look like dates (formatted date)
    const formattedDatePattern = /^(\d+)(?:st|nd|rd|th)\s+([A-Z]{3}),\s+(\d{4})$/i;
    
    if (a.match(formattedDatePattern) && b.match(formattedDatePattern)) {
        const dateA = new Date(a.replace(/(st|nd|rd|th)/i, ''));
        const dateB = new Date(b.replace(/(st|nd|rd|th)/i, ''));
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return dateA - dateB;
        }
    }
    
    // Compare as strings (case insensitive)
    return a.toString().localeCompare(b.toString());
}

function updateSortIndicators(columnIndex) {
    const headers = document.querySelectorAll('#admission-table th');
    headers.forEach((th, index) => {
        if (index === columnIndex) {
            th.innerHTML = th.textContent.replace(/ [▲▼]/, '') + 
                (currentSortDirection === 'asc' ? ' ▲' : ' ▼');
        } else {
            th.innerHTML = th.textContent.replace(/ [▲▼]/, '');
        }
    });
}

// ===== SEARCH FUNCTION (Single search across all fields) =====
function searchTable() {
    const searchTerm = document.getElementById('admission-search').value.toUpperCase();
    const tbody = document.getElementById('admission-body');
    const rows = tbody.querySelectorAll('tr');
    
    // If search is empty, show all rows
    if (!searchTerm) {
        rows.forEach(row => row.style.display = '');
        updateAdmissionStats();
        return;
    }
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let show = false;
        
        // Check each cell for the search term
        cells.forEach((cell, index) => {
            if (index === 0) return; // Skip SN column
            const input = cell.querySelector('input, select');
            const value = input ? input.value.toUpperCase() : cell.textContent.toUpperCase();
            if (value.includes(searchTerm)) {
                show = true;
            }
        });
        
        row.style.display = show ? '' : 'none';
    });
    
    updateAdmissionStats(); // Update stats
}

// ===== CLEAR SEARCH =====
function clearSearch() {
    document.getElementById('admission-search').value = '';
    searchTable(); // This will show all rows
}

// ===== SAVE/LOAD FUNCTIONS =====

function saveAdmissionData() {
    const rows = document.querySelectorAll('#admission-body tr');
    const data = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            name: cells[1].querySelector('input').value.toUpperCase(),
            sex: cells[2].querySelector('select').value,
            admissionNo: cells[3].querySelector('input').value.toUpperCase(),
            dob: cells[4].querySelector('.date-input').value,
            ghanaCard: cells[5].querySelector('input').value.toUpperCase(),
            guardianName: cells[6].querySelector('input').value.toUpperCase(),
            guardianSex: cells[7].querySelector('select').value,
            class: cells[8].querySelector('select').value,
            community: cells[9].querySelector('input').value.toUpperCase(),
            digitalAddress: cells[10].querySelector('input').value.toUpperCase(),
            phone: cells[11].querySelector('input').value.toUpperCase(),
            date: cells[12].querySelector('.date-input').value,
            classroom: cells[13].querySelector('select').value
        };
    });

    const key = `admissionData_${currentSchool?.schoolCode || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
    document.getElementById('admissionMessage').textContent = 'Admission data saved successfully!';
    document.getElementById('admissionMessage').style.color = '#27ae60';
    setTimeout(() => {
        document.getElementById('admissionMessage').textContent = '';
    }, 3000);
    
    updateAdmissionStats(); // Update stats after save
}

function loadAdmissionData() {
    const key = `admissionData_${currentSchool?.schoolCode || 'default'}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
        updateAdmissionStats(); // Update stats even if no data
        return;
    }

    try {
        const data = JSON.parse(raw);
        const tbody = document.getElementById('admission-body');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(student => {
            // Ensure all text data is converted to uppercase when loading
            const studentData = {
                name: student.name?.toUpperCase() || '',
                sex: student.sex || '',
                admissionNo: student.admissionNo?.toUpperCase() || '',
                dob: student.dob || '',
                ghanaCard: student.ghanaCard?.toUpperCase() || '',
                guardianName: student.guardianName?.toUpperCase() || '',
                guardianSex: student.guardianSex || '',
                class: student.class || '',
                community: student.community?.toUpperCase() || '',
                digitalAddress: student.digitalAddress?.toUpperCase() || '',
                phone: student.phone?.toUpperCase() || '',
                date: student.date || '',
                classroom: student.classroom || ''
            };
            addAdmissionRow(studentData);
        });
        
        updateAdmissionStats(); // Update stats after load
    } catch (e) {
        console.error('Error loading admission data:', e);
        updateAdmissionStats();
    }
}

// ===== ADD CSS FOR DATE DISPLAY =====
function addDateDisplayStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .date-container {
            display: flex;
            align-items: center;
            width: 100%;
            position: relative;
        }
        .date-container .date-input {
            width: 100%;
            padding: 2px;
            text-align: center;
            background-color: white;
        }
        .date-container .date-picker-icon {
            position: absolute;
            right: 2px;
            cursor: pointer;
            padding: 2px 4px;
            background: rgba(255,255,255,0.8);
            border-radius: 3px;
            font-size: 14px;
        }
        .date-container .date-picker-icon:hover {
            background: rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    addDateDisplayStyles();
    if (typeof currentSchool !== 'undefined') {
        createAdmissionTable();
    }
});