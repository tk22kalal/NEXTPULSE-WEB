// Debug script for GitHub Pages deployment
// This script helps diagnose and fix issues specific to GitHub Pages

document.addEventListener('DOMContentLoaded', function() {
    // Only run this on GitHub Pages
    if (!window.location.hostname.includes('github.io')) {
        return;
    }
    
    console.log('GitHub Pages Debug Script Loaded');
    
    // Log key information about the environment
    console.log('Current URL:', window.location.href);
    console.log('Hostname:', window.location.hostname);
    console.log('Pathname:', window.location.pathname);
    
    // Determine repository name from URL
    const repoName = getRepositoryName();
    console.log('Repository name:', repoName);
    
    // Fix links on the page
    fixLinks(repoName);
    
    // Add debug panel if query parameter is present
    if (window.location.search.includes('debug=true')) {
        addDebugPanel();
    }
});

// Extracts repository name from GitHub Pages URL
function getRepositoryName() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
        return pathParts[1];
    }
    return '';
}

// Fix links that might be broken on GitHub Pages
function fixLinks(repoName) {
    if (!repoName) return;
    
    // Fix data file links
    window.fixedRepoPath = '/' + repoName;
    
    console.log('Fixing links for repo path:', window.fixedRepoPath);
    
    // Update navigation links
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) {
            return;
        }
        
        // Fix absolute paths to be relative to the repository
        if (href.startsWith('/') && !href.startsWith('/' + repoName + '/')) {
            const newHref = '/' + repoName + href;
            console.log(`Fixing link: ${href} -> ${newHref}`);
            link.setAttribute('href', newHref);
        }
    });
}

// Add a debug panel to the page
function addDebugPanel() {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '0';
    panel.style.right = '0';
    panel.style.background = 'rgba(0,0,0,0.8)';
    panel.style.color = 'white';
    panel.style.padding = '10px';
    panel.style.zIndex = '9999';
    panel.style.fontSize = '12px';
    panel.style.fontFamily = 'monospace';
    panel.style.maxWidth = '300px';
    
    panel.innerHTML = `
        <h4>GitHub Pages Debug</h4>
        <p>URL: ${window.location.href}</p>
        <p>Repo: ${getRepositoryName()}</p>
        <button id="debug-toggle">Toggle Log</button>
        <div id="debug-log" style="display:none; max-height: 200px; overflow-y: auto;"></div>
    `;
    
    document.body.appendChild(panel);
    
    // Setup log toggle button
    document.getElementById('debug-toggle').addEventListener('click', function() {
        const log = document.getElementById('debug-log');
        log.style.display = log.style.display === 'none' ? 'block' : 'none';
    });
    
    // Override console.log to capture logs
    const originalLog = console.log;
    console.log = function() {
        const log = document.getElementById('debug-log');
        const args = Array.from(arguments);
        const line = document.createElement('div');
        line.textContent = args.join(' ');
        log.appendChild(line);
        if (log.children.length > 50) {
            log.removeChild(log.children[0]);
        }
        originalLog.apply(console, arguments);
    };
}