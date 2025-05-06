// Video player functionality using Video.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize video.js player if video element exists
    const videoElement = document.getElementById('lecture-video');
    
    if (videoElement) {
        // Initialize the player
        const player = videojs('lecture-video', {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
            controlBar: {
                children: [
                    'playToggle',
                    'volumePanel',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'playbackRateMenuButton',
                    'fullscreenToggle'
                ]
            }
        });
        
        // Get lecture ID to save progress
        const lectureId = videoElement.dataset.lectureId;
        
        // Load saved progress if available
        const savedTime = localStorage.getItem(`video-progress-${lectureId}`);
        if (savedTime) {
            player.currentTime(parseFloat(savedTime));
        }
        
        // Save progress every 5 seconds
        player.on('timeupdate', function() {
            if (player.currentTime() > 0) {
                localStorage.setItem(`video-progress-${lectureId}`, player.currentTime());
                
                // Update progress bar
                const progressPercent = (player.currentTime() / player.duration()) * 100;
                const progressBar = document.getElementById('video-progress');
                if (progressBar) {
                    progressBar.style.width = `${progressPercent}%`;
                    progressBar.setAttribute('aria-valuenow', progressPercent);
                }
                
                // Mark as watched if progress > 90%
                if (progressPercent > 90) {
                    localStorage.setItem(`video-watched-${lectureId}`, 'true');
                    
                    // Update watched badge if it exists
                    const watchedBadge = document.querySelector(`.watched-badge[data-lecture-id="${lectureId}"]`);
                    if (watchedBadge) {
                        watchedBadge.style.display = 'inline-block';
                    }
                }
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            // Space to play/pause
            if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                event.preventDefault();
                if (player.paused()) {
                    player.play();
                } else {
                    player.pause();
                }
            }
            
            // Left/right arrow keys to seek
            if (event.code === 'ArrowLeft') {
                player.currentTime(Math.max(0, player.currentTime() - 10));
            }
            if (event.code === 'ArrowRight') {
                player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
            }
            
            // Up/down arrow keys for volume
            if (event.code === 'ArrowUp') {
                player.volume(Math.min(1, player.volume() + 0.1));
            }
            if (event.code === 'ArrowDown') {
                player.volume(Math.max(0, player.volume() - 0.1));
            }
            
            // 'F' for fullscreen
            if (event.code === 'KeyF') {
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
            }
        });
        
        // Handle playback rate buttons
        const speedButtons = document.querySelectorAll('.speed-btn');
        if (speedButtons.length > 0) {
            speedButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const speed = parseFloat(this.dataset.speed);
                    player.playbackRate(speed);
                    
                    // Update active button
                    speedButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
        
        // Check if video was previously marked as watched
        const wasWatched = localStorage.getItem(`video-watched-${lectureId}`) === 'true';
        if (wasWatched) {
            const watchedBadge = document.querySelector(`.watched-badge[data-lecture-id="${lectureId}"]`);
            if (watchedBadge) {
                watchedBadge.style.display = 'inline-block';
            }
        }
        
        // Handle notes feature
        const notesForm = document.getElementById('notesForm');
        if (notesForm) {
            const notesTextarea = document.getElementById('lectureNotes');
            
            // Load saved notes
            const savedNotes = localStorage.getItem(`lecture-notes-${lectureId}`);
            if (savedNotes) {
                notesTextarea.value = savedNotes;
            }
            
            // Save notes on input
            notesTextarea.addEventListener('input', function() {
                localStorage.setItem(`lecture-notes-${lectureId}`, this.value);
            });
            
            // Handle notes form submission
            notesForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Display success message
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success mt-2';
                successAlert.textContent = 'Notes saved successfully!';
                successAlert.role = 'alert';
                
                notesForm.appendChild(successAlert);
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successAlert.remove();
                }, 3000);
            });
        }
    }
    
    // Mark lectures as watched on list pages
    document.querySelectorAll('.lecture-item').forEach(item => {
        const lectureId = item.dataset.lectureId;
        const wasWatched = localStorage.getItem(`video-watched-${lectureId}`) === 'true';
        
        if (wasWatched) {
            const watchedBadge = item.querySelector('.watched-badge');
            if (watchedBadge) {
                watchedBadge.style.display = 'inline-block';
            }
        }
    });
});
