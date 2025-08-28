# EmailJS Setup Guide for COP30 Questionnaire

This guide explains how to set up EmailJS to receive questionnaire responses at **aaaarnoldius@gmail.com** with file attachments.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **Gmail** (recommended for aaaarnoldius@gmail.com)
4. Click **"Connect Account"** and authorize Gmail access
5. Set Service ID as: `service_cop30_jetage`
6. Click **"Create Service"**

## Step 3: Create Email Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Set Template ID as: `template_cop30_questionnaire`
4. Use this template:

### Email Template Content:

**Subject:** New COP30 Questionnaire - {{contact_name}} from Benue State

**Body:**
```
New COP30 Questionnaire Submission Received!

CONTACT INFORMATION
===================
Name: {{contact_name}}
Title: {{contact_title}}
Email: {{contact_email}}
Phone: {{contact_phone}}
Ministry/Department: {{ministry_dept}}

CURRENT CLIMATE INITIATIVES
============================
Existing Programs:
{{existing_programs}}

Renewable Projects:
{{renewable_projects}}

Climate Challenges:
{{climate_challenges}}

Emissions Data: {{emissions_data}}

COP30 OBJECTIVES & GOALS
=========================
Primary Objectives:
{{cop30_goals}}

Key Messages:
{{key_messages}}

Partnerships Sought:
{{partnerships_sought}}

Funding Needs:
{{funding_needs}}

DELEGATION & LOGISTICS
======================
Delegation Size: {{delegation_size}}

Delegation Members:
{{delegation_members}}

Travel Support: {{travel_support}}

Special Requirements:
{{special_requirements}}

EXPECTED OUTCOMES
=================
Expected Outcomes:
{{expected_outcomes}}

Follow-up Actions:
{{follow_up_actions}}

Success Metrics:
{{success_metrics}}

ADDITIONAL INFORMATION
======================
{{additional_info}}

Submission Date: {{submission_date}}

FILE ATTACHMENTS
================
{{attachments}}

---
This submission was generated automatically from the COP30 Questionnaire website.
Jetage Energy - Renewables all the way...
```

4. Click **"Save"**

## Step 4: Get Your Keys

1. Go to **"Account"** in EmailJS dashboard
2. Find your **Public Key** 
3. Copy it and update `script.js`:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_cop30_jetage',
    templateId: 'template_cop30_questionnaire',
    publicKey: 'YOUR_ACTUAL_PUBLIC_KEY_HERE' // Replace this
};
```

## Step 5: Test the Integration

1. Open your website
2. Fill out a test questionnaire
3. Submit the form
4. Check **aaaarnoldius@gmail.com** for the email
5. Files will be included as base64 data in the email

## Email Format You'll Receive

Each submission will arrive as an email containing:
- All questionnaire responses formatted clearly
- Contact information and objectives
- File attachments converted to base64 (you can decode these if needed)
- Timestamp and source information

## File Handling

Files are converted to base64 and included in the email. For large files:
1. The system has size limits (5MB for delegation photos, 10MB for other files)
2. Base64 encoding increases file size by ~33%
3. Very large attachments might require manual follow-up

## Troubleshooting

### If emails don't arrive:
1. Check Gmail spam/junk folder
2. Verify EmailJS service is connected properly
3. Check browser console for JavaScript errors
4. Ensure all EmailJS IDs match exactly

### If files are missing:
1. Files are included as base64 in the email body
2. Look for the "FILE ATTACHMENTS" section
3. Large files might be truncated - contact submitter directly

### Fallback System:
If EmailJS fails, the system automatically:
1. Downloads the response as a JSON file
2. Shows an error message asking to email manually
3. Preserves all data for manual submission

## Monthly Limits

EmailJS free plan includes:
- 200 emails per month
- Should be sufficient for initial questionnaire collection
- Upgrade if you expect more than 200 responses

## Security Notes

- EmailJS public key is safe to include in frontend code
- No sensitive data is stored on EmailJS servers
- Emails go directly to your Gmail account
- File data is base64 encoded for security

---

**Next Steps:** After setup, test with a sample questionnaire to ensure everything works correctly!