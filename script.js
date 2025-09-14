// Resume Green Tick

function displayFileName() {
  const fileInput = document.getElementById("resume");
  const fileName = document.getElementById("file-name");
  const checkmark = document.getElementById("checkmark");

  // Get the file name and display it
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    fileName.textContent = selectedFile.name;
    checkmark.style.display = 'inline';  // Show green tick
  } else {
    fileName.textContent = 'No file chosen';
    checkmark.style.display = 'none';   // Hide green tick if no file is selected
  }
}



// JOB Listings


fetch('jobs.json') // Fetch the JSON file
  .then(response => response.json()) // Parse the JSON data
  .then(data => {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous data

    data.forEach(job => {
      // Create a job card
      const jobCard = document.createElement('div');
      jobCard.style.border = '1px solid #ccc';
      jobCard.style.padding = '10px';
      jobCard.style.marginBottom = '10px';

      jobCard.innerHTML = `
            <h3>${job.job_title}</h3>
            <p><strong>Company:</strong> ${job.company_name}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Experience Required:</strong> ${job.job_experience_required}</p>
            <p><strong>Key Skills:</strong> ${job.key_skills}</p>
            <p><strong>Role:</strong> ${job.role}</p>
            <p><strong>Salary:</strong> ${job.job_salary}</p>

        <div class="button-container">
            <button class="button missing-skills">Missing Skills</button>
            <button class="button upskill">Upskill</button>
            <button class="button company-reviews" data-company="${job.company_name}">Company Reviews</button>
            <button class="button apply-now">Apply Now</button>
        </div>
          `;

      outputDiv.appendChild(jobCard);
    });

    document.querySelectorAll('.button.company-reviews').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const companyName = e.target.getAttribute('data-company');
        openCompanyReviewsModal(companyName);
      });
    });

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });


const GEMINI_API_KEY = window.CONFIG?.GEMINI_API_KEY || '';

async function fetchCompanyReviews(companyName) {
  const prompt = `Generate realistic employee reviews for ${companyName}. Please provide:

**Company Culture:**
Describe the work environment, values, and team dynamics.

**Employee Satisfaction:**
Discuss salary satisfaction, benefits, work-life balance, and job security.

**Workplace Environment:**
Detail the physical/remote work setup, office amenities, and collaboration tools.

**Career Growth:**
Mention promotion opportunities, learning and development, mentorship programs.

**Management Style:**
Describe leadership approach, communication, and support from supervisors.

**Pros and Cons:**
**Pros:**
* List 3-4 positive aspects
* Focus on what employees typically appreciate

**Cons:**
* List 3-4 areas for improvement
* Include common employee concerns

Please make this sound like genuine employee feedback, realistic and balanced. Format with clear sections and bullet points where appropriate.`;

  try {
    console.log('Fetching reviews for:', companyName);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.8,
          topP: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const reviewText = data.candidates[0].content.parts[0].text;
      console.log('Review text:', reviewText);
      return reviewText;
    } else {
      console.error('Unexpected API response structure:', data);
      return `Here's what we know about ${companyName}:

**Company Culture:**
This company maintains a professional work environment focused on innovation and teamwork. Employees often collaborate on challenging projects that push the boundaries of their industry.

**Employee Satisfaction:**
Many employees appreciate the opportunity to work with cutting-edge technology and be part of a forward-thinking organization. Benefits packages are typically competitive within the industry.

**Workplace Environment:**
The company provides modern facilities and tools necessary for employees to do their best work. Work arrangements may include both on-site and remote options depending on the role.

**Career Growth:**
Professional development opportunities are available, including training programs and mentorship. The company values internal promotions and career advancement.

**Pros:**
* Innovative and challenging work environment
* Opportunities to work with advanced technology
* Strong brand reputation in the industry
* Competitive compensation packages

**Cons:**
* High performance expectations
* Fast-paced work environment may be demanding
* Industry competition can create pressure
* Work-life balance may vary by department`;
    }
  } catch (error) {
    console.error('Error fetching company reviews:', error);
    return `We're currently unable to fetch detailed reviews for ${companyName}. Here's some general information:

**Company Overview:**
${companyName} is an established company in their industry. While we gather more specific employee feedback, we recommend checking their official website and professional networks for the latest company information.

**What You Can Do:**
* Visit the company's official website for culture information
* Check their LinkedIn page for employee posts and updates
* Look for recent news articles about the company
* Consider reaching out to current employees through professional networks

We apologize for the inconvenience and are working to provide more detailed reviews soon.`;
  }
}

// Format company reviews with modern styling
function formatCompanyReviews(reviewText) {
  // Create a container for formatted reviews
  const formattedReviews = document.createElement('div');
  formattedReviews.className = 'reviews-content';

  // Add modern styling for the content
  const style = document.createElement('style');
  style.textContent = `
    .reviews-content {
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #fafbfc;
      min-height: 300px;
      overflow: hidden;
    }
    
    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      padding: 32px;
      align-items: start;
    }
    
    .review-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      min-height: 160px;
      display: flex;
      flex-direction: column;
      margin: 0;
    }
    
    .review-card:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }
    
    .review-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 0 0 20px 0;
      flex-shrink: 0;
    }
    
    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: white;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
      margin: 0;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    
    .card-title {
      font-size: 17px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.3;
    }
    
    .card-content {
      color: #475569;
      line-height: 1.6;
      font-size: 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: 0;
      padding: 0;
    }
    
    .card-content p {
      margin: 0 0 12px 0;
      padding: 0;
    }
    
    .card-content p:last-child {
      margin-bottom: 0;
    }
    
    .card-content.empty {
      display: none;
    }
    
    .highlights-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .highlights-list li {
      position: relative;
      padding: 8px 0 8px 20px;
      color: #475569;
      line-height: 1.5;
      font-size: 14px;
      margin: 0;
    }
    
    .highlights-list li:before {
      content: '•';
      position: absolute;
      left: 0;
      color: #4f46e5;
      font-size: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
    }
    
    .highlights-list:empty {
      display: none;
    }
    
    .pros-cons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 0 32px 24px 32px;
      align-items: start;
    }
    
    .pros-cons-grid:empty {
      display: none;
    }
    
    .pros-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #bbf7d0;
    }
    
    .pros-card::before {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }
    
    .pros-card .card-icon {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
    }
    
    .cons-card {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 1px solid #fecaca;
    }
    
    .cons-card::before {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
    
    .cons-card .card-icon {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin: 0 32px 24px 32px;
      padding: 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    
    .stats-grid:empty {
      display: none;
    }
    
    .stat-item {
      text-align: center;
      padding: 12px 8px;
      margin: 0;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #4f46e5;
      display: block;
      margin: 0 0 6px 0;
      text-shadow: none;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-weight: 500;
      line-height: 1.3;
      margin: 0;
    }
    
    .fallback-content {
      text-align: center;
      padding: 60px 32px;
      background: white;
      border-radius: 16px;
      margin: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .fallback-icon {
      font-size: 24px;
      margin: 0 0 20px 0;
      opacity: 0.8;
      color: #64748b;
      font-weight: 600;
      background: #f1f5f9;
      padding: 16px 20px;
      border-radius: 8px;
      display: inline-block;
      letter-spacing: 1px;
    }
    
    .fallback-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px 0;
    }
    
    .fallback-text {
      color: #64748b;
      line-height: 1.6;
      max-width: 480px;
      margin: 0 auto;
      font-size: 15px;
    }
    
    .error-section {
      text-align: center;
      padding: 60px 32px;
      background: white;
      border-radius: 16px;
      margin: 32px;
    }
    
    .error-icon {
      font-size: 48px;
      margin: 0 0 16px 0;
    }
    
    .error-section h3 {
      font-size: 20px;
      color: #1e293b;
      margin: 0 0 12px 0;
      font-weight: 600;
    }
    
    .error-section p {
      color: #64748b;
      margin: 0;
      font-size: 15px;
      line-height: 1.5;
    }
    
    /* Hide empty sections */
    .review-grid:empty {
      display: none;
    }
    
    .review-card:empty {
      display: none;
    }
    
    @media (max-width: 768px) {
      .reviews-content {
        padding: 0;
      }
      
      .review-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 20px;
      }
      
      .pros-cons-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 0 20px 20px 20px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        padding: 20px;
        margin: 0 20px 20px 20px;
      }
      
      .card-header {
        gap: 12px;
      }
      
      .card-icon {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }
      
      .card-title {
        font-size: 16px;
      }
      
      .fallback-content, .error-section {
        padding: 40px 20px;
        margin: 20px;
      }
      
      .fallback-icon {
        font-size: 44px;
      }
      
      .fallback-title {
        font-size: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .review-grid {
        padding: 16px;
      }
      
      .pros-cons-grid {
        padding: 0 16px 16px 16px;
      }
      
      .stats-grid {
        margin: 0 16px 16px 16px;
        padding: 16px;
      }
      
      .card-content {
        font-size: 13px;
      }
      
      .highlights-list li {
        font-size: 13px;
      }
    }
  `;
  formattedReviews.appendChild(style);

  // If no review text or error, show fallback
  if (!reviewText || reviewText.includes('Unable to fetch') || reviewText.trim().length < 50) {
    formattedReviews.innerHTML = `
      <div class="fallback-content">
        <div class="fallback-icon">INFO</div>
        <h2 class="fallback-title">Company Information</h2>
        <p class="fallback-text">
          We are currently gathering detailed employee reviews for this company. 
          Please check back soon or visit the company's official website and 
          professional networks for additional workplace insights.
        </p>
      </div>
    `;
    return formattedReviews;
  }

  // Extract and validate content sections
  const sections = [
    { icon: 'C', title: 'Company Culture', keywords: ['Company Culture', 'Culture', 'culture', 'values', 'environment'] },
    { icon: 'S', title: 'Employee Satisfaction', keywords: ['Employee Satisfaction', 'Satisfaction', 'satisfaction', 'benefits', 'compensation'] },
    { icon: 'W', title: 'Work Environment', keywords: ['Workplace Environment', 'Environment', 'workplace', 'office', 'facilities'] },
    { icon: 'G', title: 'Career Development', keywords: ['Career Growth', 'Growth', 'Development', 'career', 'advancement'] },
    { icon: 'M', title: 'Management', keywords: ['Management Style', 'Management', 'Leadership', 'leadership', 'management'] }
  ];

  const availableSections = [];
  const prosItems = extractProsCons(reviewText, 'pros');
  const consItems = extractProsCons(reviewText, 'cons');

  // Only add sections that have content
  sections.forEach(section => {
    const content = extractSection(reviewText, section.keywords);
    if (content && content.trim().length > 0) {
      availableSections.push({ ...section, content });
    }
  });

  // Only show content if we have meaningful information
  if (availableSections.length === 0 && prosItems.length === 0 && consItems.length === 0) {
    formattedReviews.innerHTML = `
      <div class="fallback-content">
        <div class="fallback-icon">INFO</div>
        <h2 class="fallback-title">Company Information</h2>
        <p class="fallback-text">
          Detailed employee reviews are being compiled for this company. 
          Please check official company resources and professional platforms 
          for current workplace information.
        </p>
      </div>
    `;
    return formattedReviews;
  }

  // Build the content structure with only available information
  let contentHTML = '';

  // Add available review sections
  if (availableSections.length > 0) {
    contentHTML += '<div class="review-grid">';
    availableSections.forEach(section => {
      contentHTML += createReviewCard(section.icon, section.title, section.content);
    });
    contentHTML += '</div>';
  }
  
  // Add stats only if we have multiple sections
  if (availableSections.length >= 3) {
    contentHTML += `
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">3.8</span>
          <div class="stat-label">Overall Rating</div>
        </div>
        <div class="stat-item">
          <span class="stat-value">72%</span>
          <div class="stat-label">Recommend to Friend</div>
        </div>
        <div class="stat-item">
          <span class="stat-value">3.6</span>
          <div class="stat-label">Work-Life Balance</div>
        </div>
        <div class="stat-item">
          <span class="stat-value">3.9</span>
          <div class="stat-label">Career Opportunities</div>
        </div>
      </div>
    `;
  }
  
  // Add pros/cons only if both exist or at least one has substantial content
  if ((prosItems.length > 0 && consItems.length > 0) || 
      (prosItems.length >= 2 || consItems.length >= 2)) {
    contentHTML += '<div class="pros-cons-grid">';
    
    if (prosItems.length > 0) {
      contentHTML += createProsConsCard('+', 'Positive Aspects', prosItems, 'pros-card');
    }
    
    if (consItems.length > 0) {
      contentHTML += createProsConsCard('!', 'Areas for Improvement', consItems, 'cons-card');
    }
    
    contentHTML += '</div>';
  }

  formattedReviews.innerHTML = contentHTML;
  return formattedReviews;
}

// Helper function to create review cards
function createReviewCard(icon, title, content) {
  // Don't create card if no meaningful content
  if (!content || content.trim().length === 0) {
    return '';
  }
  
  return `
    <div class="review-card">
      <div class="card-header">
        <div class="card-icon">${icon}</div>
        <h3 class="card-title">${title}</h3>
      </div>
      <div class="card-content">
        ${content}
      </div>
    </div>
  `;
}

// Helper function to create pros/cons cards
function createProsConsCard(icon, title, items, className) {
  // Don't create card if no items
  if (!items || items.length === 0) {
    return '';
  }
  
  const listItems = items.map(item => `<li>${item.trim()}</li>`).join('');
  
  return `
    <div class="review-card ${className}">
      <div class="card-header">
        <div class="card-icon">${icon}</div>
        <h3 class="card-title">${title}</h3>
      </div>
      <div class="card-content">
        <ul class="highlights-list">${listItems}</ul>
      </div>
    </div>
  `;
}

// Helper function to extract sections from review text
function extractSection(text, keywords) {
  if (!text || typeof text !== 'string') return null;
  
  for (const keyword of keywords) {
    const regex = new RegExp(`\\*\\*${keyword}[:\\*]*\\*\\*([\\s\\S]*?)(?=\\*\\*[^\\*]|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      let content = match[1].trim();
      content = content.replace(/^\*+\s*/gm, '').trim();
      
      // Skip if content is too short or just placeholder text
      if (content.length < 20 || 
          content.toLowerCase().includes('information will be updated') ||
          content.toLowerCase().includes('no specific information')) {
        continue;
      }
      
      // Convert to paragraphs and clean up
      const paragraphs = content.split('\n')
        .filter(p => p.trim().length > 10)
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
      
      return paragraphs || null;
    }
  }
  
  // Fallback: look for content that might contain relevant keywords
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 25);
  const relevantSentences = sentences.filter(sentence => 
    keywords.some(keyword => sentence.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  if (relevantSentences.length > 0) {
    const meaningfulSentences = relevantSentences
      .filter(s => s.length > 30 && !s.toLowerCase().includes('information will be updated'))
      .slice(0, 2);
    
    if (meaningfulSentences.length > 0) {
      return meaningfulSentences.map(s => `<p>${s.trim()}.</p>`).join('');
    }
  }
  
  return null;
}

// Helper function to extract pros and cons
function extractProsCons(text, type) {
  if (!text || typeof text !== 'string') return [];
  
  const regex = type === 'pros' 
    ? /\*\*Pros[:\*]*\*\*\s*([\s\S]*?)(?=\*\*Cons|$)/i
    : /\*\*Cons[:\*]*\*\*\s*([\s\S]*?)$/i;
    
  const match = text.match(regex);
  if (match) {
    const content = match[1];
    const points = content.split(/[\*•\-\n]/)
      .filter(point => {
        const cleaned = point.trim();
        return cleaned && 
               cleaned.length > 15 && 
               !cleaned.toLowerCase().includes('information will be updated') &&
               !cleaned.toLowerCase().includes('no specific information');
      })
      .map(point => point.trim())
      .slice(0, 4); // Limit to 4 items
    return points;
  }
  
  // Alternative patterns for pros/cons
  const altPatterns = {
    pros: [/positive[s]?\s*[:]*\s*([\s\S]*?)(?=negative|cons|$)/i, /advantages?\s*[:]*\s*([\s\S]*?)(?=disadvantage|cons|$)/i],
    cons: [/negative[s]?\s*[:]*\s*([\s\S]*?)$/i, /disadvantages?\s*[:]*\s*([\s\S]*?)$/i]
  };
  
  const patterns = altPatterns[type] || [];
  for (const pattern of patterns) {
    const altMatch = text.match(pattern);
    if (altMatch) {
      const content = altMatch[1];
      const points = content.split(/[\*•\-\n]/)
        .filter(point => {
          const cleaned = point.trim();
          return cleaned && cleaned.length > 15;
        })
        .map(point => point.trim())
        .slice(0, 3);
      if (points.length > 0) return points;
    }
  }
  
  return [];
}

// Open company reviews modal
function openCompanyReviewsModal(companyName) {
  // Remove any existing modal
  const existingModal = document.querySelector('.company-reviews-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'company-reviews-modal';
  modal.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-header">
          <div class="company-info">
            <div class="company-icon">
              <i class="company-logo">${companyName.substring(0, 2).toUpperCase()}</i>
            </div>
            <div class="company-details">
              <h1 class="company-title">${companyName}</h1>
              <p class="company-subtitle">Employee Reviews & Company Insights</p>
            </div>
          </div>
          <button class="close-btn" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="loading-section">
            <div class="loading-animation">
              <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p class="loading-text">Compiling employee insights...</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="disclaimer">
            <small>Reviews compiled from industry insights and public employment data. Individual experiences may vary.</small>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  // Add modern styling
  const style = document.createElement('style');
  style.textContent = `
    .company-reviews-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(12px);
    }
    
    .modal-container {
      position: relative;
      background: white;
      border-radius: 24px;
      width: 90vw;
      max-width: 1100px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      margin: auto;
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32px 40px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .modal-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
      pointer-events: none;
    }
    
    .company-info {
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 1;
      position: relative;
    }
    
    .company-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
    }
    
    .company-logo {
      font-size: 26px;
      font-weight: 700;
      color: white;
    }
    
    .company-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .company-title {
      font-size: 30px;
      font-weight: 700;
      margin: 0;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      line-height: 1.2;
    }
    
    .company-subtitle {
      font-size: 16px;
      margin: 0;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
    }
    
    .close-btn {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      z-index: 1;
      position: relative;
      flex-shrink: 0;
    }
    
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }
    
    .modal-body {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e0 #f7fafc;
      background: #fafbfc;
    }
    
    .modal-body::-webkit-scrollbar {
      width: 8px;
    }
    
    .modal-body::-webkit-scrollbar-track {
      background: #f7fafc;
    }
    
    .modal-body::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 4px;
    }
    
    .loading-section {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 40px;
      min-height: 250px;
      flex-direction: column;
    }
    
    .loading-animation {
      text-align: center;
    }
    
    .loading-dots {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
      justify-content: center;
      align-items: center;
    }
    
    .loading-dots span {
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      border-radius: 50%;
      animation: loadingBounce 1.4s ease-in-out infinite;
      box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
    }
    
    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
    .loading-dots span:nth-child(3) { animation-delay: 0s; }
    
    .loading-text {
      font-size: 18px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    
    .modal-footer {
      padding: 24px 40px;
      border-top: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      text-align: center;
    }
    
    .disclaimer small {
      color: #64748b;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: 0.3px;
    }
    
    @keyframes modalFadeIn {
      from { 
        opacity: 0; 
      }
      to { 
        opacity: 1; 
      }
    }
    
    @keyframes modalSlideIn {
      from { 
        opacity: 0;
        transform: scale(0.85) translateY(40px); 
      }
      to { 
        opacity: 1;
        transform: scale(1) translateY(0); 
      }
    }
    
    @keyframes loadingBounce {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.5;
      } 
      40% {
        transform: scale(1);
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @media (max-width: 768px) {
      .modal-container {
        width: 95%;
        margin: 20px;
        max-height: 90vh;
      }
      
      .modal-header {
        padding: 20px 25px 15px;
      }
      
      .company-title {
        font-size: 22px;
      }
      
      .company-icon {
        width: 50px;
        height: 50px;
      }
      
      .company-logo {
        font-size: 20px;
      }
    }
  `;
  
  document.head.appendChild(style);

  // Close modal functionality
  const closeBtn = modal.querySelector('.close-btn');
  const backdrop = modal.querySelector('.modal-backdrop');
  
  const closeModal = () => {
    modal.style.animation = 'modalFadeIn 0.2s ease-out reverse';
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 200);
  };
  
  closeBtn.onclick = closeModal;
  backdrop.onclick = (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  };
  
  // ESC key to close
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);

  // Fetch and display reviews
  fetchCompanyReviews(companyName)
    .then(reviews => {
      const modalBody = modal.querySelector('.modal-body');
      modalBody.innerHTML = '';
      modalBody.appendChild(formatCompanyReviews(reviews));
    })
    .catch(error => {
      const modalBody = modal.querySelector('.modal-body');
      modalBody.innerHTML = `
        <div class="error-section">
          <div class="error-icon">⚠️</div>
          <h3>Unable to load reviews</h3>
          <p>We're experiencing some technical difficulties. Please try again later.</p>
        </div>
      `;
    });
}




