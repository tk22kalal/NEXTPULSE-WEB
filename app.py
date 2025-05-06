import os
import json
import logging
from flask import Flask, render_template, request, redirect, url_for, abort

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Load data from JSON files
def load_data(filename):
    try:
        with open(f'data/{filename}', 'r') as file:
            return json.load(file)
    except Exception as e:
        logger.error(f"Error loading {filename}: {e}")
        return []

@app.route('/')
def index():
    """Landing page with platform selection"""
    platforms = load_data('platforms.json')
    return render_template('index.html', platforms=platforms)

@app.route('/subjects/<platform>')
def subjects(platform):
    """Page displaying all MBBS subjects for the selected platform"""
    platforms = load_data('platforms.json')
    platform_exists = any(p['id'] == platform for p in platforms)
    
    if not platform_exists:
        abort(404)
        
    subjects = load_data('subjects.json')
    return render_template('subjects.html', subjects=subjects, platform=platform)

@app.route('/lectures/<platform>/<subject_id>')
def lectures(platform, subject_id):
    """Page displaying lectures for the selected subject"""
    platforms = load_data('platforms.json')
    subjects = load_data('subjects.json')
    
    platform_exists = any(p['id'] == platform for p in platforms)
    subject_exists = any(s['id'] == subject_id for s in subjects)
    
    if not platform_exists or not subject_exists:
        abort(404)
    
    subject = next((s for s in subjects if s['id'] == subject_id), None)
    lectures = load_data('lectures.json')
    
    # Filter lectures by subject
    subject_lectures = [l for l in lectures if l['subject_id'] == subject_id]
    
    return render_template('lectures.html', 
                           subject=subject, 
                           lectures=subject_lectures, 
                           platform=platform)

@app.route('/player/<platform>/<subject_id>/<lecture_id>')
def player(platform, subject_id, lecture_id):
    """Video player page for streaming the selected lecture"""
    platforms = load_data('platforms.json')
    subjects = load_data('subjects.json')
    lectures = load_data('lectures.json')
    
    platform_exists = any(p['id'] == platform for p in platforms)
    subject_exists = any(s['id'] == subject_id for s in subjects)
    lecture_exists = any(l['id'] == lecture_id for l in lectures)
    
    if not platform_exists or not subject_exists or not lecture_exists:
        abort(404)
    
    lecture = next((l for l in lectures if l['id'] == lecture_id), None)
    subject = next((s for s in subjects if s['id'] == subject_id), None)
    
    # Get related lectures (same subject)
    related_lectures = [l for l in lectures if l['subject_id'] == subject_id and l['id'] != lecture_id]
    
    return render_template('player.html', 
                           lecture=lecture, 
                           subject=subject, 
                           related_lectures=related_lectures,
                           platform=platform)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
