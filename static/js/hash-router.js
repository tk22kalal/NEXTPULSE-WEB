// Hash-based router for GitHub Pages
// This is an alternate router that uses hash-based routing (#/path) 
// instead of HTML5 pushState for better GitHub Pages compatibility

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hash router loaded');
    
    // Only enable hash router on GitHub Pages
    if (!window.location.hostname.includes('github.io')) {
        console.log('Not on GitHub Pages, hash router disabled');
        return;
    }
    
    console.log('Hash router enabled for GitHub Pages');
    
    // Setup hash router
    setupHashLinks();
    
    // Initial navigation
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
});

// Convert all links to use hash notation
function setupHashLinks() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip links that are already hash links, external, or don't exist
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//')) {
            return;
        }
        
        // For links that start with /, convert to hash format
        if (href.startsWith('/')) {
            // Remove leading slash and convert to hash format
            const hashPath = '#' + href;
            console.log(`Converting link: ${href} -> ${hashPath}`);
            
            link.setAttribute('href', hashPath);
            
            // Add click handler to prevent default navigation
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.hash = href;
            });
        }
        
        // For relative links (platform/subject/etc), also convert
        else if (href.includes('/') && !href.startsWith('./')) {
            const hashPath = '#/' + href;
            console.log(`Converting relative link: ${href} -> ${hashPath}`);
            
            link.setAttribute('href', hashPath);
            
            // Add click handler to prevent default navigation
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.hash = '/' + href;
            });
        }
    });
}

// Handle hash changes
function handleHashChange() {
    // Get the path from the hash (removing the #)
    let path = window.location.hash.slice(1);
    console.log('Hash changed to:', path);
    
    // If path is empty, use root path
    if (!path) {
        path = '/';
    }
    
    // Handle trailing slashes
    if (path !== '/' && !path.endsWith('/') && !path.includes('.')) {
        console.log('Adding trailing slash to path');
        window.location.hash = path + '/';
        return;
    }
    
    // Determine what page to load based on path
    loadPageContent(path);
}

// Load the appropriate content based on the path
function loadPageContent(path) {
    // Show loading spinner
    showSpinner();
    
    // GitHub Pages repository name
    const repoName = getRepositoryName();
    
    // Get file path based on route
    let filePath;
    
    if (path === '/') {
        // Root path - load index
        filePath = 'index.html';
    } else {
        // Remove leading slash
        const routePath = path.startsWith('/') ? path.slice(1) : path;
        
        // The content should be in a directory with an index.html file
        // If path ends with /, it's already pointing to the directory
        if (routePath.endsWith('/')) {
            filePath = routePath + 'index.html';
        } else {
            // Otherwise, add index.html
            filePath = routePath.includes('.html') ? routePath : routePath + '/index.html';
        }
    }
    
    console.log('Loading file:', filePath);
    
    // Fetch the content
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Extract content from the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Find the main content
            const content = tempDiv.querySelector('main') || tempDiv.querySelector('#content');
            
            if (content) {
                // Update the page content
                const mainContent = document.querySelector('main') || document.querySelector('#content');
                if (mainContent) {
                    mainContent.innerHTML = content.innerHTML;
                    
                    // Update page title if available
                    const title = tempDiv.querySelector('title');
                    if (title) {
                        document.title = title.textContent;
                    }
                    
                    // Re-setup hash links in the new content
                    setupHashLinks();
                    
                    // Remove spinner
                    removeSpinner();
                } else {
                    console.error('No main content element found on current page');
                    removeSpinner();
                }
            } else {
                console.error('No content found in loaded HTML');
                removeSpinner();
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
            removeSpinner();
            
            // Show error message on the page
            const mainContent = document.querySelector('main') || document.querySelector('#content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="container text-center py-5">
                        <h2>Page Not Found</h2>
                        <p>Sorry, we couldn't find the page you're looking for.</p>
                        <a href="#/" class="btn btn-primary">Go Home</a>
                    </div>
                `;
            }
        });
}

// Helper function to show loading spinner
function showSpinner() {
    // Remove any existing spinner first
    removeSpinner();
    
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

// Helper function to remove spinner
function removeSpinner() {
    const spinner = document.getElementById('page-loader');
    if (spinner) {
        spinner.remove();
    }
}

// Helper function to get repository name
function getRepositoryName() {
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1) {
            return pathParts[1];
        }
    }
    return '';
}