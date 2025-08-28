// Jetage Energy COP30 Questionnaire JavaScript

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'service_cop30_jetage',
    templateId: 'template_cop30_question',
    publicKey: '_O76ZlQ0wx24Gvbh9' // Replace with your EmailJS public key from dashboard
};

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'ikpemosiarnold', // Replace with your Cloudinary cloud name
    uploadPreset: 'cop30_uploads' // Create this preset in your Cloudinary dashboard
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cop30-questionnaire');
    const successMessage = document.getElementById('success-message');

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('submission-date').value = today;

    // File upload handlers
    setupFileUploads();

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Add loading state to button
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            console.log('Submitting questionnaire data:', data);
            
            // Send email via EmailJS
            const result = await sendFormData(data);
            
            if (result.success) {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Show error message but keep form visible
                alert('There was an issue sending your submission. ' + result.message);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting your form. Please try again or contact support.');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Auto-save form data to localStorage
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`cop30_${input.name}`);
        if (savedValue && input.type !== 'date') {
            input.value = savedValue;
        }

        // Save data on change
        input.addEventListener('change', function() {
            localStorage.setItem(`cop30_${input.name}`, input.value);
        });

        input.addEventListener('input', function() {
            localStorage.setItem(`cop30_${input.name}`, input.value);
        });
    });
});

// Function to send form data via EmailJS
async function sendFormData(data) {
    try {
        // Prepare email template parameters
        const emailParams = {
            to_email: 'aaaarnoldius@gmail.com',
            from_name: data.stateContact || 'Benue State Representative',
            reply_to: data.contactEmail || 'noreply@benuestate.gov.ng',
            subject: 'New COP30 Questionnaire Submission - Benue State',
            
            // Contact Information
            contact_name: data.stateContact || '',
            contact_title: data.contactTitle || '',
            contact_email: data.contactEmail || '',
            contact_phone: data.contactPhone || '',
            ministry_dept: data.ministryDept || '',
            
            // Climate Initiatives
            existing_programs: data.existingPrograms || '',
            renewable_projects: data.renewableProjects || '',
            climate_challenges: data.climateChallenges || '',
            emissions_data: data.emissionsData || '',
            
            // COP30 Goals
            cop30_goals: data.cop30Goals || '',
            key_messages: data.keyMessages || '',
            partnerships_sought: data.partnershipsSought || '',
            funding_needs: data.fundingNeeds || '',
            
            // Delegation
            delegation_size: data.delegationSize || '',
            delegation_members: data.delegationMembers || '',
            travel_support: data.travelSupport || '',
            special_requirements: data.specialRequirements || '',
            
            // Outcomes
            expected_outcomes: data.expectedOutcomes || '',
            follow_up_actions: data.followUpActions || '',
            success_metrics: data.successMetrics || '',
            
            // Additional
            additional_info: data.additionalInfo || '',
            submission_date: data.submissionDate || '',
            
            // Upload files to Cloudinary first
            file_attachments: await formatFileLinksForEmail()
        };

        console.log('Email parameters being sent:', emailParams);

        // Send email using EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            emailParams
        );

        console.log('Email sent successfully:', response);
        return { success: true, message: 'Questionnaire submitted and emailed successfully!' };
        
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Fallback: Create downloadable JSON file
        createFallbackDownload(data);
        
        return { 
            success: false, 
            message: 'Email service unavailable. Your response has been downloaded as a backup file. Please email it manually to aaaarnoldius@gmail.com' 
        };
    }
}

// Upload files to Cloudinary and get URLs
async function uploadFilesToCloudinary() {
    const fileLinks = [];
    const fileInputs = document.querySelectorAll('.file-input');
    
    for (const input of fileInputs) {
        if (input.files && input.files.length > 0) {
            for (const file of input.files) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
                    
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        fileLinks.push({
                            name: file.name,
                            url: data.secure_url,
                            type: input.id // project-photos, state-documents, etc.
                        });
                    } else {
                        console.error('Failed to upload file:', file.name);
                    }
                } catch (error) {
                    console.error('Error uploading file:', file.name, error);
                }
            }
        }
    }
    
    return fileLinks;
}

// Format file links for email
async function formatFileLinksForEmail() {
    const fileLinks = await uploadFilesToCloudinary();
    
    console.log('File links from Cloudinary:', fileLinks);
    
    if (fileLinks.length === 0) {
        return 'No files uploaded';
    }
    
    let formattedLinks = 'Uploaded Files:\n\n';
    
    const groupedFiles = {
        'project-photos': [],
        'state-documents': [],
        'delegation-photos': []
    };
    
    fileLinks.forEach(file => {
        groupedFiles[file.type] = groupedFiles[file.type] || [];
        groupedFiles[file.type].push(file);
    });
    
    if (groupedFiles['project-photos'].length > 0) {
        formattedLinks += 'PROJECT PHOTOS:\n';
        groupedFiles['project-photos'].forEach(file => {
            formattedLinks += `• ${file.name}: ${file.url}\n`;
        });
        formattedLinks += '\n';
    }
    
    if (groupedFiles['state-documents'].length > 0) {
        formattedLinks += 'STATE DOCUMENTS:\n';
        groupedFiles['state-documents'].forEach(file => {
            formattedLinks += `• ${file.name}: ${file.url}\n`;
        });
        formattedLinks += '\n';
    }
    
    if (groupedFiles['delegation-photos'].length > 0) {
        formattedLinks += 'DELEGATION PHOTOS:\n';
        groupedFiles['delegation-photos'].forEach(file => {
            formattedLinks += `• ${file.name}: ${file.url}\n`;
        });
        formattedLinks += '\n';
    }
    
    return formattedLinks;
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Fallback download function
function createFallbackDownload(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cop30-questionnaire-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// PDF Generation Function - Creates a clean fillable form with official letterhead
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFont('helvetica');
    
    // LEFT SIDE - Logo and Company Name
    doc.setFontSize(24);
    doc.setTextColor(76, 175, 80); // Green
    doc.setFont('helvetica', 'bold');
    doc.text('JET AGE', 50, 25);
    
    doc.setFontSize(8);
    doc.setTextColor(76, 175, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('ENERGY SOLUTIONS NIGERIA LIMITED', 50, 30);
    doc.text('RC: 1175900', 50, 35);
    
    // RIGHT SIDE - Addresses
    doc.setFontSize(8);
    doc.setTextColor(76, 175, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Abuja Office:', 130, 15);
    doc.setFont('helvetica', 'normal');
    doc.text('22 Isah Mohammed Street,', 130, 20);
    doc.text('Durumi, Apo,', 130, 25);
    doc.text('Abuja, Nigeria.', 130, 30);
    
    doc.setFont('helvetica', 'bold');
    doc.text('UK Address:', 130, 38);
    doc.setFont('helvetica', 'normal');
    doc.text('Flat 3, Richmond House', 130, 43);
    doc.text('Sydenham Hill Sydenham', 130, 48);
    doc.text('SE 26 6AN, London.', 130, 53);
    
    // CENTER WATERMARK - Large faded logo
    doc.setTextColor(200, 200, 200); // Very light gray
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.text('JETAGE', 105, 140, { align: 'center' });
    doc.setFontSize(24);
    doc.text('ENERGY', 105, 155, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Renewables all', 105, 165, { align: 'center' });
    doc.text('the way...', 105, 170, { align: 'center' });
    
    // Document Title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('COP30 BRAZIL PARTICIPATION QUESTIONNAIRE', 105, 70, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Benue State, Nigeria', 105, 77, { align: 'center' });
    
    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 82, 190, 82);
    
    let yPos = 90;
    
    // Function to add fillable field
    function addField(label, height = 6, isMultiline = false) {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(label, 20, yPos);
        yPos += 4;
        
        // Draw field box
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(20, yPos, 170, height);
        
        if (isMultiline) {
            // Add lines for multiline fields
            for (let i = 1; i < height / 4; i++) {
                doc.line(20, yPos + (i * 4), 190, yPos + (i * 4));
            }
        }
        
        yPos += height + 4;
    }
    
    function addSection(title) {
        if (yPos > 260) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(27, 94, 32);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
    }
    
    // Section 1
    addSection('1. State Information & Leadership');
    addField('Primary Contact Person:');
    addField('Title/Position:');
    addField('Email Address:');
    addField('Phone Number:');
    addField('Relevant Ministry/Department:');
    
    // Section 2
    addSection('2. Current Climate Initiatives');
    addField('What climate change mitigation or adaptation programs does Benue State currently have?', 20, true);
    addField('Current renewable energy projects or initiatives:', 16, true);
    addField('Major climate challenges facing Benue State:', 16, true);
    addField('Do you have greenhouse gas emissions data for the state?');
    
    // Section 3
    addSection('3. COP30 Objectives & Goals');
    addField('What are Benue State\'s primary objectives for participating in COP30?', 16, true);
    addField('Key messages or commitments you want to present at COP30:', 16, true);
    addField('Types of partnerships or collaborations you\'re seeking:', 12, true);
    addField('Funding or investment opportunities you want to explore:', 12, true);
    
    // Section 4
    addSection('4. Delegation & Logistics');
    addField('Expected delegation size:');
    addField('Key delegation members (names and titles):', 16, true);
    addField('Will you need travel and accommodation support?');
    addField('Any special requirements or considerations:', 12, true);
    
    // Section 5
    addSection('5. Expected Outcomes & Follow-up');
    addField('What outcomes do you expect from COP30 participation?', 16, true);
    addField('Planned follow-up actions after COP30:', 16, true);
    addField('How will you measure the success of your COP30 participation?', 12, true);
    
    // Section 6
    addSection('6. Supporting Documents & Additional Information');
    addField('List any documents or photos you are providing separately:', 12, true);
    addField('Any additional information or questions:', 16, true);
    addField('Date of Submission:');
    
    // Footer with official contact info
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer content - Phone numbers and email (centered)
        doc.setFontSize(8);
        doc.setTextColor(76, 175, 80); // Green
        doc.setFont('helvetica', 'bold');
        doc.text('Tel: +234 803 302 6083, +234 812 139 7726, +234 809 546 8867', 105, 287, { align: 'center' });
        doc.text('E-mail: jetageenergy@gmail.com', 105, 292, { align: 'center' });
        
        // Page number (top right corner)
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, 190, 10, { align: 'right' });
    }
    
    // Save the PDF
    const fileName = `COP30-Questionnaire-Form-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

function gatherFormData() {
    const form = document.getElementById('cop30-questionnaire');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function generatePDFContent(data) {
    return `
        <div class="section">
            <h3>1. State Information & Leadership</h3>
            <div class="question">
                <label>Primary Contact Person:</label>
                <div class="answer">${data.stateContact || ''}</div>
            </div>
            <div class="question">
                <label>Title/Position:</label>
                <div class="answer">${data.contactTitle || ''}</div>
            </div>
            <div class="question">
                <label>Email Address:</label>
                <div class="answer">${data.contactEmail || ''}</div>
            </div>
            <div class="question">
                <label>Phone Number:</label>
                <div class="answer">${data.contactPhone || ''}</div>
            </div>
            <div class="question">
                <label>Relevant Ministry/Department:</label>
                <div class="answer">${data.ministryDept || ''}</div>
            </div>
        </div>

        <div class="section">
            <h3>2. Current Climate Initiatives</h3>
            <div class="question">
                <label>What climate change mitigation or adaptation programs does Benue State currently have?</label>
                <div class="answer">${data.existingPrograms || ''}</div>
            </div>
            <div class="question">
                <label>Current renewable energy projects or initiatives:</label>
                <div class="answer">${data.renewableProjects || ''}</div>
            </div>
            <div class="question">
                <label>Major climate challenges facing Benue State:</label>
                <div class="answer">${data.climateChallenges || ''}</div>
            </div>
            <div class="question">
                <label>Do you have greenhouse gas emissions data for the state?</label>
                <div class="answer">${data.emissionsData || ''}</div>
            </div>
        </div>

        <div class="section">
            <h3>3. COP30 Objectives & Goals</h3>
            <div class="question">
                <label>What are Benue State's primary objectives for participating in COP30?</label>
                <div class="answer">${data.cop30Goals || ''}</div>
            </div>
            <div class="question">
                <label>Key messages or commitments you want to present at COP30:</label>
                <div class="answer">${data.keyMessages || ''}</div>
            </div>
            <div class="question">
                <label>Types of partnerships or collaborations you're seeking:</label>
                <div class="answer">${data.partnershipsSought || ''}</div>
            </div>
            <div class="question">
                <label>Funding or investment opportunities you want to explore:</label>
                <div class="answer">${data.fundingNeeds || ''}</div>
            </div>
        </div>

        <div class="section">
            <h3>4. Delegation & Logistics</h3>
            <div class="question">
                <label>Expected delegation size:</label>
                <div class="answer">${data.delegationSize || ''}</div>
            </div>
            <div class="question">
                <label>Key delegation members (names and titles):</label>
                <div class="answer">${data.delegationMembers || ''}</div>
            </div>
            <div class="question">
                <label>Will you need travel and accommodation support?</label>
                <div class="answer">${data.travelSupport || ''}</div>
            </div>
            <div class="question">
                <label>Any special requirements or considerations:</label>
                <div class="answer">${data.specialRequirements || ''}</div>
            </div>
        </div>

        <div class="section">
            <h3>5. Expected Outcomes & Follow-up</h3>
            <div class="question">
                <label>What outcomes do you expect from COP30 participation?</label>
                <div class="answer">${data.expectedOutcomes || ''}</div>
            </div>
            <div class="question">
                <label>Planned follow-up actions after COP30:</label>
                <div class="answer">${data.followUpActions || ''}</div>
            </div>
            <div class="question">
                <label>How will you measure the success of your COP30 participation?</label>
                <div class="answer">${data.successMetrics || ''}</div>
            </div>
        </div>

        <div class="section">
            <h3>6. Supporting Documents & Images</h3>
            <div class="question">
                <label>Project Photos/Documentation:</label>
                <div class="answer">Files uploaded (see digital submission)</div>
            </div>
            <div class="question">
                <label>State Climate Documents/Reports:</label>
                <div class="answer">Files uploaded (see digital submission)</div>
            </div>
            <div class="question">
                <label>Delegation Member Photos:</label>
                <div class="answer">Files uploaded (see digital submission)</div>
            </div>
        </div>

        <div class="section">
            <h3>7. Additional Information</h3>
            <div class="question">
                <label>Any additional information or questions:</label>
                <div class="answer">${data.additionalInfo || ''}</div>
            </div>
            <div class="question">
                <label>Date of Submission:</label>
                <div class="answer">${data.submissionDate || ''}</div>
            </div>
        </div>
    `;
}

// File Upload Management
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            handleFileSelect(e, input);
        });
    });
}

function handleFileSelect(event, input) {
    const files = Array.from(event.target.files);
    const previewId = input.id + '-preview';
    const preview = document.getElementById(previewId.replace('-', '-').replace('photos', 'preview').replace('documents', 'preview'));
    
    let previewContainer;
    switch(input.id) {
        case 'project-photos':
            previewContainer = document.getElementById('photo-preview');
            break;
        case 'state-documents':
            previewContainer = document.getElementById('docs-preview');
            break;
        case 'delegation-photos':
            previewContainer = document.getElementById('delegation-preview');
            break;
    }

    files.forEach((file, index) => {
        if (validateFile(file, input)) {
            createFilePreview(file, previewContainer, input.id + '_' + index);
        }
    });
}

function validateFile(file, input) {
    const maxSize = input.id.includes('delegation') ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for delegation, 10MB for others
    
    if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is ${maxSize / (1024*1024)}MB.`);
        return false;
    }
    
    return true;
}

function createFilePreview(file, container, fileId) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.id = 'preview-' + fileId;
    
    const isImage = file.type.startsWith('image/');
    
    if (isImage) {
        const img = document.createElement('img');
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        fileItem.appendChild(img);
    } else {
        const icon = document.createElement('div');
        icon.className = 'file-icon';
        icon.textContent = getFileExtension(file.name).toUpperCase();
        fileItem.appendChild(icon);
    }
    
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
    
    const fileSize = document.createElement('div');
    fileSize.className = 'file-size';
    fileSize.textContent = formatFileSize(file.size);
    
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);
    fileItem.appendChild(fileInfo);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = function() {
        fileItem.remove();
        removeFileFromInput(fileId);
    };
    
    fileItem.appendChild(removeBtn);
    container.appendChild(fileItem);
}

function getFileExtension(filename) {
    return filename.split('.').pop() || 'FILE';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFileFromInput(fileId) {
    // Note: Due to browser security, we can't directly modify file inputs
    // This is handled by the preview system for UI purposes
    console.log('Removed file preview:', fileId);
}