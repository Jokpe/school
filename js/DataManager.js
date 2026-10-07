// ===== DATA MANAGER =====
// Centralized data management to ensure consistency across all tables

const DataManager = {
    // Current state
    currentCourse: 'kg',
    currentSubjects: [],
    currentSubjectDisplayNames: {},
    studentCount: 0,
    
    // Track loaded data
    loadedData: null,
    isLoading: false,
    
    // Initialize
    init() {
        this.setCourse('kg');
    },
    
    // Set course and update all dependent data
    setCourse(courseKey) {
        if (!courseKey || !COURSE_SUBJECTS[courseKey]) {
            console.error('Invalid course:', courseKey);
            return false;
        }
        
        this.currentCourse = courseKey;
        const courseData = COURSE_SUBJECTS[courseKey];
        this.currentSubjects = [...courseData.subjects];
        this.currentSubjectDisplayNames = {...courseData.displayNames};
        
        // Update global variables
        SUBJECTS = this.currentSubjects;
        SUBJECT_DISPLAY_NAMES = this.currentSubjectDisplayNames;
        currentCourse = courseKey;
        
        return true;
    },
    
    // Get subject data for a specific student
    getStudentSubjectData(studentId, subject) {
        if (!this.loadedData) return null;
        
        const sbaData = this.loadedData.sba?.subjects?.[subject];
        if (sbaData && sbaData[studentId - 1]) {
            return sbaData[studentId - 1];
        }
        return null;
    },
    
    // Validate data consistency
    validateData(data) {
        if (!data) return false;
        
        // Check if subjects match
        const loadedSubjects = data.header?.subjects || [];
        const currentSubjects = this.currentSubjects;
        
        // If subjects don't match, attempt to map
        if (loadedSubjects.length !== currentSubjects.length) {
            console.warn('Subject mismatch during load');
            return this.mapSubjectData(data);
        }
        
        return data;
    },
    
    // Map subject data when courses differ
    mapSubjectData(data) {
        const loadedSubjects = data.header?.subjects || [];
        const currentSubjects = this.currentSubjects;
        
        // Create mapping for common subjects
        const subjectMap = {};
        loadedSubjects.forEach((subject, index) => {
            // Try to find matching subject in current subjects
            const matchIndex = currentSubjects.indexOf(subject);
            if (matchIndex !== -1) {
                subjectMap[index] = matchIndex;
            }
        });
        
        // Reorganize SBA data based on mapping
        if (data.sba?.subjects) {
            const newSbaData = {};
            currentSubjects.forEach(subject => {
                newSbaData[subject] = [];
            });
            
            // Transfer data where possible
            loadedSubjects.forEach((oldSubject, oldIndex) => {
                const newIndex = currentSubjects.indexOf(oldSubject);
                if (newIndex !== -1 && data.sba.subjects[oldSubject]) {
                    newSbaData[oldSubject] = data.sba.subjects[oldSubject];
                }
            });
            
            data.sba.subjects = newSbaData;
        }
        
        // Update header subjects
        data.header.subjects = currentSubjects;
        
        return data;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
});

