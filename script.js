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
            <button class="button company-reviews">Company Reviews</button>
            <button class="button apply-now">Apply Now</button>
        </div>
          `;
  
          outputDiv.appendChild(jobCard);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  
