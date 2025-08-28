# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive COP30 questionnaire system for Jetage Energy to assess Benue State's readiness for COP30 participation in Brazil. The project includes both web-based and PDF questionnaire formats with an admin dashboard for response management.

## Architecture

### Frontend Components
- **index.html**: Main questionnaire form with file upload capabilities
- **admin.html**: Admin dashboard for viewing and managing responses
- **questionnaire.pdf.html**: Printable PDF version of the questionnaire
- **styles.css**: Unified styling using Jetage Energy brand colors (Gold #FFB800, Green #1B5E20)
- **script.js**: Form handling, file upload management, and PDF generation

### Key Features
- Responsive design optimized for all devices
- File upload system with preview functionality
- Admin authentication and response management
- Printable PDF version with proper formatting
- Form data export as JSON
- Auto-save functionality using localStorage

## Development Commands

### Local Development
```bash
# Serve locally (any simple HTTP server)
python -m http.server 8000
# or
npx serve .
```

### Testing
- Open `index.html` for the main questionnaire
- Open `admin.html` for admin dashboard (credentials: jetage-admin / cop30-benue-2024)
- Test file uploads with various file types and sizes
- Verify PDF generation and printing functionality

## Deployment

### Free Hosting Options
1. **GitHub Pages**: Upload to repository, enable Pages in settings
2. **Netlify**: Drag and drop deployment at netlify.com
3. **Vercel**: Connect GitHub repository for automatic deployments

### File Structure
```
jetage-cop/
├── index.html              # Main questionnaire
├── admin.html              # Admin dashboard  
├── questionnaire.pdf.html  # Printable version
├── styles.css              # Unified styles
├── script.js               # JavaScript functionality
├── jetagelogo.png          # Jetage Energy logo
└── README.md               # Project documentation
```

## Customization Guidelines

### Branding
- Brand colors defined in CSS custom properties (--primary-gold, --primary-green)
- Logo replacement: update `jetagelogo.png` (recommended: 224x204px PNG)
- Consistent color scheme across all components

### Form Modifications
- Add/remove questions in the form sections
- Update PDF generation function to match form changes
- Maintain consistent styling with existing form groups

### Admin Dashboard
- Demo credentials in admin.html must be changed for production
- Response data structure is defined in JavaScript arrays
- File handling is client-side only (suitable for GitHub Pages)

## Security Notes

For production deployment:
1. Change default admin credentials
2. Implement secure server-side authentication
3. Add proper file upload validation and storage
4. Use HTTPS hosting
5. Add rate limiting for form submissions

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript ES6+ features used
- File API for upload functionality
- Print CSS for PDF generation