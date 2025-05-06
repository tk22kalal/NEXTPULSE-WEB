import os
import json
import shutil
from app import app

# Create directory structure for static site
os.makedirs('_site', exist_ok=True)

# Function to load JSON data
def load_data(filename):
    with open(os.path.join('data', filename), 'r') as f:
        return json.load(f)

# Load all required data
platforms = load_data('platforms.json')
subjects = load_data('subjects.json')
lectures = load_data('lectures.json')

# Create index.html (platform selection)
with app.test_request_context():
    from flask import render_template
    
    # Generate platform selection page (index.html)
    index_html = render_template('index.html', 
                                platforms=platforms, 
                                title="NEET-PG Preparation - Select Platform")
    
    with open(os.path.join('_site', 'index.html'), 'w') as f:
        f.write(index_html)
    
    # Generate 404 page
    not_found_html = render_template('404.html')
    with open(os.path.join('_site', '404.html'), 'w') as f:
        f.write(not_found_html)
    
    # Generate subjects pages for each platform
    for platform in platforms:
        platform_dir = os.path.join('_site', platform['id'])
        os.makedirs(platform_dir, exist_ok=True)
        
        # Generate subject listing page
        subject_html = render_template('subjects.html',
                                      platform=platform['id'],
                                      platform_name=platform['name'],
                                      subjects=subjects,
                                      title=f"{platform['name']} - Subjects")
        
        with open(os.path.join(platform_dir, 'index.html'), 'w') as f:
            f.write(subject_html)
        
        # Generate lectures page for each subject
        for subject in subjects:
            subject_path = os.path.join(platform_dir, subject['id'])
            os.makedirs(subject_path, exist_ok=True)
            
            # Filter lectures for this subject
            subject_lectures = [l for l in lectures if l['subject_id'] == subject['id']]
            
            # Generate lecture listing page
            lectures_html = render_template('lectures.html',
                                          platform=platform['id'],
                                          platform_name=platform['name'],
                                          subject=subject,
                                          lectures=subject_lectures,
                                          title=f"{subject['name']} Lectures")
            
            with open(os.path.join(subject_path, 'index.html'), 'w') as f:
                f.write(lectures_html)
            
            # Generate video player page for each lecture
            for lecture in subject_lectures:
                lecture_dir = os.path.join(subject_path, lecture['id'])
                os.makedirs(lecture_dir, exist_ok=True)
                
                # Get related lectures (excluding current one)
                related_lectures = [l for l in subject_lectures if l['id'] != lecture['id']]
                
                # Generate player page
                player_html = render_template('player.html',
                                            platform=platform['id'],
                                            platform_name=platform['name'],
                                            subject=subject,
                                            lecture=lecture,
                                            related_lectures=related_lectures,
                                            title=f"{lecture['title']}")
                
                with open(os.path.join(lecture_dir, 'index.html'), 'w') as f:
                    f.write(player_html)

# Copy static assets
if os.path.exists(os.path.join('_site', 'static')):
    shutil.rmtree(os.path.join('_site', 'static'))
shutil.copytree('static', os.path.join('_site', 'static'))

# Copy data directory
if os.path.exists(os.path.join('_site', 'data')):
    shutil.rmtree(os.path.join('_site', 'data'))
shutil.copytree('data', os.path.join('_site', 'data'))

print("Static site generation complete!")