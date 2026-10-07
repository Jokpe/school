// ===== SBA TABLE =====
function createSBATable() {
    const registerRows = document.querySelectorAll('#attendance-body tr');
    registerRows.forEach((row, index) => {
        const studentId = index + 1;
        addSBARow(studentId);
    });
    
    updateSBASubjectDropdown();
    updateSubjectDisplay();
    updateAllSubjectColumnsVisibility();
    calculateAllSubjectPositions();
    
    // Add term and class to header
    addSchoolNameHeader();
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
    
    SUBJECTS.forEach((subject, index) => {
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
