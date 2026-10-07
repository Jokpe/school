// ===== REGISTER TABLE =====
function createRegisterTable() {
    createRegisterHeaders();
    createInitialRegisterRows();
    setupRegisterEventListeners();
    updateWeekDisplay();
    createSummaryRows();
    updateSavedFilesList();
    countGenders();
    updateSummaryTotals();
    
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
        loadSpecificData(saveName);
        
        const select = document.getElementById('saved-files');
        for (let i = 0; i < select.options.length; i+) {
            if (select.options[i].value === saveName) {
                select.selectedIndex = i;
                break;
            }
        }
    }
}

function createRegisterHeaders() {
    const weekHeaderRow = document.querySelector('#attendance-grid thead tr:first-child');
    const monthYearRow = document.getElementById('month-year-header');
    
    while (weekHeaderRow.children.length > 3) weekHeaderRow.removeChild(weekHeaderRow.lastChild);
    monthYearRow.innerHTML = '';
    
    for (let week = 1; week <= TOTAL_WEEKS; week+) {
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


function initializeDateSelects() {
    const dateSelects = document.querySelectorAll('.date-select');
    dateSelects.forEach(select => {
        select.innerHTML = '';
        for (let i = 1; i <= 31; i+) {
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
    
    for (let week = 1; week <= TOTAL_WEEKS; week+) {
        for (let day = 0; day <= DAYS_PER_WEEK; day+) {
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
    for (let i = 0; i < INITIAL_ROWS; i+) {
        addRegisterRow();
    }
}

function addRegisterRow() {
    const tbody = document.getElementById('attendance-body');
    const row = document.createElement('tr');
    const studentId = document.querySelectorAll('#attendance-body tr').length + 1;
    
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
    
    for (let week = 1; week <= TOTAL_WEEKS; week+) {
        for (let day = 1; day <= DAYS_PER_WEEK; day+) {
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
            sbaRow.cells[1].querySelector('input').value = name;
            sbaRow.cells[2].querySelector('input').value = genderDisplay;
        }
        
        const summaryRow = document.querySelector(`#summary-body tr:nth-child(${studentId})`);
        if (summaryRow) {
            summaryRow.cells[1].querySelector('input').value = name;
            summaryRow.cells[2].querySelector('input').value = genderDisplay;
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
    for (let week = 1; week <= TOTAL_WEEKS; week+) {
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

        for (let week = 1; week <= TOTAL_WEEKS; week+) {
            const weekCells = row.querySelectorAll(`.week${week}`);
            let daysPresent = 0;
            
            for (let day = 0; day < DAYS_PER_WEEK; day+) {
                const checkbox = weekCells[day]?.querySelector('input[type="checkbox"]');
                if (checkbox?.checked) {
                    if (gender === 'M') maleTotals[week-1][day]+;
                    if (gender === 'F') femaleTotals[week-1][day]+;
                    overallTotals[week-1][day]+;
                    daysPresent+;
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

    for (let week = 1; week <= TOTAL_WEEKS; week+) {
        const weekOffset = (week - 1) * (DAYS_PER_WEEK + 1);
        
        if (daysOpenRow?.cells[weekOffset + 3]?.querySelector('input')) {
            daysOpenRow.cells[weekOffset + 3].querySelector('input').value = daysOpenPerWeek[week-1];
        }
        
        if (daysOpenRow?.cells[weekOffset + 6]?.querySelector('input')) {
            daysOpenRow.cells[weekOffset + 6].querySelector('input').value = daysOpenPerWeek.slice(0, week).reduce((a, b) => a + b, 0);
        }
        
        for (let day = 0; day <= DAYS_PER_WEEK; day+) {
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
            currentWeek-;
            updateWeekDisplay();
            updateAllWeekColumnsVisibility();
        }
    });

    document.getElementById('next-weeks').addEventListener('click', () => {
        if (currentWeek < TOTAL_WEEKS) {
            currentWeek+;
            updateWeekDisplay();
            updateAllWeekColumnsVisibility();
        }
    });

    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('userDropdown');
        const userBadge = document.getElementById('userBadge');
        
        if (dropdown && userBadge && !userBadge.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
}