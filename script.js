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


const GEMINI_API_KEY = 'AIzaSyDFe-vQXZpD7PlfDUuGiZb3qSruwsbFN1g';

async function fetchCompanyReviews(companyName) {
  const prompt = `Provide a comprehensive overview of ${companyName}'s company culture, employee satisfaction, and workplace environment. Include pros and cons, typical employee experiences, and general reputation in the industry.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
          maxOutputTokens: 1024,
          temperature: 0.7,
          topP: 1
        }
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error fetching company reviews:', error);
    return 'Unable to fetch company reviews at this time.';
  }
}

// Format company reviews with enhanced styling
function formatCompanyReviews(reviewText) {
  // Create a container for formatted reviews
  const formattedReviews = document.createElement('div');
  formattedReviews.className = 'company-reviews-content';

  // Custom styling for the reviews
  const style = document.createElement('style');
  style.textContent = `
    .company-reviews-content {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
    }
    .review-section {
        margin-bottom: 20px;
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
    }
    .review-section h3 {
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    .review-content {
        text-align: left;
    }
    .review-list {
        list-style-type: disc;
        padding-left: 20px;
    }
`;
  formattedReviews.appendChild(style);

  // Sections to parse
  const sections = [
    'Company Culture',
    'Employee Satisfaction',
    'Workplace Environment',
    'Typical Employee Experiences',
    'General Reputation in the Industry'
  ];

  // Create sections dynamically
  sections.forEach(sectionTitle => {
    // Create section div
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'review-section';

    // Add section title
    const titleElement = document.createElement('h3');
    titleElement.textContent = sectionTitle;
    sectionDiv.appendChild(titleElement);

    // Create content div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'review-content';

    // Try to extract content for this section
    const sectionRegex = new RegExp(`\\*\\*${sectionTitle}\\*\\*([\\s\\S]*?)(?=\\*\\*[A-Za-z]|$)`, 'i');
    const sectionMatch = reviewText.match(sectionRegex);

    if (sectionMatch) {
      let sectionContent = sectionMatch[1].trim();

      // Convert to list if multiple points
      if (sectionContent.includes('***')) {
        const ul = document.createElement('ul');
        ul.className = 'review-list';

        // Split by *** and create list items
        const points = sectionContent.split('***')
          .filter(point => point.trim())
          .map(point => point.trim());

        points.forEach(point => {
          const li = document.createElement('li');
          li.textContent = point;
          ul.appendChild(li);
        });

        contentDiv.appendChild(ul);
      } else {
        // If no list, just add as paragraph
        const p = document.createElement('p');
        p.textContent = sectionContent;
        contentDiv.appendChild(p);
      }
    } else {
      // If no content found, add a default message
      const p = document.createElement('p');
      p.textContent = 'No specific information available for this section.';
      contentDiv.appendChild(p);
    }

    // Add content to section
    sectionDiv.appendChild(contentDiv);

    // Add section to main container
    formattedReviews.appendChild(sectionDiv);
  });

  // Pros and Cons section
  const prosConsMatch = reviewText.match(/\*\*Pros and Cons\*\*\s*\*\*Pros:\*\*\s*([\s\S]*?)\s*\*\*Cons:\*\*\s*([\s\S]*)/);

  if (prosConsMatch) {
    const prosConsDiv = document.createElement('div');
    prosConsDiv.className = 'review-section';
    prosConsDiv.innerHTML = `
        <h3>Pros and Cons</h3>
        <div class="review-content">
            <h4>Pros:</h4>
            <ul class="review-list">
                ${prosConsMatch[1].split('*')
        .filter(pro => pro.trim())
        .map(pro => `<li>${pro.trim()}</li>`)
        .join('')}
            </ul>
            <h4>Cons:</h4>
            <ul class="review-list">
                ${prosConsMatch[2].split('*')
        .filter(con => con.trim())
        .map(con => `<li>${con.trim()}</li>`)
        .join('')}
            </ul>
        </div>
    `;
    formattedReviews.appendChild(prosConsDiv);
  }

  return formattedReviews;
}

// Open company reviews modal
function openCompanyReviewsModal(companyName) {
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'company-reviews-modal';
  modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Company Reviews for ${companyName}</h2>
        <div class="reviews-loading">
            <p>Fetching company reviews...</p>
            <div class="loading-spinner"></div>
        </div>
    </div>
`;
  document.body.appendChild(modal);

  // Add styling
  const style = document.createElement('style');
  style.textContent = `
    .company-reviews-modal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        background-color: #fefefe;
        padding: 20px;
        border-radius: 10px;
        width: 80%;
        max-width: 600px;
        max-height: 70%;
        overflow-y: auto;
        position: relative;
    }
    .close-modal {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    .reviews-loading {
        text-align: center;
        padding: 20px;
    }
    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
  document.head.appendChild(style);

  // Close modal functionality
  const closeModal = modal.querySelector('.close-modal');
  closeModal.onclick = () => document.body.removeChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };

  // Fetch and display reviews
  fetchCompanyReviews(companyName)
    .then(reviews => {
      const reviewsContainer = modal.querySelector('.reviews-loading');
      reviewsContainer.innerHTML = '';
      reviewsContainer.appendChild(formatCompanyReviews(reviews));
    })
    .catch(error => {
      const reviewsContainer = modal.querySelector('.reviews-loading');
      reviewsContainer.innerHTML = `
            <p>Error fetching company reviews: ${error.message}</p>
        `;
    });
}




