# NEET-PG Preparation Platform

A comprehensive learning platform for NEET-PG medical exam preparation, similar to platforms like Marrow, PrepLadder, and DAMS.

## Features

- **Platform Selection**: Choose from popular preparation platforms (Marrow, PrepLadder, DAMS)
- **Subject-based Organization**: Access all 19 MBBS subjects categorized into Pre-clinical, Para-clinical, and Clinical sections
- **Video Lectures**: Stream video lectures directly within the platform
- **Note-taking**: Take and save notes while watching lectures
- **Progress Tracking**: Track your learning progress with watched indicators
- **Playback Control**: Adjust video speed, use keyboard shortcuts for navigation
- **Responsive Design**: Works on desktop, tablet and mobile devices
- **External Stream Support**: Seamlessly integrates external streaming URLs directly in the platform

## Development

The application is built with:

- **Flask**: Python web framework for the backend
- **Bootstrap 5**: For responsive UI components
- **Video.js**: For video playback functionality
- **localStorage API**: For client-side progress and notes storage

## Deployment

This application can be deployed in two ways:

### 1. As a Flask Web Application

Run the application using:

```
gunicorn --bind 0.0.0.0:5000 main:app
```

### 2. As a Static Site on GitHub Pages

The repository includes GitHub Actions workflow to build and deploy the static version of the site to GitHub Pages.

To deploy manually:

1. Run the static site generator:
   ```
   python build_static.py
   ```

2. Deploy the contents of the `_site` directory to any static hosting service