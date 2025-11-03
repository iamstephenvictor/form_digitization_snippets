// using select2 library to add multiple dropdown functionality in a single text input question and store in embedded data variables

Qualtrics.SurveyEngine.addOnReady(function() {
    // Define the date arrays with display and value pairs
    var startDates = [
        {display: '10/01/2024', value: '2024-10-01'},
        {display: '04/01/2025', value: '2025-04-01'},
        {display: '10/01/2025', value: '2025-10-01'},
        {display: '04/01/2026', value: '2026-04-01'},
        {display: '10/01/2026', value: '2026-10-01'},
        {display: '04/01/2027', value: '2027-04-01'},
        {display: '10/01/2027', value: '2027-10-01'},
        {display: '04/01/2028', value: '2028-04-01'}
    ];
    
    var endDates = [
        {display: '03/31/2025', value: '2025-03-31'},
        {display: '09/30/2025', value: '2025-09-30'},
        {display: '03/31/2026', value: '2026-03-31'},
        {display: '09/30/2026', value: '2026-09-30'},
        {display: '03/31/2027', value: '2027-03-31'},
        {display: '09/30/2027', value: '2027-09-30'},
        {display: '03/31/2028', value: '2028-03-31'},
        {display: '09/30/2028', value: '2028-09-30'}
    ];
    
    // Use the question container to ensure we're in the right scope
    var qContainer = this.getQuestionContainer();
    
    // Get the select elements using vanilla JavaScript first
    var startSelect = qContainer.querySelector('#pur-start-date');
    var endSelect = qContainer.querySelector('#pur-end-date');
    
    // Clear existing options except the first placeholder
    while (startSelect.options.length > 1) {
        startSelect.remove(1);
    }
    while (endSelect.options.length > 1) {
        endSelect.remove(1);
    }
    
    // Populate start date dropdown
    startDates.forEach(function(dateObj) {
        var option = document.createElement('option');
        option.value = dateObj.value;  // ISO format for storage
        option.text = dateObj.display;  // Friendly format for display
        startSelect.appendChild(option);
    });
    
    // Populate end date dropdown
    endDates.forEach(function(dateObj) {
        var option = document.createElement('option');
        option.value = dateObj.value;  // ISO format for storage
        option.text = dateObj.display;  // Friendly format for display
        endSelect.appendChild(option);
    });
    
    // Initialize Select2 if available
    if (window.jQuery && window.jQuery.fn.select2) {
        jQuery(startSelect).select2({
            placeholder: "Select a start date",
            allowClear: true,
            width: '100%'
        });
        
        jQuery(endSelect).select2({
            placeholder: "Select an end date",
            allowClear: true,
            width: '100%'
        });
    }
    
    // Store values in embedded data when changed
    startSelect.addEventListener('change', function() {
        Qualtrics.SurveyEngine.setEmbeddedData('PURStartDate', this.value);
        console.log('PURStartDate set to:', this.value);  // Will show ISO format
    });
    
    endSelect.addEventListener('change', function() {
        Qualtrics.SurveyEngine.setEmbeddedData('PUREndDate', this.value);
        console.log('PUREndDate set to:', this.value);  // Will show ISO format
    });
    
    // Debug: Log to console to verify the code is running
    console.log('Dropdowns initialized');
    console.log('Start dates count:', startSelect.options.length);
    console.log('End dates count:', endSelect.options.length);
});