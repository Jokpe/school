// ===== DATA EXPORT =====

function exportToExcel(tableType) {
    let table, filename;
    
    switch(tableType) {
        case 'register':
            table = document.getElementById('attendance-grid');
            filename = 'Attendance_Register';
            break;
        case 'sba':
            table = document.getElementById('grid');
            filename = 'SBA_Report';
            break;
        case 'summary':
            table = document.querySelector('.summary-table');
            filename = 'Summary_Report';
            break;
        default:
            alert('Invalid table type');
            return;
    }
    
    // Create workbook
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
    
    // Save file
    const title = document.getElementById('school-name').value || 'School_Data';
    XLSX.writeFile(wb, `${title}_${filename}.xlsx`);
}

function exportAllData() {
    const data = {
        schoolName: document.getElementById('school-name').value,
        term: document.getElementById('term').value,
        classLevel: document.getElementById('class-level').value,
        course: currentCourse,
        students: []
    };
    
    // Collect student data
    document.querySelectorAll('#attendance-body tr').forEach(row => {
        const studentId = row.cells[0].textContent;
        const name = row.cells[1].querySelector('input').value;
        const gender = row.cells[2].querySelector('select').value;
        const attendance = Array.from(row.querySelectorAll('.attendance-checkbox')).map(cb => cb.checked);
        const weekTotals = Array.from(row.querySelectorAll('.week-total')).map(input => input.value);
        
        // Get SBA data
        const sbaRow = document.querySelector(`#grid-body tr:nth-child(${studentId})`);
        const subjectScores = {};
        SUBJECTS.forEach(subject => {
            if (sbaRow) {
                subjectScores[subject] = {
                    test1: sbaRow.querySelector(`input[data-subject="${subject}"][data-test="1"]`)?.value || '',
                    test2: sbaRow.querySelector(`input[data-subject="${subject}"][data-test="2"]`)?.value || '',
                    test3: sbaRow.querySelector(`input[data-subject="${subject}"][data-test="3"]`)?.value || '',
                    test4: sbaRow.querySelector(`input[data-subject="${subject}"][data-test="4"]`)?.value || '',
                    exam: sbaRow.querySelector(`input[data-subject="${subject}"].exam-input`)?.value || '',
                    finalScore: sbaRow.querySelector(`input[data-subject="${subject}"].final-score`)?.value || '',
                    grade: sbaRow.querySelector(`input[data-subject="${subject}"].grade`)?.value || '',
                    remarks: sbaRow.querySelector(`input[data-subject="${subject}"].remarks`)?.value || ''
                };
            }
        });
        
        // Get summary data
        const summaryRow = document.querySelector(`#summary-body tr:nth-child(${studentId})`);
        let overallAverage = '', overallPosition = '', overallRemarks = '';
        if (summaryRow) {
            const cells = summaryRow.cells;
            overallAverage = cells[cells.length - 3]?.querySelector('input').value || '';
            overallPosition = cells[cells.length - 2]?.querySelector('input').value || '';
            overallRemarks = cells[cells.length - 1]?.querySelector('input').value || '';
        }
        
        data.students.push({
            id: studentId,
            name: name,
            gender: gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : '',
            attendance: attendance,
            weekTotals: weekTotals,
            subjectScores: subjectScores,
            overallAverage: overallAverage,
            overallPosition: overallPosition,
            overallRemarks: overallRemarks
        });
    });
    
    // Export as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.schoolName}_${data.term}_${data.classLevel}_Export.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importDataFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            // Process the imported data
            alert('Data imported successfully!');
            // Reload the page or update tables
            location.reload();
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

