// GitHub Pages doesn't support server-side routing,
// so this script helps handle client-side routing for a static site

document.addEventListener('DOMContentLoaded', function() {
    // Convert all navigation links to use the router
    document.querySelectorAll('a[href^="/"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip external links
            if (href.startsWith('http') || href.startsWith('//')) {
                return;
            }
            
            e.preventDefault();
            navigateTo(href);
        });
    });
    
    // Handle initial navigation and back/forward buttons
    window.addEventListener('popstate', handleLocation);
    handleLocation();
});

// Navigate to a new page
function navigateTo(url) {
    history.pushState(null, null, url);
    handleLocation();
}

// Handle the current location
function handleLocation() {
    const path = window.location.pathname;
    
    // For GitHub Pages, we use the directory structure approach
    // Each page is in its own directory with an index.html file
    
    // If we're at a path with no trailing slash, add it
    if (path !== '/' && !path.endsWith('/') && !path.includes('.')) {
        window.location.pathname = path + '/';
        return;
    }
    
    // Display the spinner if needed for complex navigations
    // This is removed when the new page loads
    
    const spinner = document.createElement('div');
    spinner.id = 'page-loader';
    spinner.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" 
             style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999;">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(spinner);
}