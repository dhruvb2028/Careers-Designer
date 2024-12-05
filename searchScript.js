document.addEventListener('DOMContentLoaded', () => {
    const jobSearchForm = document.getElementById('job-search-form');
    const skillsInput = document.getElementById('skills-input');
    const locationInput = document.getElementById('location-input');
    const viewJobLinks = document.querySelectorAll('.view-jobs');

    // Handle job search form submission
    jobSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const skills = skillsInput.value;
        const location = locationInput.value;

        // Redirect to search results page with query parameters
        window.location.href = `searchResults.htm?query=${encodeURIComponent(skills)}&location=${encodeURIComponent(location)}`;
    });

    // Add a click event listener to each link
    viewJobLinks.forEach(link => {
        link.addEventListener('click', event => {
            // Prevent the default link behavior
            event.preventDefault();

            // Find the nearest <h3> tag relative to the clicked link
            const categoryHeading = link.closest('.category').querySelector('h3');

            // Get the text content of the <h3> tag
            const categoryText = categoryHeading.textContent;

            window.location.href = `jobCategoriesResults.htm?query=${encodeURIComponent(categoryText)}`;
        });
    });
});
