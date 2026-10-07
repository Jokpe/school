// ===== CONFIGURATION =====
const TOTAL_WEEKS = 20;
const DAYS_PER_WEEK = 5;
const INITIAL_ROWS = 5;
const MAX_TEST_SCORE = 25;
const MAX_EXAM_SCORE = 100;

// ===== CLASS TO COURSE MAPPING =====
const CLASS_COURSE_MAPPING = {
    'KG1': 'kg',
    'KG2': 'kg',
    'Basic1': 'lowerPrimary',
    'Basic2': 'lowerPrimary',
    'Basic3': 'lowerPrimary',
    'Basic4': 'upperPrimary',
    'Basic5': 'upperPrimary',
    'Basic6': 'upperPrimary',
    'JHS1': 'basic',
    'JHS2': 'basic',
    'JHS3': 'basic',
    'SHS1': 'allSHS',
    'SHS2': 'allSHS',
    'SHS3': 'allSHS'
};

// ===== ALL SHS COURSES =====
const SHS_COURSES = [
    'generalScience', 'science', 'agricultureScience', 
    'generalArt1', 'generalArt2', 'business', 'visualArt', 'stem'
];

// ===== COURSE SUBJECT DEFINITIONS =====
const COURSE_SUBJECTS = {
    kg: {
        name: 'Kindergarten',
        subjects: ['literacy', 'numeracy', 'creativeArt', 'ourWorldOurPeople'],
        displayNames: {
            'literacy': 'LITERACY (LANGUAGES)',
            'numeracy': 'NUMERACY (NUMBERS)',
            'creativeArt': 'CREATIVE ART',
            'ourWorldOurPeople': 'OUR-WORLD OUR-PEOPLE'
        }
    },
    lowerPrimary: {
        name: 'Lower Primary',
        subjects: ['mathematics', 'english', 'ghanaianLanguage', 'science', 'creativeArt', 'history', 'rme', 'physicalEducation'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'ghanaianLanguage': 'GHANAIAN LANGUAGE',
            'science': 'SCIENCE',
            'creativeArt': 'CREATIVE ART',
            'history': 'HISTORY',
            'rme': 'RELIGIOUS EDUCATION(RME)',
            'physicalEducation': 'PHYSICAL EDUCATION'
        }
    },
    upperPrimary: {
        name: 'Upper Primary',
        subjects: ['mathematics', 'english', 'science', 'creativeArt', 'ghanaianLanguage', 'history', 'rme', 'physicalEducation'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'creativeArt': 'CREATIVE ART',
            'ghanaianLanguage': 'GHANAIAN LANGUAGE',
            'history': 'HISTORY',
            'rme': 'RELIGIOUS EDUCATION(RME)',
            'physicalEducation': 'PHYSICAL EDUCATION'
        }
    },
    basic: {
        name: 'Basic Course (JHS)',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'computing', 'rme', 'french', 'ghanaianLanguage', 'bdt', 'creativeArts'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'computing': 'COMPUTING (ICT)',
            'rme': 'RELIGIOUS EDUCATION(RME)',
            'french': 'FRENCH LANGUAGE',
            'ghanaianLanguage': 'GHANAIAN LANGUAGE',
            'bdt': 'BASIC-DESIGN TECHNOLOGY',
            'creativeArts': 'CREATIVE ARTS'
        }
    },
    generalScience: {
        name: 'General Science',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'physics', 'chemistry', 'biology', 'electiveMathematics'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'physics': 'ELECTIVE PHYSICS',
            'chemistry': 'ELECTIVE CHEMISTRY',
            'biology': 'ELECTIVE BIOLOGY',
            'electiveMathematics': 'ELECTIVE MATHEMATICS'
        }
    },
    science: {
        name: 'Science',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'physics', 'chemistry', 'biology', 'electiveMathematics'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'physics': 'ELECTIVE PHYSICS',
            'chemistry': 'ELECTIVE CHEMISTRY',
            'biology': 'ELECTIVE BIOLOGY',
            'electiveMathematics': 'ELECTIVE MATHEMATICS'
        }
    },
    agricultureScience: {
        name: 'Agriculture Science',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'chemistry', 'animalHusbandry', 'horticulture', 'electiveMathematics'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'chemistry': 'ELECTIVE CHEMISTRY',
            'animalHusbandry': 'ANIMAL HUSBANDRY',
            'horticulture': 'HORTICULTURE',
            'electiveMathematics': 'ELECTIVE MATHEMATICS'
        }
    },
    generalArt1: {
        name: 'General Art 1',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'government', 'religiousStudies', 'englishLiterature', 'economics'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'government': 'GOVERNMENT',
            'religiousStudies': 'RELIGIOUS STUDIES',
            'englishLiterature': 'ENGLISH LITERATURE',
            'economics': 'ECONOMICS'
        }
    },
    generalArt2: {
        name: 'General Art 2',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'economics', 'government', 'geography', 'history'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'economics': 'ECONOMICS',
            'government': 'GOVERNMENT',
            'geography': 'GEOGRAPHY',
            'history': 'HISTORY'
        }
    },
    business: {
        name: 'Business',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'accounting', 'businessManagement', 'economics', 'businessMathematics'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'accounting': 'BUSINESS ACCOUNTING',
            'businessManagement': 'BUSINESS MANAGEMENT',
            'economics': 'ECONOMICS ',
            'businessMathematics': 'BUSINESS MATHEMATICS'
        }
    },
    visualArt: {
        name: 'Visual Art',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'graphicDesign', 'leatherWork', 'sculpture', 'generalKnowledgeInArt'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'graphicDesign': 'GRAPHIC DESIGN',
            'leatherWork': 'LEATHER WORK',
            'sculpture': 'SCULPTURE ',
            'generalKnowledgeInArt': 'GENERAL-KNOWLEDGE IN-ART'
        }
    },
    stem: {
        name: 'STEM',
        subjects: ['mathematics', 'english', 'science', 'socialStudies', 'engineeringScience', 'biomedicalScience', 'aviation', 'manufacturingEngineering'],
        displayNames: {
            'mathematics': 'CORE MATHEMATICS',
            'english': 'CORE ENGLISH',
            'science': 'CORE SCIENCE',
            'socialStudies': 'SOCIAL STUDIES',
            'engineeringScience': 'ENGINEERING SCIENCE',
            'biomedicalScience': 'BIOMEDICAL SCIENCE',
            'aviation': 'AVIATION AERONAUTICS',
            'manufacturingEngineering': 'MANUFACTURING ENGINEERING'
        }
    }
};

// ===== GLOBAL VARIABLES =====
let currentWeek = 1; // Changed from currentWeekPair
let currentSubjectIndex = 0;
let studentCount = 1;
let currentCourse = 'kg';
let SUBJECTS = COURSE_SUBJECTS.kg.subjects;
let SUBJECT_DISPLAY_NAMES = COURSE_SUBJECTS.kg.displayNames;

// ===== INITIALIZATION =====

function initTables() {
    // Initialize DataManager first
    DataManager.init();
    
    // Reset studentCount
    studentCount = 1;
    
    const classSelect = document.getElementById('class-level');
    if (classSelect) {
        classSelect.addEventListener('change', function() {
            const selectedClass = this.value;
            updateCourseOptions(selectedClass);
            const courseSelect = document.getElementById('course-select');
            if (courseSelect && courseSelect.options.length > 1) {
                courseSelect.value = courseSelect.options[1].value;
                changeCourse(courseSelect.value);
            }
        });
    }
    
    const courseSelect = document.getElementById('course-select');
    if (courseSelect) {
        courseSelect.addEventListener('change', function() {
            changeCourse(this.value);
        });
    }
    
    // Setup saved files dropdown
    const savedFilesSelect = document.getElementById('saved-files');
    if (savedFilesSelect) {
        savedFilesSelect.addEventListener('change', function() {
            autoLoadData();
        });
    }
    
    // Clear all tables first
    document.getElementById('attendance-body').innerHTML = '';
    document.getElementById('grid-body').innerHTML = '';
    document.getElementById('summary-body').innerHTML = '';
    
    // Create tables
    createRegisterTable();
    createSBATable();
    createSummaryTable();
    setupRegisterEventListeners();
    setupSBAEventListeners();
    updateWeekDisplay();
    updateSubjectDisplay();
    setupToggleInputs();
    updateSavedFilesList();
    countGenders();
    updateSummaryTotals();
    updateSummaryHeaders();
    updateSBASubjectDropdown();
    
    document.getElementById('class-level').value = 'KG1';
    updateCourseOptions('KG1');
    setTimeout(() => {
        if (document.getElementById('course-select').value) {
            changeCourse(document.getElementById('course-select').value);
        }
    }, 100);

    if (window.location.hash) {
        const saveName = window.location.hash.substring(1);
        document.getElementById('save-name').value = saveName;
        
        setTimeout(() => {
            loadSpecificData(saveName);
            
            const select = document.getElementById('saved-files');
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === saveName) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }, 500);
    }
    
    addSchoolNameHeader();
}

// ===== REGISTER FUNCTIONS =====
function createRegisterTable() {
    createRegisterHeaders();
    createInitialRegisterRows();
    createSummaryRows();
}

function createRegisterHeaders() {
    const weekHeaderRow = document.querySelector('#attendance-grid thead tr:first-child');
    const monthYearRow = document.getElementById('month-year-header');
    
    while (weekHeaderRow.children.length > 3) weekHeaderRow.removeChild(weekHeaderRow.lastChild);
    monthYearRow.innerHTML = '';
    
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
        const weekHeader = document.createElement('th');
        weekHeader.colSpan = DAYS_PER_WEEK + 1;
        weekHeader.textContent = `Week ${week}`;
        weekHeader.className = `week-header week${week}`;
        weekHeaderRow.appendChild(weekHeader);
        
        const monthYearCell = document.createElement('td');
        monthYearCell.colSpan = DAYS_PER_WEEK + 1;
        monthYearCell.className = `month-year-cell week${week}`;
        monthYearCell.innerHTML = `
            <select class="month-select">
                ${Array.from({length: 12}, (_, i) => `<option value="${i+1}" ${i+1 === new Date().getMonth()+1 ? 'selected' : ''}>${new Date(0, i).toLocaleString('default', {month: 'long'})}</option>`).join('')}
            </select>
            <input type="number" class="year-input" min="2000" max="2100" value="${new Date().getFullYear()}">
        `;
        monthYearRow.appendChild(monthYearCell);
    }
    
    updateDayHeadersVisibility();
    updateHeaderVisibility();
}

function updateDayHeadersVisibility() {
    const daysRow = document.getElementById('days-header');
    
    while (daysRow.children.length > 3) {
        daysRow.removeChild(daysRow.lastChild);
    }
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    days.forEach(day => {
        const dayHeader = document.createElement('th');
        dayHeader.innerHTML = `
            <div class="day-header">
                <div class="day-name">${day}</div>
                <div class="day-date"><select class="date-select"></select></div>
            </div>
        `;
        daysRow.appendChild(dayHeader);
    });
    
    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total';
    daysRow.appendChild(totalHeader);
    
    initializeDateSelects();
}

function initializeDateSelects() {
    const dateSelects = document.querySelectorAll('.date-select');
    dateSelects.forEach(select => {
        select.innerHTML = '';
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
        select.value = new Date().getDate();
    });
}

function updateHeaderVisibility() {
    // Hide all week headers first
    document.querySelectorAll('.week-header').forEach(header => {
        header.classList.remove('active');
    });
    document.querySelectorAll('.month-year-cell').forEach(cell => {
        cell.classList.remove('active');
    });
    
    // Show only the current week
    document.querySelectorAll(`.week-header.week${currentWeek}`).forEach(header => {
        header.classList.add('active');
    });
    document.querySelectorAll(`.month-year-cell.week${currentWeek}`).forEach(cell => {
        cell.classList.add('active');
    });
}

function createSummaryRows() {
    const tfoot = document.querySelector('#attendance-grid tfoot');
    tfoot.innerHTML = '';
    
    const maleRow = document.createElement('tr');
    maleRow.className = 'summary-row';
    maleRow.innerHTML = '<td colspan="3"><strong>Male Total</strong></td>';
    
    const femaleRow = document.createElement('tr');
    femaleRow.className = 'summary-row';
    femaleRow.innerHTML = '<td colspan="3"><strong>Female Total</strong></td>';
    
    const overallRow = document.createElement('tr');
    overallRow.className = 'summary-row';
    overallRow.innerHTML = '<td colspan="3"><strong>Overall Total</strong></td>';
    
    const daysOpenRow = document.createElement('tr');
    daysOpenRow.className = 'summary-row';
    daysOpenRow.innerHTML = '<td colspan="3"><strong>Days Open</strong></td>';
    
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
        for (let day = 0; day <= DAYS_PER_WEEK; day++) {
            maleRow.innerHTML += `<td class="week-column week${week}"><input class="cell-input total-cell" value="0" readonly></td>`;
            femaleRow.innerHTML += `<td class="week-column week${week}"><input class="cell-input total-cell" value="0" readonly></td>`;
            overallRow.innerHTML += `<td class="week-column week${week}"><input class="cell-input total-cell" value="0" readonly></td>`;
        }
        
        daysOpenRow.innerHTML += `
            <td class="week-column week${week}" colspan="2">
                <div>Days Open</div>
            </td>
            <td class="week-column week${week}">
                <input class="days-open-input" value="${DAYS_PER_WEEK}" readonly>
            </td>
            <td class="week-column week${week}" colspan="2">
                <div>Total Days Open</div>
            </td>
            <td class="week-column week${week}">
                <input class="days-open-input total-days-open" value="${week * DAYS_PER_WEEK}" readonly>
            </td>
        `;
    }
    
    tfoot.appendChild(maleRow);
    tfoot.appendChild(femaleRow);
    tfoot.appendChild(overallRow);
    tfoot.appendChild(daysOpenRow);
    
    updateAllWeekColumnsVisibility();
}

function createInitialRegisterRows() {
    // Clear existing rows first
    document.getElementById('attendance-body').innerHTML = '';
    document.getElementById('grid-body').innerHTML = '';
    document.getElementById('summary-body').innerHTML = '';
    
    // Reset studentCount
    studentCount = 1;
    
    for (let i = 0; i < INITIAL_ROWS; i++) {
        addRegisterRow();
    }
}

function addRegisterRow() {
    const tbody = document.getElementById('attendance-body');
    const row = document.createElement('tr');
    
    const currentRowCount = document.querySelectorAll('#attendance-body tr').length;
    const studentId = currentRowCount + 1;
    
    row.innerHTML = `
        <td>${studentId}</td>
        <td><input class="cell-input name-input" placeholder="Name"></td>
        <td>
            <select class="cell-input gender-select">
                <option value="">Sex ?</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </select>
        </td>
    `;
    
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
        for (let day = 1; day <= DAYS_PER_WEEK; day++) {
            row.innerHTML += `
                <td class="week-column week${week}">
                    <input type="checkbox" class="cell-input attendance-checkbox" data-week="${week}">
                </td>`;
        }
        row.innerHTML += `
            <td class="week-column week${week}">
                <input class="cell-input total-cell week-total" data-week="${week}" value="0" readonly>
            </td>`;
    }
    
    tbody.appendChild(row);
    updateWeekColumnsVisibility(row);
    
    addSBARow(studentId);
    addSummaryRow(studentId);
    
    const nameInput = row.querySelector('.name-input');
    const genderSelect = row.querySelector('.gender-select');
    
    const syncStudentData = () => {
        const name = nameInput.value;
        const gender = genderSelect.value;
        const genderDisplay = gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : '';
        
        const sbaRow = document.querySelector(`#grid-body tr:nth-child(${studentId})`);
        if (sbaRow) {
            const nameInputSba = sbaRow.cells[1].querySelector('input');
            if (nameInputSba) nameInputSba.value = name;
            
            const genderInputSba = sbaRow.cells[2].querySelector('input');
            if (genderInputSba) genderInputSba.value = genderDisplay;
        }
        
        const summaryRow = document.querySelector(`#summary-body tr:nth-child(${studentId})`);
        if (summaryRow) {
            const nameInputSummary = summaryRow.cells[1].querySelector('input');
            if (nameInputSummary) nameInputSummary.value = name;
            
            const genderInputSummary = summaryRow.cells[2].querySelector('input');
            if (genderInputSummary) genderInputSummary.value = genderDisplay;
        }
        
        countGenders();
        
        if (genderSelect.dataset.prevValue !== gender) {
            updateSummaryTotals();
            genderSelect.dataset.prevValue = gender;
        }
    };
    
    nameInput.addEventListener('input', syncStudentData);
    genderSelect.addEventListener('change', syncStudentData);
    genderSelect.addEventListener('change', updateSummaryTotals);
    
    row.querySelectorAll('.attendance-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const week = parseInt(this.dataset.week);
            calculateWeekTotal(row, week);
            updateSummaryTotals();
        });
    });
    
    studentCount = studentId + 1;
    countGenders();
    
    return row;
}

function addNewRow(tableType) {
    if (tableType === 'register') {
        const newRow = addRegisterRow();
        const newStudentId = document.querySelectorAll('#attendance-body tr').length;
        
        const currentSbaRows = document.querySelectorAll('#grid-body tr').length;
        if (newStudentId > currentSbaRows) {
            addSBARow(newStudentId);
        }
        
        const currentSummaryRows = document.querySelectorAll('#summary-body tr').length;
        if (newStudentId > currentSummaryRows) {
            addSummaryRow(newStudentId);
        }
        
        countGenders();
        updateSummaryTotals();
        SUBJECTS.forEach(subject => calculatePositions(subject));
        
        return newRow;
    }
}

function calculateWeekTotal(row, weekNumber) {
    const checkboxes = Array.from(row.querySelectorAll(`.attendance-checkbox[data-week="${weekNumber}"]`));
    const totalCell = row.querySelector(`.week-total[data-week="${weekNumber}"]`);
    
    if (!totalCell) return;
    
    const total = checkboxes.reduce((count, checkbox) => {
        return count + (checkbox.checked ? 1 : 0);
    }, 0);
    
    totalCell.value = total;
}

function updateWeekColumnsVisibility(row) {
    // First hide all week columns for this row
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
        row.querySelectorAll(`.week${week}`).forEach(col => {
            col.classList.remove('active');
        });
    }
    
    // Then show only the current week
    row.querySelectorAll(`.week${currentWeek}`).forEach(col => {
        col.classList.add('active');
    });
}

function updateAllWeekColumnsVisibility() {
    document.querySelectorAll('#attendance-body tr, tfoot tr').forEach(row => {
        updateWeekColumnsVisibility(row);
    });
    updateHeaderVisibility();
}

function updateWeekDisplay() {
    document.getElementById('week-range').textContent = `Week ${currentWeek}`;
}

function updateSummaryTotals() {
    const rows = document.querySelectorAll('#attendance-body tr');
    const summaryRows = document.querySelectorAll('tfoot .summary-row');
    
    if (summaryRows.length < 3) return;
    
    const maleRow = summaryRows[0];
    const femaleRow = summaryRows[1];
    const overallRow = summaryRows[2];
    const daysOpenRow = summaryRows[3];
    
    const maleTotals = Array(TOTAL_WEEKS).fill().map(() => Array(DAYS_PER_WEEK + 1).fill(0));
    const femaleTotals = Array(TOTAL_WEEKS).fill().map(() => Array(DAYS_PER_WEEK + 1).fill(0));
    const overallTotals = Array(TOTAL_WEEKS).fill().map(() => Array(DAYS_PER_WEEK + 1).fill(0));
    const daysOpenPerWeek = Array(TOTAL_WEEKS).fill(DAYS_PER_WEEK);

    rows.forEach(row => {
        const genderSelect = row.querySelector('.gender-select');
        const gender = genderSelect ? genderSelect.value : '';
        
        if (!gender) return;

        for (let week = 1; week <= TOTAL_WEEKS; week++) {
            const weekCells = row.querySelectorAll(`.week${week}`);
            let daysPresent = 0;
            
            for (let day = 0; day < DAYS_PER_WEEK; day++) {
                const checkbox = weekCells[day]?.querySelector('input[type="checkbox"]');
                if (checkbox?.checked) {
                    if (gender === 'M') maleTotals[week-1][day]++;
                    if (gender === 'F') femaleTotals[week-1][day]++;
                    overallTotals[week-1][day]++;
                    daysPresent++;
                }
            }
            
            maleTotals[week-1][DAYS_PER_WEEK] = maleTotals[week-1].slice(0, DAYS_PER_WEEK).reduce((a, b) => a + b, 0);
            femaleTotals[week-1][DAYS_PER_WEEK] = femaleTotals[week-1].slice(0, DAYS_PER_WEEK).reduce((a, b) => a + b, 0);
            overallTotals[week-1][DAYS_PER_WEEK] = overallTotals[week-1].slice(0, DAYS_PER_WEEK).reduce((a, b) => a + b, 0);
            
            if (daysPresent > 0 && daysPresent < daysOpenPerWeek[week-1]) {
                daysOpenPerWeek[week-1] = daysPresent;
            }
        }
    });

    for (let week = 1; week <= TOTAL_WEEKS; week++) {
        const weekOffset = (week - 1) * (DAYS_PER_WEEK + 1);
        
        if (daysOpenRow?.cells[weekOffset + 3]?.querySelector('input')) {
            daysOpenRow.cells[weekOffset + 3].querySelector('input').value = daysOpenPerWeek[week-1];
        }
        
        if (daysOpenRow?.cells[weekOffset + 6]?.querySelector('input')) {
            daysOpenRow.cells[weekOffset + 6].querySelector('input').value = daysOpenPerWeek.slice(0, week).reduce((a, b) => a + b, 0);
        }
        
        for (let day = 0; day <= DAYS_PER_WEEK; day++) {
            const cellIndex = weekOffset + day + 1;
            
            if (maleRow?.cells[cellIndex]?.querySelector('input')) {
                maleRow.cells[cellIndex].querySelector('input').value = maleTotals[week-1][day];
            }
            if (femaleRow?.cells[cellIndex]?.querySelector('input')) {
                femaleRow.cells[cellIndex].querySelector('input').value = femaleTotals[week-1][day];
            }
            if (overallRow?.cells[cellIndex]?.querySelector('input')) {
                overallRow.cells[cellIndex].querySelector('input').value = overallTotals[week-1][day];
            }
        }
    }
}

function setupRegisterEventListeners() {
    document.getElementById('prev-weeks').addEventListener('click', () => {
        if (currentWeek > 1) {
            currentWeek--;
            updateWeekDisplay();
            updateAllWeekColumnsVisibility();
        }
    });

    document.getElementById('next-weeks').addEventListener('click', () => {
        if (currentWeek < TOTAL_WEEKS) {
            currentWeek++;
            updateWeekDisplay();
            updateAllWeekColumnsVisibility();
        }
    });
}

// ===== SBA FUNCTIONS =====
function createSBATable() {
    console.log('Creating SBA table with subjects:', DataManager.currentSubjects);
    
    document.getElementById('grid-body').innerHTML = '';
    
    const registerRows = document.querySelectorAll('#attendance-body tr');
    console.log('Register rows count:', registerRows.length);
    
    registerRows.forEach((row, index) => {
        const studentId = index + 1;
        addSBARow(studentId);
    });
    
    updateSBASubjectDropdown();
    updateSubjectDisplay();
    updateAllSubjectColumnsVisibility();
    calculateAllSubjectPositions();
    
    console.log('SBA table created successfully');
}

function addSBARow(studentId) {
    const tbody = document.getElementById('grid-body');
    const row = document.createElement('tr');
    
    const registerRow = document.querySelector(`#attendance-body tr:nth-child(${studentId})`);
    let name = registerRow?.cells[1].querySelector('input').value || '';
    let gender = registerRow?.cells[2].querySelector('select').value || '';
    let genderDisplay = gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : '';
    
    let rowHTML = `
        <td>${studentId}</td>
        <td><input class="cell-input" placeholder="Name" value="${name}" readonly></td>
        <td><input class="cell-input gender-display" value="${genderDisplay}" readonly></td>
    `;
    
    const subjects = DataManager.currentSubjects || SUBJECTS;
    
    subjects.forEach((subject, index) => {
        rowHTML += `
            <td class="subject-column subject${index}"><input class="cell-input test-input" type="number" min="0" max="${MAX_TEST_SCORE}" data-subject="${subject}" data-test="1"></td>
            <td class="subject-column subject${index}"><input class="cell-input test-input" type="number" min="0" max="${MAX_TEST_SCORE}" data-subject="${subject}" data-test="2"></td>
            <td class="subject-column subject${index}"><input class="cell-input test-input" type="number" min="0" max="${MAX_TEST_SCORE}" data-subject="${subject}" data-test="3"></td>
            <td class="subject-column subject${index}"><input class="cell-input test-input" type="number" min="0" max="${MAX_TEST_SCORE}" data-subject="${subject}" data-test="4"></td>
            <td class="subject-column subject${index}"><input class="cell-input exam-input" type="number" min="0" max="${MAX_EXAM_SCORE}" data-subject="${subject}"></td>
            <td class="subject-column subject${index}"><input class="cell-input total-cell" readonly data-subject="${subject}" data-type="totalA"></td>
            <td class="subject-column subject${index}"><input class="cell-input total-cell" readonly data-subject="${subject}" data-type="totalB"></td>
            <td class="subject-column subject${index}"><input class="cell-input total-cell" readonly data-subject="${subject}" data-type="fiftyA"></td>
            <td class="subject-column subject${index}"><input class="cell-input total-cell" readonly data-subject="${subject}" data-type="fiftyB"></td>
            <td class="subject-column subject${index}"><input class="cell-input total-cell final-score" readonly data-subject="${subject}"></td>
            <td class="subject-column subject${index}"><input class="cell-input position" readonly data-subject="${subject}"></td>
            <td class="subject-column subject${index}"><input class="cell-input grade" readonly data-subject="${subject}"></td>
            <td class="subject-column subject${index}"><input class="cell-input remarks" readonly data-subject="${subject}"></td>
        `;
    });
    
    row.innerHTML = rowHTML;
    tbody.appendChild(row);
    
    row.querySelectorAll('.test-input').forEach(input => {
        input.addEventListener('input', function() {
            if (parseFloat(this.value) > MAX_TEST_SCORE) {
                this.value = MAX_TEST_SCORE;
                this.classList.add('error');
                setTimeout(() => this.classList.remove('error'), 1000);
            }
            const subject = this.dataset.subject;
            calculateSBAScores(row, subject);
            calculatePositions(subject);
        });
    });
    
    row.querySelectorAll('.exam-input').forEach(input => {
        input.addEventListener('input', function() {
            if (parseFloat(this.value) > MAX_EXAM_SCORE) {
                this.value = MAX_EXAM_SCORE;
                this.classList.add('error');
                setTimeout(() => this.classList.remove('error'), 1000);
            }
            const subject = this.dataset.subject;
            calculateSBAScores(row, subject);
            calculatePositions(subject);
        });
    });
    
    updateSubjectColumnsVisibility(row);
    
    const subjectsList = DataManager.currentSubjects || SUBJECTS;
    subjectsList.forEach(subject => {
        calculateSBAScores(row, subject);
    });
}

function calculateSBAScores(row, subject) {
    const test1 = parseFloat(row.querySelector(`input[data-subject="${subject}"][data-test="1"]`)?.value) || 0;
    const test2 = parseFloat(row.querySelector(`input[data-subject="${subject}"][data-test="2"]`)?.value) || 0;
    const test3 = parseFloat(row.querySelector(`input[data-subject="${subject}"][data-test="3"]`)?.value) || 0;
    const test4 = parseFloat(row.querySelector(`input[data-subject="${subject}"][data-test="4"]`)?.value) || 0;
    const exam = parseFloat(row.querySelector(`input[data-subject="${subject}"].exam-input`)?.value) || 0;
    
    const totalA = test1 + test2 + test3 + test4;
    const totalB = exam;
    const fiftyPercentA = totalA * 0.5;
    const fiftyPercentB = totalB * 0.5;
    const finalScore = fiftyPercentA + fiftyPercentB;
    
    row.querySelector(`input[data-subject="${subject}"][data-type="totalA"]`).value = totalA.toFixed(2);
    row.querySelector(`input[data-subject="${subject}"][data-type="totalB"]`).value = totalB.toFixed(2);
    row.querySelector(`input[data-subject="${subject}"][data-type="fiftyA"]`).value = fiftyPercentA.toFixed(2);
    row.querySelector(`input[data-subject="${subject}"][data-type="fiftyB"]`).value = fiftyPercentB.toFixed(2);
    row.querySelector(`input[data-subject="${subject}"].final-score`).value = finalScore.toFixed(2);
    
    let grade = '';
    if (finalScore >= 80) grade = 'A';
    else if (finalScore >= 70) grade = 'B';
    else if (finalScore >= 60) grade = 'C';
    else if (finalScore >= 50) grade = 'D';
    else grade = 'F';
    
    row.querySelector(`input[data-subject="${subject}"].grade`).value = grade;
    
    let remarks = '';
    switch(grade) {
        case 'A': remarks = 'Excellent'; break;
        case 'B': remarks = 'Very Good'; break;
        case 'C': remarks = 'Good'; break;
        case 'D': remarks = 'Pass'; break;
        case 'F': remarks = 'Fail'; break;
        default: remarks = '';
    }
    row.querySelector(`input[data-subject="${subject}"].remarks`).value = remarks;
    
    updateSummaryTable(row, subject);
}

function calculatePositions(subject) {
    const rows = Array.from(document.querySelectorAll('#grid-body tr'));
    const scores = rows.map(row => {
        const scoreInput = row.querySelector(`input[data-subject="${subject}"].final-score`);
        return {
            row: row,
            score: parseFloat(scoreInput?.value) || 0
        };
    });
    
    scores.sort((a, b) => b.score - a.score);
    
    let position = 1;
    for (let i = 0; i < scores.length; i++) {
        if (i > 0 && scores[i].score !== scores[i-1].score) {
            position = i + 1;
        }
        const positionCell = scores[i].row.querySelector(`input[data-subject="${subject}"].position`);
        if (positionCell) {
            positionCell.value = position;
        }
    }
}

function calculateAllSubjectPositions() {
    SUBJECTS.forEach(subject => calculatePositions(subject));
}

function updateSubjectColumnsVisibility(row) {
    row.querySelectorAll('.subject-column').forEach(col => {
        col.classList.remove('active');
    });
    
    const subjectColumns = Array.from(row.querySelectorAll('.subject-column'));
    const columnsPerSubject = 13;
    
    subjectColumns.forEach((col, index) => {
        const subjectIdx = Math.floor(index / columnsPerSubject);
        if (subjectIdx === currentSubjectIndex) {
            col.classList.add('active');
        }
    });
}

function updateAllSubjectColumnsVisibility() {
    document.querySelectorAll('#grid-body tr').forEach(row => {
        updateSubjectColumnsVisibility(row);
    });
}

function updateSubjectDisplay() {
    if (currentSubjectIndex < SUBJECTS.length) {
        const currentSubject = SUBJECTS[currentSubjectIndex];
        document.getElementById('current-subject').textContent = SUBJECT_DISPLAY_NAMES[currentSubject] || currentSubject.toUpperCase();
        document.getElementById('sba-subject').value = currentSubject;
    }
}

function updateSBASubjectDropdown() {
    const sbaSubjectSelect = document.getElementById('sba-subject');
    if (!sbaSubjectSelect) return;
    
    sbaSubjectSelect.innerHTML = '';
    
    if (SUBJECTS.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No subjects available';
        sbaSubjectSelect.appendChild(option);
        return;
    }
    
    SUBJECTS.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = SUBJECT_DISPLAY_NAMES[subject] || subject.toUpperCase();
        sbaSubjectSelect.appendChild(option);
    });
    
    if (SUBJECTS.length > 0) {
        sbaSubjectSelect.value = SUBJECTS[0];
        currentSubjectIndex = 0;
    }
}

function setupSBAEventListeners() {
    document.getElementById('prev-subject').addEventListener('click', () => {
        if (currentSubjectIndex > 0) {
            currentSubjectIndex--;
            updateSubjectDisplay();
            updateAllSubjectColumnsVisibility();
        }
    });

    document.getElementById('next-subject').addEventListener('click', () => {
        if (currentSubjectIndex < SUBJECTS.length - 1) {
            currentSubjectIndex++;
            updateSubjectDisplay();
            updateAllSubjectColumnsVisibility();
        }
    });

    document.getElementById('sba-subject').addEventListener('change', (e) => {
        const selectedSubject = e.target.value;
        if (selectedSubject) {
            currentSubjectIndex = SUBJECTS.indexOf(selectedSubject);
            updateSubjectDisplay();
            updateAllSubjectColumnsVisibility();
        }
    });
}

// ===== SUMMARY FUNCTIONS =====

function createSummaryTable() {
    updateSummaryHeaders();
    const registerRows = document.querySelectorAll('#attendance-body tr');
    registerRows.forEach((row, index) => {
        const studentId = index + 1;
        addSummaryRow(studentId);
    });
}

function addSummaryRow(studentId) {
    const tbody = document.getElementById('summary-body');
    const row = document.createElement('tr');
    
    const registerRow = document.querySelector(`#attendance-body tr:nth-child(${studentId})`);
    let name = registerRow?.cells[1].querySelector('input').value || '';
    let gender = registerRow?.cells[2].querySelector('select').value || '';
    let genderDisplay = gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : '';
    
    let rowHTML = `
        <td>${studentId}</td>
        <td><input class="cell-input" type="text" placeholder="Name" value="${name}" readonly></td>
        <td><input class="cell-input gender-display" value="${genderDisplay}" readonly></td>
    `;
    
    const subjects = DataManager.currentSubjects || SUBJECTS;
    subjects.forEach(subject => {
        rowHTML += `<td><input class="cell-input" type="number" min="0" max="100" readonly></td>`;
    });
    
    rowHTML += `
        <td><input class="cell-input total-cell" type="text" readonly></td>
        <td><input class="cell-input total-cell" type="text" readonly></td>
        <td><input class="cell-input total-cell" type="text" readonly></td>
    `;
    
    row.innerHTML = rowHTML;
    tbody.appendChild(row);
}

function updateSummaryHeaders() {
    const headerRow = document.getElementById('summary-header-row');
    if (!headerRow) return;
    
    while (headerRow.children.length > 3) {
        headerRow.removeChild(headerRow.lastChild);
    }
    
    SUBJECTS.forEach(subject => {
        const displayName = SUBJECT_DISPLAY_NAMES[subject] || subject.toUpperCase();
        const th = document.createElement('th');
        th.className = 'vertical-text';
        th.innerHTML = displayName.split(' ').join('<br>');
        headerRow.appendChild(th);
    });
    
    const avgTh = document.createElement('th');
    avgTh.className = 'summary-total';
    avgTh.innerHTML = 'Average<br>Overall<br>Total';
    headerRow.appendChild(avgTh);
    
    const posTh = document.createElement('th');
    posTh.className = 'summary-total';
    posTh.innerHTML = 'Overall<br>Position';
    headerRow.appendChild(posTh);
    
    const remTh = document.createElement('th');
    remTh.className = 'summary-total';
    remTh.innerHTML = 'Overall_Remarks';
    headerRow.appendChild(remTh);
}

function updateSummaryTable(row, subject) {
    const studentId = parseInt(row.cells[0].textContent);
    const summaryRow = document.querySelector(`#summary-body tr:nth-child(${studentId})`);
    if (!summaryRow) return;
    
    const finalScore = parseFloat(row.querySelector(`input[data-subject="${subject}"].final-score`).value) || 0;
    
    const subjectIndex = SUBJECTS.indexOf(subject);
    if (subjectIndex !== -1) {
        const columnIndex = subjectIndex + 3;
        if (summaryRow.cells[columnIndex]) {
            summaryRow.cells[columnIndex].querySelector('input').value = finalScore.toFixed(2);
        }
    }
    
    calculateSummaryRowTotals(summaryRow);
    calculateSummaryPositions();
}

function calculateSummaryRowTotals(row) {
    const cells = row.cells;
    let total = 0;
    let subjectCount = 0;
    
    for (let i = 3; i < cells.length - 3; i++) {
        const score = parseFloat(cells[i].querySelector('input').value) || 0;
        total += score;
        if (score > 0) subjectCount++;
    }
    
    const average = subjectCount > 0 ? total / subjectCount : 0;
    cells[cells.length - 3].querySelector('input').value = average.toFixed(2);
    
    let remarks = '';
    if (average >= 80) remarks = 'Excellent';
    else if (average >= 70) remarks = 'Very Good';
    else if (average >= 60) remarks = 'Good';
    else if (average >= 50) remarks = 'Pass';
    else if (average > 0) remarks = 'Fail';
    
    cells[cells.length - 1].querySelector('input').value = remarks;
}

function calculateSummaryPositions() {
    const rows = Array.from(document.querySelectorAll('#summary-body tr'));
    const scores = rows.map(row => {
        const scoreInput = row.cells[row.cells.length - 3].querySelector('input');
        return {
            row: row,
            score: parseFloat(scoreInput?.value) || 0
        };
    });
    
    scores.sort((a, b) => b.score - a.score);
    
    let position = 1;
    for (let i = 0; i < scores.length; i++) {
        if (i > 0 && scores[i].score !== scores[i-1].score) {
            position = i + 1;
        }
        scores[i].row.cells[row.cells.length - 2].querySelector('input').value = position;
    }
}

function updateAllSummaryColumns() {
    document.querySelectorAll('#summary-body tr').forEach(row => {
        updateSummaryColumnsVisibility(row);
    });
}

function updateSummaryColumnsVisibility(row) {
    row.querySelectorAll('.subject-column').forEach(col => {
        col.classList.remove('active');
    });
    
    const subjectColumns = Array.from(row.querySelectorAll('.subject-column'));
    const columnsPerSubject = 1;
    
    subjectColumns.forEach((col, index) => {
        const subjectIdx = Math.floor(index / columnsPerSubject);
        if (subjectIdx === currentSubjectIndex) {
            col.classList.add('active');
        }
    });
}

function updateDemographicTotals() {
    const maleCount = parseInt(document.getElementById('male-count').value) || 0;
    const femaleCount = parseInt(document.getElementById('female-count').value) || 0;
    const totalLearners = maleCount + femaleCount;
    
    document.getElementById('summary-male').value = maleCount;
    document.getElementById('summary-female').value = femaleCount;
    document.getElementById('summary-total').value = totalLearners;
    document.getElementById('total-learners').value = totalLearners;
}

// ===== COURSE MANAGEMENT =====

function updateCourseOptions(selectedClass) {
    const courseSelect = document.getElementById('course-select');
    const courseKey = CLASS_COURSE_MAPPING[selectedClass];
    
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    
    if (!courseKey) return;
    
    if (courseKey === 'allSHS') {
        SHS_COURSES.forEach(courseKey => {
            const courseData = COURSE_SUBJECTS[courseKey];
            if (courseData) {
                const option = document.createElement('option');
                option.value = courseKey;
                option.textContent = courseData.name;
                courseSelect.appendChild(option);
            }
        });
        if (SHS_COURSES.length > 0) {
            courseSelect.value = SHS_COURSES[0];
        }
    } else {
        const courseData = COURSE_SUBJECTS[courseKey];
        if (courseData) {
            const option = document.createElement('option');
            option.value = courseKey;
            option.textContent = courseData.name;
            courseSelect.appendChild(option);
            courseSelect.value = courseKey;
        }
    }
}

function changeCourse(course) {
    if (!course) return;
    
    console.log('Changing course to:', course);
    
    if (!DataManager.setCourse(course)) {
        console.error('Failed to set course:', course);
        return;
    }
    
    document.getElementById('grid-body').innerHTML = '';
    document.getElementById('summary-body').innerHTML = '';
    
    const registerRows = document.querySelectorAll('#attendance-body tr');
    studentCount = 1;
    
    registerRows.forEach((row, index) => {
        const studentId = index + 1;
        addSBARow(studentId);
        addSummaryRow(studentId);
    });
    
    updateSBASubjectDropdown();
    updateSubjectDisplay();
    updateAllSubjectColumnsVisibility();
    updateSummaryHeaders();
    calculateAllSubjectPositions();
    
    DataManager.loadedData = null;
    
    console.log('Course changed successfully. Subjects:', DataManager.currentSubjects);
}

// ===== SAVE/LOAD FUNCTIONS =====
function saveData() {
    const saveName = document.getElementById('save-name').value.trim();
    if (!saveName) {
        alert('Please enter a name for your save file');
        return;
    }

    console.log('===== SAVING DATA =====');
    
    const currentCourse = DataManager.currentCourse;
    const subjectsToSave = DataManager.currentSubjects;
    
    console.log('Saving with course:', currentCourse);
    console.log('Saving subjects:', subjectsToSave);

    const subjectData = {};
    const sbaRows = document.querySelectorAll('#grid-body tr');
    console.log('SBA rows count:', sbaRows.length);
    
    subjectsToSave.forEach(subject => {
        subjectData[subject] = Array.from(sbaRows).map(row => {
            const getValue = (selector) => {
                const el = row.querySelector(selector);
                return el ? el.value : '';
            };
            
            const test1 = parseFloat(getValue(`input[data-subject="${subject}"][data-test="1"]`)) || 0;
            const test2 = parseFloat(getValue(`input[data-subject="${subject}"][data-test="2"]`)) || 0;
            const test3 = parseFloat(getValue(`input[data-subject="${subject}"][data-test="3"]`)) || 0;
            const test4 = parseFloat(getValue(`input[data-subject="${subject}"][data-test="4"]`)) || 0;
            const exam = parseFloat(getValue(`input[data-subject="${subject}"].exam-input`)) || 0;
            const finalScore = parseFloat(getValue(`input[data-subject="${subject}"].final-score`)) || 0;
            
            return {
                test1: test1,
                test2: test2,
                test3: test3,
                test4: test4,
                exam: exam,
                finalScore: finalScore,
                position: getValue(`input[data-subject="${subject}"].position`),
                grade: getValue(`input[data-subject="${subject}"].grade`),
                remarks: getValue(`input[data-subject="${subject}"].remarks`)
            };
        });
    });

    const sbaStudents = Array.from(sbaRows).map(row => {
        const name = row.cells[1].querySelector('input')?.value || '';
        const genderDisplay = row.cells[2].querySelector('input')?.value || '';
        const gender = genderDisplay === 'Male' ? 'M' : genderDisplay === 'Female' ? 'F' : '';
        return {
            name: name,
            gender: gender
        };
    });

    const summaryRows = document.querySelectorAll('#summary-body tr');
    const summaryStudents = Array.from(summaryRows).map(row => {
        const subjectScores = {};
        subjectsToSave.forEach((subject, index) => {
            const colIndex = index + 3;
            const cell = row.cells[colIndex];
            subjectScores[subject] = cell?.querySelector('input')?.value || '';
        });
        
        const totalColIndex = 3 + subjectsToSave.length;
        const name = row.cells[1].querySelector('input')?.value || '';
        const genderDisplay = row.cells[2].querySelector('input')?.value || '';
        const gender = genderDisplay === 'Male' ? 'M' : genderDisplay === 'Female' ? 'F' : '';
        
        return {
            name: name,
            gender: gender,
            subjectScores: subjectScores,
            overallTotal: row.cells[totalColIndex]?.querySelector('input')?.value || '',
            overallPosition: row.cells[totalColIndex + 1]?.querySelector('input')?.value || '',
            overallRemarks: row.cells[totalColIndex + 2]?.querySelector('input')?.value || ''
        };
    });

    const registerStudents = Array.from(document.querySelectorAll('#attendance-body tr')).map(row => ({
        name: row.querySelector('.name-input')?.value || '',
        gender: row.querySelector('.gender-select')?.value || '',
        attendance: Array.from(row.querySelectorAll('.attendance-checkbox')).map(checkbox => checkbox.checked)
    }));

    const data = {
        version: '2.0',
        timestamp: Date.now(),
        header: {
            schoolName: document.getElementById('school-name').value || '',
            term: document.getElementById('term').value || '',
            classLevel: document.getElementById('class-level').value || '',
            course: currentCourse,
            subjects: subjectsToSave,
            maleCount: document.getElementById('male-count').value || '0',
            malePass: document.getElementById('male-pass').value || '0',
            femaleCount: document.getElementById('female-count').value || '0',
            femalePass: document.getElementById('female-pass').value || '0',
            totalLearners: document.getElementById('total-learners').value || '0',
            totalPass: document.getElementById('total-pass').value || '0',
            region: document.getElementById('region').value || '',
            community: document.getElementById('community').value || '',
            district: document.getElementById('district').value || '',
            schoolReg: document.getElementById('school-reg').value || '',
            circuit: document.getElementById('circuit').value || '',
            passMark: document.getElementById('pass-mark').value || ''
        },
        register: {
            monthYear: Array.from(document.querySelectorAll('#month-year-header td')).map(td => ({
                month: td.querySelector('.month-select')?.value || '1',
                year: td.querySelector('.year-input')?.value || '2025'
            })),
            dates: Array.from(document.querySelectorAll('.date-select')).map(select => select.value || '1'),
            students: registerStudents
        },
        sba: {
            students: sbaStudents,
            subjects: subjectData
        },
        summary: {
            male: document.getElementById('summary-male').value || '0',
            female: document.getElementById('summary-female').value || '0',
            total: document.getElementById('summary-total').value || '0',
            students: summaryStudents
        }
    };

    localStorage.setItem(`schoolData_${saveName}`, JSON.stringify(data));
    updateSavedFilesList();
    alert(`Data saved successfully as "${saveName}"`);
    window.location.hash = saveName;
    
    console.log('Data saved successfully');
    console.log('Saved SBA subjects:', Object.keys(data.sba.subjects));
    console.log('Saved SBA students:', data.sba.students.length);
}

function loadSpecificData(saveName) {
    if (DataManager.isLoading) {
        console.log('Already loading data...');
        return;
    }
    
    if (!saveName) {
        alert('Please select a file to load');
        return;
    }
    
    DataManager.isLoading = true;
    console.log('===== LOADING DATA FROM:', saveName, '=====');
    
    try {
        const rawData = localStorage.getItem(`schoolData_${saveName}`);
        if (!rawData) {
            alert(`No data found for "${saveName}"`);
            DataManager.isLoading = false;
            return;
        }
        
        const data = JSON.parse(rawData);
        console.log('Data loaded successfully');
        
        if (!data.header) {
            alert('Invalid data format');
            DataManager.isLoading = false;
            return;
        }
        
        DataManager.loadedData = data;
        
        document.getElementById('attendance-body').innerHTML = '';
        document.getElementById('grid-body').innerHTML = '';
        document.getElementById('summary-body').innerHTML = '';
        studentCount = 1;
        
        // Load header data
        const headerFields = {
            'school-name': data.header.schoolName || '',
            'term': data.header.term || 'Term 1',
            'class-level': data.header.classLevel || 'KG1',
            'male-pass': data.header.malePass || '0',
            'female-pass': data.header.femalePass || '0',
            'total-pass': data.header.totalPass || '0',
            'region': data.header.region || '',
            'community': data.header.community || '',
            'district': data.header.district || '',
            'school-reg': data.header.schoolReg || '',
            'circuit': data.header.circuit || '',
            'pass-mark': data.header.passMark || '',
            'male-count': data.header.maleCount || '0',
            'female-count': data.header.femaleCount || '0',
            'total-learners': data.header.totalLearners || '0'
        };
        
        Object.entries(headerFields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value || '';
        });
        
        // Set course and subjects
        const courseToLoad = data.header.course || 'basic';
        const courseSelect = document.getElementById('course-select');
        
        if (courseSelect) {
            if (COURSE_SUBJECTS[courseToLoad]) {
                courseSelect.value = courseToLoad;
                DataManager.setCourse(courseToLoad);
            } else {
                const firstCourse = Object.keys(COURSE_SUBJECTS)[0];
                courseSelect.value = firstCourse;
                DataManager.setCourse(firstCourse);
            }
        }
        
        // Load register data
        if (data.register && data.register.students) {
            if (data.register.monthYear) {
                const monthSelects = document.querySelectorAll('.month-select');
                const yearInputs = document.querySelectorAll('.year-input');
                
                data.register.monthYear.forEach((my, index) => {
                    if (index < monthSelects.length) {
                        monthSelects[index].value = my.month || '1';
                    }
                    if (index < yearInputs.length) {
                        yearInputs[index].value = my.year || '2025';
                    }
                });
            }
            
            if (data.register.dates) {
                const dateSelects = document.querySelectorAll('.date-select');
                data.register.dates.forEach((date, index) => {
                    if (index < dateSelects.length) {
                        dateSelects[index].value = date || '1';
                    }
                });
            }
            
            data.register.students.forEach((student, index) => {
                addRegisterRow();
                const row = document.querySelector(`#attendance-body tr:nth-child(${index + 1})`);
                
                if (row) {
                    const nameInput = row.querySelector('.name-input');
                    if (nameInput) nameInput.value = student.name || '';
                    
                    const genderSelect = row.querySelector('.gender-select');
                    if (genderSelect) {
                        genderSelect.value = student.gender || '';
                        const changeEvent = new Event('change');
                        genderSelect.dispatchEvent(changeEvent);
                    }
                    
                    if (student.attendance) {
                        const checkboxes = row.querySelectorAll('.attendance-checkbox');
                        student.attendance.forEach((checked, index) => {
                            if (index < checkboxes.length) {
                                checkboxes[index].checked = checked;
                            }
                        });
                        
                        for (let week = 1; week <= TOTAL_WEEKS; week++) {
                            calculateWeekTotal(row, week);
                        }
                    }
                }
            });
        }
        
        // Load SBA data
        setTimeout(() => {
            if (data.sba && data.sba.students && data.sba.subjects) {
                document.getElementById('grid-body').innerHTML = '';
                
                const registerRowCount = document.querySelectorAll('#attendance-body tr').length;
                
                for (let i = 1; i <= registerRowCount; i++) {
                    addSBARow(i);
                }
                
                updateSBASubjectDropdown();
                updateSubjectDisplay();
                updateAllSubjectColumnsVisibility();
                
                setTimeout(() => {
                    data.sba.students.forEach((student, index) => {
                        const sbaRow = document.querySelector(`#grid-body tr:nth-child(${index + 1})`);
                        if (sbaRow) {
                            const nameInput = sbaRow.cells[1].querySelector('input');
                            if (nameInput) nameInput.value = student.name || '';
                            
                            const genderInput = sbaRow.cells[2].querySelector('input');
                            if (genderInput) {
                                const genderDisplay = student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : '';
                                genderInput.value = genderDisplay;
                            }
                        }
                    });
                    
                    const currentSubjects = DataManager.currentSubjects;
                    currentSubjects.forEach(subject => {
                        const subjectData = data.sba.subjects[subject];
                        if (subjectData) {
                            subjectData.forEach((studentData, index) => {
                                const row = document.querySelector(`#grid-body tr:nth-child(${index + 1})`);
                                if (row) {
                                    ['1', '2', '3', '4'].forEach(testNum => {
                                        const input = row.querySelector(`input[data-subject="${subject}"][data-test="${testNum}"]`);
                                        if (input && studentData[`test${testNum}`] !== undefined) {
                                            input.value = studentData[`test${testNum}`];
                                        }
                                    });
                                    
                                    const examInput = row.querySelector(`input[data-subject="${subject}"].exam-input`);
                                    if (examInput && studentData.exam !== undefined) {
                                        examInput.value = studentData.exam;
                                    }
                                    
                                    const finalScoreInput = row.querySelector(`input[data-subject="${subject}"].final-score`);
                                    if (finalScoreInput && studentData.finalScore !== undefined) {
                                        finalScoreInput.value = studentData.finalScore;
                                    }
                                    
                                    const positionInput = row.querySelector(`input[data-subject="${subject}"].position`);
                                    if (positionInput && studentData.position !== undefined) {
                                        positionInput.value = studentData.position;
                                    }
                                    
                                    const gradeInput = row.querySelector(`input[data-subject="${subject}"].grade`);
                                    if (gradeInput && studentData.grade !== undefined) {
                                        gradeInput.value = studentData.grade;
                                    }
                                    
                                    const remarksInput = row.querySelector(`input[data-subject="${subject}"].remarks`);
                                    if (remarksInput && studentData.remarks !== undefined) {
                                        remarksInput.value = studentData.remarks;
                                    }
                                    
                                    calculateSBAScores(row, subject);
                                }
                            });
                            
                            calculatePositions(subject);
                        }
                    });
                    
                    updateSBASubjectDropdown();
                    updateSubjectDisplay();
                    updateAllSubjectColumnsVisibility();
                }, 200);
            }
        }, 300);
        
        // Load Summary data
        setTimeout(() => {
            if (data.summary && data.summary.students) {
                const registerRowCount = document.querySelectorAll('#attendance-body tr').length;
                
                document.getElementById('summary-body').innerHTML = '';
                
                for (let i = 1; i <= registerRowCount; i++) {
                    addSummaryRow(i);
                }
                
                updateSummaryHeaders();
                
                data.summary.students.forEach((student, index) => {
                    const summaryRow = document.querySelector(`#summary-body tr:nth-child(${index + 1})`);
                    if (summaryRow) {
                        summaryRow.cells[0].textContent = index + 1;
                        
                        const nameInput = summaryRow.cells[1].querySelector('input');
                        if (nameInput) nameInput.value = student.name || '';
                        
                        const genderInput = summaryRow.cells[2].querySelector('input');
                        if (genderInput) {
                            const genderDisplay = student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : '';
                            genderInput.value = genderDisplay;
                        }
                        
                        const currentSubjects = DataManager.currentSubjects;
                        currentSubjects.forEach((subject, subIndex) => {
                            const colIndex = subIndex + 3;
                            if (summaryRow.cells[colIndex]) {
                                const input = summaryRow.cells[colIndex].querySelector('input');
                                if (input) {
                                    const value = student.subjectScores && student.subjectScores[subject] !== undefined 
                                        ? student.subjectScores[subject] 
                                        : '';
                                    input.value = value;
                                }
                            }
                        });
                        
                        const totalColIndex = 3 + currentSubjects.length;
                        if (summaryRow.cells[totalColIndex]) {
                            const input = summaryRow.cells[totalColIndex].querySelector('input');
                            if (input) input.value = student.overallTotal || '';
                        }
                        if (summaryRow.cells[totalColIndex + 1]) {
                            const input = summaryRow.cells[totalColIndex + 1].querySelector('input');
                            if (input) input.value = student.overallPosition || '';
                        }
                        if (summaryRow.cells[totalColIndex + 2]) {
                            const input = summaryRow.cells[totalColIndex + 2].querySelector('input');
                            if (input) input.value = student.overallRemarks || '';
                        }
                    }
                });
                
                calculateSummaryPositions();
                
                if (data.summary.male) {
                    document.getElementById('summary-male').value = data.summary.male;
                }
                if (data.summary.female) {
                    document.getElementById('summary-female').value = data.summary.female;
                }
                if (data.summary.total) {
                    document.getElementById('summary-total').value = data.summary.total;
                }
            }
        }, 600);
        
        setTimeout(() => {
            countGenders();
            updateSummaryTotals();
            updateAllWeekColumnsVisibility();
            
            console.log('===== ALL DATA LOADED SUCCESSFULLY =====');
            
            window.location.hash = saveName;
            document.getElementById('save-name').value = saveName;
            
            const select = document.getElementById('saved-files');
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === saveName) {
                    select.selectedIndex = i;
                    break;
                }
            }
            
            DataManager.isLoading = false;
            showTable('register');
        }, 800);
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data: ' + error.message);
        DataManager.isLoading = false;
    }
}

function autoLoadData() {
    const saveName = document.getElementById('saved-files').value;
    if (!saveName) {
        return;
    }
    
    document.getElementById('save-name').value = saveName;
    loadSpecificData(saveName);
}

function deleteData() {
    const saveName = document.getElementById('saved-files').value;
    if (!saveName) {
        alert('Please select a file to delete');
        return;
    }

    if (confirm(`Are you sure you want to delete "${saveName}"? This cannot be undone.`)) {
        localStorage.removeItem(`schoolData_${saveName}`);
        updateSavedFilesList();
        alert(`"${saveName}" has been deleted successfully`);
        
        if (document.getElementById('save-name').value === saveName) {
            document.getElementById('save-name').value = '';
        }
    }
}

function updateSavedFilesList() {
    const select = document.getElementById('saved-files');
    select.innerHTML = '<option value="text">Class To Load</option>';
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('schoolData_')) {
            const saveName = key.replace('schoolData_', '');
            const option = document.createElement('option');
            option.value = saveName;
            option.textContent = saveName;
            select.appendChild(option);
        }
    }
}

function countGenders() {
    const genderSelects = document.querySelectorAll('.gender-select');
    let maleCount = 0;
    let femaleCount = 0;

    genderSelects.forEach(select => {
        if (select.value === 'M') maleCount++;
        if (select.value === 'F') femaleCount++;
    });

    document.getElementById('male-count').value = maleCount;
    document.getElementById('female-count').value = femaleCount;
    document.getElementById('total-learners').value = maleCount + femaleCount;
    
    document.getElementById('summary-male').value = maleCount;
    document.getElementById('summary-female').value = femaleCount;
    document.getElementById('summary-total').value = maleCount + femaleCount;
}

function deleteRow() {
    const rowNumberInput = document.getElementById('delete-row-number');
    const rowNumber = parseInt(rowNumberInput.value);
    
    if (isNaN(rowNumber) || rowNumber < 1) {
        alert('Please enter a valid row number (1 or higher)');
        return;
    }

    const registerRows = document.querySelectorAll('#attendance-body tr');
    const sbaRows = document.querySelectorAll('#grid-body tr');
    const summaryRows = document.querySelectorAll('#summary-body tr');
    
    if (rowNumber > registerRows.length) {
        alert(`Row ${rowNumber} doesn't exist`);
        return;
    }

    if (!confirm(`Delete student record #${rowNumber}? This cannot be undone.`)) {
        return;
    }

    if (registerRows[rowNumber-1]) registerRows[rowNumber-1].remove();
    if (sbaRows[rowNumber-1]) sbaRows[rowNumber-1].remove();
    if (summaryRows[rowNumber-1]) summaryRows[rowNumber-1].remove();

    renumberAllRows();
    
    countGenders();
    updateSummaryTotals();
    SUBJECTS.forEach(subject => calculatePositions(subject));
    
    rowNumberInput.value = '';
}

function renumberAllRows() {
    const registerRows = document.querySelectorAll('#attendance-body tr');
    registerRows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    
    const sbaRows = document.querySelectorAll('#grid-body tr');
    sbaRows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    
    const summaryRows = document.querySelectorAll('#summary-body tr');
    summaryRows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    
    studentCount = registerRows.length + 1;
}

function setupToggleInputs() {
    const toggleBtn = document.getElementById('toggle-inputs-btn');
    toggleBtn.classList.add('collapsed');
    toggleBtn.querySelector('span:first-child').textContent = 'View More';
    
    toggleBtn.addEventListener('click', function() {
        const inputGroups = document.querySelectorAll('.input-group');
        inputGroups.forEach(group => group.classList.toggle('visible'));
        
        if (this.classList.contains('collapsed')) {
            this.classList.remove('collapsed');
            this.classList.add('expanded');
            this.querySelector('span:first-child').textContent = 'View Less';
        } else {
            this.classList.remove('expanded');
            this.classList.add('collapsed');
            this.querySelector('span:first-child').textContent = 'View More';
        }
    });
}

function showTable(tableName) {
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('report-cards-container').classList.add('hidden');
    
    document.getElementById(`${tableName}-table`).classList.remove('hidden');
    
    if (tableName === 'register') {
        updateWeekDisplay();
        updateAllWeekColumnsVisibility();
    }
    
    if (tableName === 'sba') {
        updateSubjectDisplay();
        updateAllSubjectColumnsVisibility();
        calculatePositions(SUBJECTS[currentSubjectIndex]);
    }
    if (tableName === 'summary') updateDemographicTotals();
}

function addSchoolNameHeader() {
    const tables = ['attendance-grid', 'grid', 'summary-table'];
    
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const thead = table.querySelector('thead');
        if (!thead) return;
        
        const existingHeaders = thead.querySelectorAll('.school-name-header-row, .term-class-header-row, .course-header-row');
        existingHeaders.forEach(row => row.remove());
        
        const schoolName = document.getElementById('school-name').value || 'SCHOOL NAME';
        const term = document.getElementById('term').value || 'TERM';
        const classLevel = document.getElementById('class-level').value || 'CLASS';
        
        const courseSelect = document.getElementById('course-select');
        let courseName = '';
        if (courseSelect && courseSelect.value) {
            const selectedOption = courseSelect.options[courseSelect.selectedIndex];
            courseName = selectedOption ? selectedOption.textContent : '';
        }
        
        let colspan = 3;
        if (tableId === 'attendance-grid') {
            colspan = 3 + (DAYS_PER_WEEK + 1) * TOTAL_WEEKS;
        } else if (tableId === 'grid') {
            colspan = 3 + SUBJECTS.length * 13;
        } else if (tableId === 'summary-table') {
            colspan = 3 + SUBJECTS.length * 13;
        }
        
        const schoolNameRow = document.createElement('tr');
        schoolNameRow.className = 'school-name-header-row';
        schoolNameRow.innerHTML = `
            <th colspan="${colspan}" class="school-name-header">
              ${schoolName}
            </th>
        `;
        
        const courseRow = document.createElement('tr');
        courseRow.className = 'course-header-row';
        courseRow.innerHTML = `
            <th colspan="${colspan}" class="course-header">
          ✍️${courseName || 'Not Selected'}✍️
            </th>
        `;
        
        const termClassRow = document.createElement('tr');
        termClassRow.className = 'term-class-header-row';
        termClassRow.innerHTML = `
            <th colspan="${colspan}" class="term-class-header">
                <span style="margin-right:30px;">📅 ${term}</span>
                <span> ${classLevel}📚</span>
            </th>
        `;
        
        const firstRow = thead.querySelector('tr');
        if (firstRow) {
            thead.insertBefore(termClassRow, firstRow);
            thead.insertBefore(courseRow, termClassRow);
            thead.insertBefore(schoolNameRow, courseRow);
        } else {
            thead.appendChild(schoolNameRow);
            thead.appendChild(courseRow);
            thead.appendChild(termClassRow);
        }
    });
}

// ===== EXPORT FUNCTIONS =====
function printTable(tableType) {
    const originalDisplays = {};
    const weekHeaders = document.querySelectorAll('.week-header');
    
    if (tableType === 'register') {
        weekHeaders.forEach(week => {
            const weekNum = week.className.match(/week(\d+)/)[1];
            originalDisplays[weekNum] = week.style.display;
            
            if (parseInt(weekNum) !== currentWeek) {
                week.style.display = 'none';
                document.querySelectorAll(`.week${weekNum}`).forEach(col => {
                    col.style.display = 'none';
                });
            }
        });
    } else if (tableType === 'sba') {
        document.querySelectorAll('.subject-column').forEach(col => {
            col.classList.add('print-active');
        });
    } else {
        document.getElementById('register-table').style.display = 'none';
        document.getElementById('sba-table').style.display = 'none';
        document.getElementById('summary-table').style.display = 'none';
        document.getElementById(`${tableType}-table`).style.display = 'block';
    }

    setTimeout(() => {
        window.print();
        
        if (tableType === 'register') {
            weekHeaders.forEach(week => {
                const weekNum = week.className.match(/week(\d+)/)[1];
                week.style.display = originalDisplays[weekNum];
                document.querySelectorAll(`.week${weekNum}`).forEach(col => {
                    col.style.display = '';
                });
            });
        } else if (tableType === 'sba') {
            document.querySelectorAll('.subject-column').forEach(col => {
                col.classList.remove('print-active');
            });
            updateAllSubjectColumnsVisibility();
        } else {
            document.getElementById('register-table').style.display = '';
            document.getElementById('sba-table').style.display = '';
            document.getElementById('summary-table').style.display = '';
            showTable(tableType);
        }
    }, 500);
}

function exportToPDF(tableType) {
    const doc = new jsPDF({
        orientation: tableType === 'register' ? 'landscape' : 'portrait'
    });
    
    let tableToPrint;
    const originalDisplays = {};
    
    if (tableType === 'register') {
        tableToPrint = document.getElementById('attendance-grid').cloneNode(true);
        
        const weekHeaders = tableToPrint.querySelectorAll('.week-header');
        weekHeaders.forEach(week => {
            const weekNum = week.className.match(/week(\d+)/)[1];
            
            if (parseInt(weekNum) !== currentWeek) {
                week.style.display = 'none';
                tableToPrint.querySelectorAll(`.week${weekNum}`).forEach(col => {
                    col.style.display = 'none';
                });
            }
        });
    } else if (tableType === 'sba') {
        tableToPrint = document.getElementById('grid').cloneNode(true);
        tableToPrint.querySelectorAll('.subject-column').forEach(col => {
            col.style.display = 'table-cell';
        });
    } else {
        tableToPrint = document.getElementById('summary-table').cloneNode(true);
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.appendChild(tableToPrint);
    document.body.appendChild(tempDiv);
    
    doc.autoTable({
        html: tableToPrint,
        styles: { 
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
        },
        margin: { top: 20 }
    });
    
    document.body.removeChild(tempDiv);
    
    const title = document.getElementById('school-name').value || 'School Data';
    doc.save(`${title}_${tableType === 'register' ? 'Attendance' : tableType === 'sba' ? 'SBA' : 'Summary'}.pdf`);
}

// ===== UNIFIED DISPLAY CONTROLLER =====
function showContent(contentType) {
    console.log('Showing content:', contentType);
    
    // List of all content containers to hide
    const containers = [
        'register-table',
        'sba-table', 
        'summary-table',
        'report-cards-container',
        'analytics-container',
        'settings-container',
        'change-password-container',
        'admission-container',
        'staff-container',
        'admin-dashboard-container'
    ];
    
    // Hide all containers first
    containers.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
            console.log(`Hidden: ${id}`);
        }
    });
    
    // Show the requested content
    if (contentType === 'register') {
        document.getElementById('register-table').classList.remove('hidden');
        updateWeekDisplay();
        updateAllWeekColumnsVisibility();
    } else if (contentType === 'sba') {
        document.getElementById('sba-table').classList.remove('hidden');
        updateSubjectDisplay();
        updateAllSubjectColumnsVisibility();
        calculatePositions(SUBJECTS[currentSubjectIndex]);
    } else if (contentType === 'summary') {
        document.getElementById('summary-table').classList.remove('hidden');
        initSummaryTable();
    } else if (contentType === 'reportCards') {
        document.getElementById('report-cards-container').classList.remove('hidden');
        if (typeof generateReportCards === 'function') generateReportCards();
    } else if (contentType === 'analytics') {
        document.getElementById('analytics-container').classList.remove('hidden');
        if (typeof generateAnalytics === 'function') generateAnalytics();
    } else if (contentType === 'settings' || contentType === 'schoolInfo') {
        document.getElementById('settings-container').classList.remove('hidden');
        if (typeof loadSchoolSettingsToSettings === 'function') loadSchoolSettingsToSettings();
    } else if (contentType === 'changePassword') {
        document.getElementById('change-password-container').classList.remove('hidden');
    } else if (contentType === 'admission') {
        document.getElementById('admission-container').classList.remove('hidden');
        createAdmissionTable();
    } else if (contentType === 'staff' || contentType === 'addStaff' || contentType === 'staffList') {
        document.getElementById('staff-container').classList.remove('hidden');
        if (typeof createStaffTable === 'function') createStaffTable();
    } else if (contentType === 'adminDashboard') {
        document.getElementById('admin-dashboard-container').classList.remove('hidden');
        if (typeof showAdminDashboard === 'function') showAdminDashboard();
    } else {
        // Default to register if content type not recognized
        document.getElementById('register-table').classList.remove('hidden');
    }
    
    // Close sidebars
    SidebarController.closeAllSidebars();
}

// ===== SHOW TABLE FUNCTION =====
function showTable(tableName) {
    // Map table names to content types
    const mapping = {
        'register': 'register',
        'sba': 'sba',
        'summary': 'summary'
    };
    
    const contentType = mapping[tableName] || 'register';
    showContent(contentType);
}