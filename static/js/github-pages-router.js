// GitHub Pages doesn't support server-side routing,
// so this script helps handle client-side routing for a static site

document.addEventListener('DOMContentLoaded', function() {
    // Fix base URL issues on GitHub Pages by checking if we're in a subdirectory
    const baseElement = document.createElement('base');
    let basePath = '';
    
    // If we're on GitHub Pages, the base path might be different
    if (window.location.hostname.includes('github.io')) {
        // Extract the repository name from the pathname
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1) {
            // For repo name, use the first part of the path if it exists
            if (pathParts[1]) {
                basePath = '/' + pathParts[1] + '/';
            }
        }
    }
    
    // Set the base URL for all relative links
    baseElement.href = basePath;
    document.head.appendChild(baseElement);
    console.log('Set base path to:', basePath);
    
    // Convert all navigation links to use the router
    document.querySelectorAll('a').forEach(function(link) {
        const href = link.getAttribute('href');
        
        // Skip links that don't exist or are external
        if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) {
            return;
        }
        
        // For links that start with /, handle them with our router
        if (href.startsWith('/')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo(href);
            });
        }
    });
    
    // Handle initial navigation and back/forward buttons
    window.addEventListener('popstate', handleLocation);
    handleLocation();
});

// Navigate to a new page
function navigateTo(url) {
    // Show loading spinner
    showSpinner();
    
    // For GitHub Pages, we need to adjust the URL to include the repository name
    let adjustedUrl = url;
    
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) {
            // If we're in a repository, prepend the repo name to the URL
            const repoName = pathParts[1];
            
            // Only add the repo name if the URL doesn't already start with it
            if (!url.startsWith('/' + repoName + '/')) {
                adjustedUrl = '/' + repoName + url;
            }
        }
    }
    
    console.log('Navigating to:', adjustedUrl);
    history.pushState(null, null, adjustedUrl);
    handleLocation();
}

// Handle the current location
function handleLocation() {
    const path = window.location.pathname;
    console.log('Handling location:', path);
    
    // For GitHub Pages, we need to handle the repo name in the URL
    let processedPath = path;
    
    if (window.location.hostname.includes('github.io')) {
        const pathParts = path.split('/');
        if (pathParts.length > 2) {
            // Remove the repository name from the path for processing
            const repoName = pathParts[1];
            processedPath = '/' + pathParts.slice(2).join('/');
            console.log('Processed path (removed repo):', processedPath);
        }
    }
    
    // If we're at a path with no trailing slash, add it
    // But skip if it's a file or the root path
    if (processedPath !== '/' && !processedPath.endsWith('/') && !processedPath.includes('.')) {
        let newPath = processedPath + '/';
        
        // For GitHub Pages, we need to add the repo name back in
        if (window.location.hostname.includes('github.io')) {
            const pathParts = path.split('/');
            if (pathParts.length > 1 && pathParts[1]) {
                newPath = '/' + pathParts[1] + newPath;
            }
        }
        
        console.log('Redirecting to add trailing slash:', newPath);
        window.location.pathname = newPath;
        return;
    }
    
    // Display the spinner for complex navigations
    showSpinner();
}

// Helper function to show loading spinner
function showSpinner() {
    // Remove any existing spinner first
    const existingSpinner = document.getElementById('page-loader');
    if (existingSpinner) {
        existingSpinner.remove();
    }
    
    // Create and add the spinner
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