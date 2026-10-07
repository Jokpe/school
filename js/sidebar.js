// ===== PULL-OUT SIDEBAR CONTROLLER =====
const SidebarController = {
    leftSidebar: null,
    rightSidebar: null,
    leftHandle: null,
    rightHandle: null,
    isDragging: false,
    dragStartX: 0,
    dragStartLeft: 0,
    dragStartRight: 0,
    sidebarWidth: 220,
    
    init() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.rightSidebar = document.getElementById('rightSidebar');
        
        // Set initial positions
        if (this.leftSidebar) {
            this.leftSidebar.style.left = '-' + this.sidebarWidth + 'px';
            this.leftSidebar.classList.remove('visible');
        }
        if (this.rightSidebar) {
            this.rightSidebar.style.right = '-' + this.sidebarWidth + 'px';
            this.rightSidebar.classList.remove('visible');
        }
        
        // Create pull handles
        this.createPullHandles();
        
        // Initialize dropdown toggles
        this.initDropdownToggles();
        
        // Close sidebars on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.scroll-sidebar') && 
                !e.target.closest('.sidebar-handle') &&
                !e.target.closest('.menu-icon')) {
                this.closeAllSidebars();
            }
        });
        
        // Toggle left sidebar on menu icon click
        const menuIcon = document.querySelector('.menu-icon');
        if (menuIcon) {
            menuIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLeftSidebar();
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                // On large screens, you might want different behavior
            }
        });
    },
    
    createPullHandles() {
        // Left handle
        this.leftHandle = document.createElement('div');
        this.leftHandle.className = 'sidebar-handle left-handle';
        this.leftHandle.innerHTML = `
            <div class="handle-bar"></div>
            <div class="handle-bar"></div>
            <div class="handle-bar"></div>
            <div class="handle-text"></div>
        `;
        this.leftHandle.title = 'Pull to open menu';
        document.body.appendChild(this.leftHandle);
        
        // Right handle
        this.rightHandle = document.createElement('div');
        this.rightHandle.className = 'sidebar-handle right-handle';
        this.rightHandle.innerHTML = `
            <div class="handle-bar"></div>
            <div class="handle-bar"></div>
            <div class="handle-bar"></div>
            <div class="handle-text"></div>
        `;
        this.rightHandle.title = 'Pull to open tools';
        document.body.appendChild(this.rightHandle);
        
        // Add drag events
        this.addDragEvents();
    },
    
    addDragEvents() {
        // Left handle drag
        this.leftHandle.addEventListener('mousedown', (e) => this.startDrag(e, 'left'));
        this.leftHandle.addEventListener('touchstart', (e) => this.startDrag(e, 'left'), {passive: false});
        
        // Right handle drag
        this.rightHandle.addEventListener('mousedown', (e) => this.startDrag(e, 'right'));
        this.rightHandle.addEventListener('touchstart', (e) => this.startDrag(e, 'right'), {passive: false});
        
        // Global mouse events
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Global touch events
        document.addEventListener('touchmove', (e) => this.onDrag(e), {passive: false});
        document.addEventListener('touchend', () => this.endDrag());
    },
    
    startDrag(e, side) {
        this.isDragging = true;
        const touch = e.touches ? e.touches[0] : e;
        this.dragStartX = touch.clientX;
        
        if (side === 'left') {
            const currentLeft = parseInt(this.leftSidebar.style.left) || -this.sidebarWidth;
            this.dragStartLeft = currentLeft;
        } else {
            const currentRight = parseInt(this.rightSidebar.style.right) || -this.sidebarWidth;
            this.dragStartRight = currentRight;
        }
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    },
    
    onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = touch.clientX - this.dragStartX;
        
        // Left sidebar drag
        if (this.leftSidebar) {
            const newLeft = this.dragStartLeft + deltaX;
            if (newLeft > -this.sidebarWidth && newLeft < 0) {
                this.leftSidebar.style.left = newLeft + 'px';
                this.leftSidebar.classList.toggle('visible', newLeft < -this.sidebarWidth/2);
            } else if (newLeft >= 0) {
                this.leftSidebar.style.left = '0px';
                this.leftSidebar.classList.add('visible');
            } else {
                this.leftSidebar.style.left = -this.sidebarWidth + 'px';
                this.leftSidebar.classList.remove('visible');
            }
        }
        
        // Right sidebar drag
        if (this.rightSidebar) {
            const newRight = this.dragStartRight - deltaX;
            if (newRight > -this.sidebarWidth && newRight < 0) {
                this.rightSidebar.style.right = newRight + 'px';
                this.rightSidebar.classList.toggle('visible', newRight < -this.sidebarWidth/2);
            } else if (newRight >= 0) {
                this.rightSidebar.style.right = '0px';
                this.rightSidebar.classList.add('visible');
            } else {
                this.rightSidebar.style.right = -this.sidebarWidth + 'px';
                this.rightSidebar.classList.remove('visible');
            }
        }
    },
    
    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        // Snap to proper position
        if (this.leftSidebar) {
            const currentLeft = parseInt(this.leftSidebar.style.left) || -this.sidebarWidth;
            if (currentLeft < -this.sidebarWidth/2) {
                this.leftSidebar.style.left = -this.sidebarWidth + 'px';
                this.leftSidebar.classList.remove('visible');
            } else {
                this.leftSidebar.style.left = '0px';
                this.leftSidebar.classList.add('visible');
            }
        }
        
        if (this.rightSidebar) {
            const currentRight = parseInt(this.rightSidebar.style.right) || -this.sidebarWidth;
            if (currentRight < -this.sidebarWidth/2) {
                this.rightSidebar.style.right = -this.sidebarWidth + 'px';
                this.rightSidebar.classList.remove('visible');
            } else {
                this.rightSidebar.style.right = '0px';
                this.rightSidebar.classList.add('visible');
            }
        }
    },
    
    toggleLeftSidebar() {
        if (!this.leftSidebar) return;
        const isVisible = this.leftSidebar.classList.contains('visible');
        if (isVisible) {
            this.leftSidebar.style.left = '-' + this.sidebarWidth + 'px';
            this.leftSidebar.classList.remove('visible');
        } else {
            this.leftSidebar.style.left = '0px';
            this.leftSidebar.classList.add('visible');
            // Close right sidebar if open
            if (this.rightSidebar && this.rightSidebar.classList.contains('visible')) {
                this.rightSidebar.style.right = '-' + this.sidebarWidth + 'px';
                this.rightSidebar.classList.remove('visible');
            }
        }
    },
    
    toggleRightSidebar() {
        if (!this.rightSidebar) return;
        const isVisible = this.rightSidebar.classList.contains('visible');
        if (isVisible) {
            this.rightSidebar.style.right = '-' + this.sidebarWidth + 'px';
            this.rightSidebar.classList.remove('visible');
        } else {
            this.rightSidebar.style.right = '0px';
            this.rightSidebar.classList.add('visible');
            // Close left sidebar if open
            if (this.leftSidebar && this.leftSidebar.classList.contains('visible')) {
                this.leftSidebar.style.left = '-' + this.sidebarWidth + 'px';
                this.leftSidebar.classList.remove('visible');
            }
        }
    },
    
    closeAllSidebars() {
        if (this.leftSidebar) {
            this.leftSidebar.style.left = '-' + this.sidebarWidth + 'px';
            this.leftSidebar.classList.remove('visible');
        }
        if (this.rightSidebar) {
            this.rightSidebar.style.right = '-' + this.sidebarWidth + 'px';
            this.rightSidebar.classList.remove('visible');
        }
    },
    
    hideLeftSidebar() {
        if (this.leftSidebar) {
            this.leftSidebar.style.left = '-' + this.sidebarWidth + 'px';
            this.leftSidebar.classList.remove('visible');
        }
    },
    
    hideRightSidebar() {
        if (this.rightSidebar) {
            this.rightSidebar.style.right = '-' + this.sidebarWidth + 'px';
            this.rightSidebar.classList.remove('visible');
        }
    },
    
    // ===== DROPDOWN TOGGLE FUNCTIONALITY =====
    initDropdownToggles() {
        document.querySelectorAll('.menu-header').forEach(menuHeader => {
            const menuLink = menuHeader.querySelector('.menu');
            const subMenu = menuHeader.querySelector('.sub-menu');
            const caret = menuHeader.querySelector('.caret');
            
            if (menuLink && subMenu) {
                menuLink.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Close all other sub-menus
                    document.querySelectorAll('.sub-menu').forEach(otherMenu => {
                        if (otherMenu !== subMenu) {
                            otherMenu.classList.remove('open');
                            const otherCaret = otherMenu.closest('.menu-header')?.querySelector('.caret');
                            if (otherCaret) otherCaret.classList.remove('rotate');
                        }
                    });
                    
                    // Toggle this sub-menu
                    subMenu.classList.toggle('open');
                    if (caret) caret.classList.toggle('rotate');
                });
            }
        });
        
        // Close all sub-menus when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.menu-header')) {
                document.querySelectorAll('.sub-menu').forEach(menu => {
                    menu.classList.remove('open');
                });
                document.querySelectorAll('.caret').forEach(c => {
                    c.classList.remove('rotate');
                });
            }
        });
    }
};

// ===== CONTENT DISPLAY FUNCTIONS =====
function showContent(contentType) {
    // Hide all tables and containers
    document.getElementById('register-table').classList.add('hidden');
    document.getElementById('sba-table').classList.add('hidden');
    document.getElementById('summary-table').classList.add('hidden');
    document.getElementById('report-cards-container').classList.add('hidden');
    document.getElementById('analytics-container').classList.add('hidden');
    document.getElementById('settings-container').classList.add('hidden');
    document.getElementById('change-password-container').classList.add('hidden');
    document.getElementById('admission-container').classList.add('hidden');
    
    // Show content based on type
    switch(contentType) {
        case 'register':
            document.getElementById('register-table').classList.remove('hidden');
            break;
        case 'sba':
            document.getElementById('sba-table').classList.remove('hidden');
            break;
        case 'summary':
            document.getElementById('summary-table').classList.remove('hidden');
            break;
        case 'reportCards':
            document.getElementById('report-cards-container').classList.remove('hidden');
            if (typeof generateReportCards === 'function') generateReportCards();
            break;
        case 'analytics':
            document.getElementById('analytics-container').classList.remove('hidden');
            if (typeof generateAnalytics === 'function') generateAnalytics();
            break;
        case 'settings':
        case 'schoolInfo':
            document.getElementById('settings-container').classList.remove('hidden');
            if (typeof loadSchoolSettingsToSettings === 'function') loadSchoolSettingsToSettings();
            break;
        case 'changePassword':
            document.getElementById('change-password-container').classList.remove('hidden');
            break;
        case 'backup':
            alert('Backup/Restore feature coming soon!');
            break;
        case 'admission':
            document.getElementById('admission-container').classList.remove('hidden');
            if (typeof createAdmissionTable === 'function') createAdmissionTable();
            break;
        case 'studentList':
            alert('Student List feature coming soon!');
            break;
        case 'promotion':
            alert('Promotion feature coming soon!');
            break;
// In sidebar.js, update the showContent function:
case 'addStaff':
    document.getElementById('staff-container').classList.remove('hidden');
    if (typeof initStaffTable === 'function') initStaffTable();
    break;
case 'staffList':
    document.getElementById('staff-container').classList.remove('hidden');
    if (typeof initStaffTable === 'function') initStaffTable();
    break;
        case 'staffReports':
            alert('Staff Reports feature coming soon!');
            break;
        default:
            document.getElementById('register-table').classList.remove('hidden');
    }
    
    // Close sidebars after selection
    SidebarController.closeAllSidebars();
}

// Initialize sidebar controller
document.addEventListener('DOMContentLoaded', function() {
    SidebarController.init();
});