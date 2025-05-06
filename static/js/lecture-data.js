// This script loads the lecture JSON data for static site usage
// It's used as a fallback when the Flask backend isn't available

document.addEventListener('DOMContentLoaded', async function() {
    // Only run this on static deployments
    if (typeof lecturesData !== 'undefined' || typeof window.Flask !== 'undefined') {
        return;
    }
    
    try {
        // Determine base path
        let basePath = '';
        if (window.location.hostname.includes('github.io')) {
            const pathParts = window.location.pathname.split('/');
            if (pathParts.length > 2) {
                basePath = '/' + pathParts[1];
            }
        }
        
        console.log('Loading data files from base path:', basePath);
        
        // Load each of the JSON data files with absolute paths
        const platformsResponse = await fetch(`${basePath}/data/platforms.json`);
        const subjectsResponse = await fetch(`${basePath}/data/subjects.json`);
        const lecturesResponse = await fetch(`${basePath}/data/lectures.json`);
        
        if (!platformsResponse.ok || !subjectsResponse.ok || !lecturesResponse.ok) {
            console.error('Error loading data files');
            return;
        }
        
        // Parse the JSON data
        window.platformsData = await platformsResponse.json();
        window.subjectsData = await subjectsResponse.json();
        window.lecturesData = await lecturesResponse.json();
        
        console.log('Data loaded successfully for static site');
        
        // Initialize data on the current page if needed
        initializePageData();
    } catch (error) {
        console.error('Error loading lecture data:', error);
    }
});

// Initialize data based on the current page
function initializePageData() {
    // This is a placeholder for any dynamic data initialization
    // needed on static pages
    
    // Example: Load watched status for lectures on the page
    document.querySelectorAll('[data-lecture-id]').forEach(element => {
        const lectureId = element.dataset.lectureId;
        const isWatched = localStorage.getItem(`video-watched-${lectureId}`) === 'true';
        
        if (isWatched) {
            const watchedBadge = element.querySelector('.watched-badge');
            if (watchedBadge) {
                watchedBadge.style.display = 'inline-block';
            }
        }
    });
}