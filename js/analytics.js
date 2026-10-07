// ===== ANALYTICS & VISUALIZATION =====

// Chart instances
let performanceChart = null;
let subjectChart = null;
let attendanceChart = null;

function showAnalytics() {
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('report-cards-container').classList.add('hidden');
    document.getElementById('settings-container').classList.add('hidden');
    document.getElementById('change-password-container').classList.add('hidden');
    
    document.getElementById('analytics-container').classList.remove('hidden');
    
    generateAnalytics();
}

function generateAnalytics() {
    // Get data from tables
    const students = Array.from(document.querySelectorAll('#attendance-body tr')).map(row => {
        const sbaRow = document.querySelector(`#grid-body tr:nth-child(${row.cells[0].textContent})`);
        const subjectScores = {};
        SUBJECTS.forEach(subject => {
            if (sbaRow) {
                const score = parseFloat(sbaRow.querySelector(`input[data-subject="${subject}"].final-score`)?.value) || 0;
                subjectScores[subject] = score;
            }
        });
        return {
            name: row.cells[1].querySelector('input').value || 'Student',
            gender: row.cells[2].querySelector('select').value || '',
            scores: subjectScores
        };
    });
    
    // Calculate class averages
    const classAverages = {};
    SUBJECTS.forEach(subject => {
        const scores = students.map(s => s.scores[subject] || 0).filter(s => s > 0);
        if (scores.length > 0) {
            classAverages[subject] = scores.reduce((a, b) => a + b, 0) / scores.length;
        } else {
            classAverages[subject] = 0;
        }
    });
    
    // Generate performance charts
    generatePerformanceChart(students, classAverages);
    generateSubjectChart(classAverages);
    generateAttendanceChart();
}

function generatePerformanceChart(students, classAverages) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Destroy existing chart
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    const labels = students.map(s => s.name);
    const data = students.map(s => {
        const scores = Object.values(s.scores).filter(v => v > 0);
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    });
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Overall Average',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Student Performance Overview'
                }
            }
        }
    });
}

function generateSubjectChart(classAverages) {
    const ctx = document.getElementById('subjectChart').getContext('2d');
    
    // Destroy existing chart
    if (subjectChart) {
        subjectChart.destroy();
    }
    
    const labels = SUBJECTS.map(s => SUBJECT_DISPLAY_NAMES[s] || s);
    const data = SUBJECTS.map(s => classAverages[s] || 0);
    
    subjectChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Class Average Performance',
                data: data,
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(46, 204, 113, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Subject Performance Overview'
                }
            }
        }
    });
}

function generateAttendanceChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Destroy existing chart
    if (attendanceChart) {
        attendanceChart.destroy();
    }
    
    // Calculate attendance by gender
    let malePresent = 0, maleTotal = 0, femalePresent = 0, femaleTotal = 0;
    
    document.querySelectorAll('#attendance-body tr').forEach(row => {
        const gender = row.querySelector('.gender-select')?.value || '';
        const checkboxes = row.querySelectorAll('.attendance-checkbox');
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (gender === 'M') {
            malePresent += checked;
            maleTotal += checkboxes.length;
        } else if (gender === 'F') {
            femalePresent += checked;
            femaleTotal += checkboxes.length;
        }
    });
    
    attendanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Male Present', 'Female Present'],
            datasets: [{
                data: [malePresent, femalePresent],
                backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(231, 76, 60, 0.7)'],
                borderColor: ['rgba(52, 152, 219, 1)', 'rgba(231, 76, 60, 1)'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Attendance Overview (${malePresent + femalePresent} total)`
                }
            }
        }
    });
}

