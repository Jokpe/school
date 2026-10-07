// ===== SUMMARY TABLE =====
function createSummaryTable() {
    updateSummaryHeaders();
    const registerRows = document.querySelectorAll('#attendance-body tr');
    registerRows.forEach((row, index) => {
        const studentId = index + 1;
        addSummaryRow(studentId);
    });
    
    updateAllSummaryColumns();
    calculateAllSubjectPositions();
    
    // Add term and class to header
    addSchoolNameHeader();
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
    
    SUBJECTS.forEach(subject => {
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

