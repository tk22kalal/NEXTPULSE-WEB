// Common JavaScript for all pages

document.addEventListener('DOMContentLoaded', function() {
    // Enable all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Enable all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Add active class to current navigation item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Handle search functionality if search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchValue = this.value.toLowerCase();
            
            // Determine what to search based on current page
            let items;
            if (document.querySelector('.subject-list')) {
                items = document.querySelectorAll('.subject-card');
            } else if (document.querySelector('.lecture-list')) {
                items = document.querySelectorAll('.lecture-item');
            }
            
            if (items) {
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchValue)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    // Save platform selection to localStorage
    const platformCards = document.querySelectorAll('.platform-card');
    if (platformCards.length > 0) {
        platformCards.forEach(card => {
            card.addEventListener('click', function() {
                const platformId = this.dataset.platform;
                localStorage.setItem('selectedPlatform', platformId);
            });
        });
    }

    // Retrieve and display last selected platform if available
    const platformBadge = document.getElementById('platformBadge');
    if (platformBadge) {
        const selectedPlatform = localStorage.getItem('selectedPlatform');
        if (selectedPlatform) {
            platformBadge.textContent = selectedPlatform.toUpperCase();
            platformBadge.style.display = 'inline-block';
        }
    }
});

// Theme toggle function
function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Apply saved theme preference on page load
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
    }
})();
