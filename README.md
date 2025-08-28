# COP30 Questionnaire for Benue State

A comprehensive web-based questionnaire system for Jetage Energy to assess Benue State's readiness and requirements for COP30 participation in Brazil.

## Features

### 📋 Comprehensive Questionnaire
- State information and leadership details
- Current climate initiatives assessment
- COP30 objectives and goals
- Delegation logistics planning
- Expected outcomes and follow-up actions
- File upload capabilities for supporting documents

### 🎨 Modern Design
- Jetage Energy brand colors (Gold & Green)
- Responsive design for all devices
- Professional, user-friendly interface
- File preview functionality

### 📄 Dual Format Support
- **Web Form**: Interactive online questionnaire
- **PDF Version**: Downloadable and printable form

### 🗂️ File Upload System
- Project photos and documentation
- State climate documents/reports
- Delegation member photos
- Support for images, PDFs, and Office documents
- File size validation and preview

### 👨‍💼 Admin Dashboard
- Secure login system
- View all questionnaire responses
- Download individual responses
- Export all data functionality
- Search and filter responses
- File management system

## Getting Started

### Free Hosting Options

#### Option 1: GitHub Pages (Recommended)
1. Create a GitHub repository
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at: `https://yourusername.github.io/repository-name`

#### Option 2: Netlify
1. Sign up for free at [Netlify](https://netlify.com)
2. Drag and drop the project folder to Netlify
3. Get instant free hosting with SSL

#### Option 3: Vercel
1. Sign up at [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Automatic deployments on every push

### Local Development
1. Clone or download this repository
2. Open `index.html` in your web browser
3. For admin access, open `admin.html`

## Admin Access

### Default Credentials
- **Username**: `jetage-admin`
- **Password**: `cop30-benue-2024`

⚠️ **Important**: Change these credentials before deploying to production!

## File Structure

```
jetage-cop/
├── index.html          # Main questionnaire form
├── admin.html          # Admin dashboard
├── styles.css          # Styling and branding
├── script.js           # Form functionality
├── jetagelogo.png      # Jetage Energy logo
├── README.md           # This file
└── CLAUDE.md           # Claude Code guidance
```

## Customization

### Branding
- Colors are defined in CSS custom properties in `styles.css`
- Replace `jetagelogo.png` with your preferred logo
- Update text content in HTML files as needed

### Form Fields
- Add/remove form fields in `index.html`
- Update PDF generation in `script.js`
- Modify admin dashboard display in `admin.html`

## Data Management

### EmailJS Integration
All form submissions are automatically emailed to **aaaarnoldius@gmail.com**:
- Complete questionnaire responses in formatted email
- File attachments included as base64 data
- No server storage required
- Fallback download if email fails

### Setup Required
1. Follow instructions in `EMAILJS_SETUP.md`
2. Create free EmailJS account
3. Configure Gmail service and template
4. Update public key in `script.js`

### Admin Dashboard
- Shows email integration status
- Demo interface for presentation purposes
- Actual responses arrive via email

## Security Considerations

### For Production Use:
1. **Change admin credentials**
2. **Implement secure authentication**
3. **Use HTTPS hosting**
4. **Add server-side validation**
5. **Implement proper file upload handling**
6. **Add rate limiting**

## Support

For technical support or customizations:
- Review the code documentation
- Check browser console for errors
- Ensure all files are uploaded to your hosting provider

## License

This project is created for Jetage Energy's COP30 initiative with Benue State, Nigeria.

---

**Jetage Energy - Renewables all the way...**