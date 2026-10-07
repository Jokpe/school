// ===== REPORT CARDS =====

function getStudentPhotoPath(studentId) {
    // Path to student photos in Jokpe/stu folder
    return `Jokpe/stu/${studentId}.jpg`;
}

function getSchoolLogoPath() {
    // Path to school logo in Jokpe/log folder
    return `Jokpe/log/logo.jpg`;
}

function handleImageError(imgElement, type) {
    imgElement.style.display = 'none';
    
    if (type === 'student') {
        const container = imgElement.parentElement;
        if (container && container.classList.contains('student-photo-container')) {
            container.innerHTML = `
                <div style="width:100px;height:100px;border-radius:30px;
                           background:#f0f0f0;display:flex;
                           align-items:center;justify-content:center;
                           border:1px dashed #ccc; font-size:12px; text-align:center;">
                    No Photo
                </div>
            `;
        }
    } else if (type === 'logo') {
        const container = imgElement.parentElement;
        if (container) {
            const logoContainer = container.querySelector('.school-logo')?.parentElement || container;
            if (logoContainer) {
                logoContainer.innerHTML = `
                    <div style="width:100px;height:100px;border-radius:30px;
                               background:#2c3e50;display:flex;
                               align-items:center;justify-content:center;
                               color:white; font-size:14px; text-align:center;">
                                📚
                    </div>
                `;
            }
        }
    }
}

function showReportCards() {
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('settings-container').classList.add('hidden');
    document.getElementById('change-password-container').classList.add('hidden');
    
    document.getElementById('report-cards-container').classList.remove('hidden');
    
    generateReportCards();
}

function generateReportCards() {
    const container = document.getElementById('report-cards-list');
    container.innerHTML = '';
    
    const students = Array.from(document.querySelectorAll('#attendance-body tr')).map(row => {
        const sbaRow = document.querySelector(`#grid-body tr:nth-child(${row.cells[0].textContent})`);
        
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
                    position: sbaRow.querySelector(`input[data-subject="${subject}"].position`)?.value || '',
                    grade: sbaRow.querySelector(`input[data-subject="${subject}"].grade`)?.value || '',
                    remarks: sbaRow.querySelector(`input[data-subject="${subject}"].remarks`)?.value || ''
                };
            }
        });
        
        return {
            sn: row.cells[0].textContent,
            name: row.cells[1].querySelector('input').value,
            classLevel: document.getElementById('class-level').value,
            gender: row.cells[2].querySelector('select').value,
            attendance: Array.from(row.querySelectorAll('.attendance-checkbox')).filter(cb => cb.checked).length,
            totalAttendance: document.querySelectorAll('.attendance-checkbox').length,
            subjectScores: subjectScores
        };
    });
    
    students.forEach((student) => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        reportCard.innerHTML = createReportCardHTML(student);
        container.appendChild(reportCard);
    });
}

function createReportCardHTML(student) {
    let totalScore = 0;
    let subjectCount = 0;
    SUBJECTS.forEach(subject => {
        const score = parseFloat(student.subjectScores[subject]?.finalScore) || 0;
        if (score > 0) {
            totalScore += score;
            subjectCount++;
        }
    });
    const overallAverage = subjectCount > 0 ? (totalScore / subjectCount).toFixed(2) : 0;
    
    let overallGrade = '';
    if (overallAverage >= 80) overallGrade = 'A';
    else if (overallAverage >= 70) overallGrade = 'B';
    else if (overallAverage >= 60) overallGrade = 'C';
    else if (overallAverage >= 50) overallGrade = 'D';
    else overallGrade = 'F';
    
    let overallRemarks = '';
    switch(overallGrade) {
        case 'A': overallRemarks = 'Excellent'; break;
        case 'B': overallRemarks = 'Very Good'; break;
        case 'C': overallRemarks = 'Good'; break;
        case 'D': overallRemarks = 'Pass'; break;
        case 'F': overallRemarks = 'Fail'; break;
        default: overallRemarks = '';
    }
    
    const term = document.getElementById('term').value || '';
    const currentYear = new Date().getFullYear();
    
    return `
        <div class="school-header">
            <img class="school-logo" src="${getSchoolLogoPath()}" alt="School Logo" onerror="handleImageError(this, 'logo')">
            <div style="text-align: center;">
                <h1>${document.getElementById('school-name').value || 'SCHOOL NAME'}</h1>
                <h2>STUDENT REPORT CARD</h2>
                <h3>${term}  ${currentYear}</h3>
                <h4>${COURSE_SUBJECTS[currentCourse].name}</h4>
            </div>
            <img class="student-photo" src="${getStudentPhotoPath(student.sn)}" alt="Student Photo" onerror="handleImageError(this, 'student')">
        </div>
        
        <div class="student-info">
            <div class="student-photo-container">
                <img class="student-photo" src="${getStudentPhotoPath(student.sn)}" alt="Student Photo" onerror="handleImageError(this, 'student')">
            </div>
            <div class="student-details">
                <table>
                    <tr>
                        <th>NAME OF STUDENT:</th>
                        <td>${student.name}</td>
                        <th>ADMISSION NO.:</th>
                        <td>${student.sn}</td>
                    </tr>
                    <tr>
                        <th>CLASS:</th>
                        <td>${student.classLevel}</td>
                        <th>GENDER:</th>
                        <td>${student.gender === 'M' ? 'Male' : 'Female'}</td>
                    </tr>
                    <tr>
                        <th>TERM:</th>
                        <td>${term}</td>
                        <th>YEAR:</th>
                        <td>${currentYear}</td>
                    </tr>
                    <tr>
                        <th>COURSE:</th>
                        <td colspan="3">${COURSE_SUBJECTS[currentCourse].name}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <h3>ACADEMIC PERFORMANCE</h3>
        <table>
            <thead>
                <tr>
                    <th rowspan="2">SUBJECTS</th>
                    <th colspan="4">CONTINUOUS ASSESSMENT (50%)</th>
                    <th rowspan="2">EXAM (50%)</th>
                    <th rowspan="2">TOTAL (100%)</th>
                    <th rowspan="2">GRADE</th>
                    <th rowspan="2">REMARKS</th>
                </tr>
                <tr>
                    <th>Test 1</th>
                    <th>Test 2</th>
                    <th>Test 3</th>
                    <th>Test 4</th>
                </tr>
            </thead>
            <tbody>
                ${SUBJECTS.map(subject => {
                    const scores = student.subjectScores[subject] || {};
                    const displayName = SUBJECT_DISPLAY_NAMES[subject] || subject.toUpperCase();
                    return `
                        <tr>
                            <td class="subject-row">${displayName}</td>
                            <td>${scores.test1 || ' '}</td>
                            <td>${scores.test2 || ' '}</td>
                            <td>${scores.test3 || ' '}</td>
                            <td>${scores.test4 || ' '}</td>
                            <td>${scores.exam || ' '}</td>
                            <td>${scores.finalScore || ' '}</td>
                            <td>${scores.grade || ' '}</td>
                            <td>${scores.remarks || ' '}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div class="grading-scale">
            <h3>GRADING SCALE</h3>
            <table>
                <tr>
                    <th>GRADE</th>
                    <th>SCORE RANGE</th>
                    <th>REMARKS</th>
                </tr>
                <tr>
                    <td>A</td>
                    <td>80 - 100</td>
                    <td>Excellent</td>
                </tr>
                <tr>
                    <td>B</td>
                    <td>70 - 79</td>
                    <td>Very Good</td>
                </tr>
                <tr>
                    <td>C</td>
                    <td>60 - 69</td>
                    <td>Good</td>
                </tr>
                <tr>
                    <td>D</td>
                    <td>50 - 59</td>
                    <td>Pass</td>
                </tr>
                <tr>
                    <td>F</td>
                    <td>0 - 49</td>
                    <td>Fail</td>
                </tr>
            </table>
        </div>
        <div class="remarks-section">
            <h3>REMARKS</h3>
            <p><strong>OVERALL AVERAGE:</strong> ${overallAverage}</p>
            <p><strong>OVERALL GRADE:</strong> ${overallGrade}</p>
            <p><strong>OVERALL REMARKS:</strong> ${overallRemarks}</p>
            <p><strong>ATTENDANCE:</strong> ${student.attendance} out of ${student.totalAttendance} days (${Math.round((student.attendance / student.totalAttendance) * 100)}%)</p>
            <p><strong>CLASS TEACHER'S COMMENTS:</strong> ${getRandomComment(overallGrade)}</p>
            <p><strong>HEAD TEACHER'S COMMENTS:</strong> ${getHeadTeacherComment(overallGrade)}</p>
            
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <div class="signature-line">
                    <p>CLASS TEACHER'S SIGNATURE</p>
                </div>
                <div class="signature-line">
                    <p>HEAD TEACHER'S SIGNATURE</p>
                </div>
                <div class="signature-line">
                    <p>PARENT'S SIGNATURE</p>
                </div>
            </div>
            
            <p style="text-align: center; margin-top: 20px;">
                <strong>DATE ISSUED:</strong> ${new Date().toLocaleDateString()}
            </p>
        </div>
    `;
}

function getRandomComment(grade) {
    const comments = {
        'A': [
            "Excellent performance! Keep up the good work.",
            "Outstanding results across all subjects.",
            "Consistently demonstrates exceptional understanding."
        ],
        'B': [
            "Very good performance with room for improvement.",
            "Strong results, could aim for even higher marks.",
            "Performs well but can still improve in some areas."
        ],
        'C': [
            "Good performance overall, needs more consistency.",
            "Shows understanding but needs more practice.",
            "Average performance, could do better with more effort."
        ],
        'D': [
            "Passing performance but needs significant improvement.",
            "Barely meeting expectations, needs more focus.",
            "Should work harder to improve in all subjects."
        ],
        'F': [
            "Failing performance, requires immediate attention.",
            "Not meeting minimum standards, needs tutoring.",
            "Serious improvement needed in all areas."
        ]
    };
    
    const gradeComments = comments[grade] || ["Performance assessment not available."];
    return gradeComments[Math.floor(Math.random() * gradeComments.length)];
}

function getHeadTeacherComment(grade) {
    if (grade === 'A') return "An exemplary student who serves as a role model for others.";
    if (grade === 'B') return "A good student with potential for even greater achievement.";
    if (grade === 'C') return "Shows promise but needs to apply more consistent effort.";
    if (grade === 'D') return "Needs to take studies more seriously to improve results.";
    return "Requires immediate intervention to address academic challenges.";
}

function printReportCards() {
    window.print();
}

function exportReportCardsToPDF() {
    const doc = new jsPDF('p', 'pt', 'a4');
    const title = document.getElementById('school-name').value || 'School Report Cards';
    const reportCards = document.querySelectorAll('.report-card');
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    
    reportCards.forEach(card => {
        const cardClone = card.cloneNode(true);
        const noPrintElements = cardClone.querySelectorAll('.no-print');
        noPrintElements.forEach(el => el.remove());
        tempDiv.appendChild(cardClone);
    });
    
    document.body.appendChild(tempDiv);
    
    html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = doc.internal.pageSize.getWidth() - 20;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        let position = 10;
        
        for (let i = 0; i < reportCards.length; i++) {
            if (i > 0) {
                doc.addPage();
                position = 10;
            }
            
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        }
        
        document.body.removeChild(tempDiv);
        doc.save(`${title}_Report_Cards.pdf`);
    });
}

