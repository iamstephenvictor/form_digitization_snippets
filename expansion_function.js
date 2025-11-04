Qualtrics.SurveyEngine.addOnload(function() {
    var questionId = this.questionId;
    
    function initializeExpandables() {
        var questionContainer = document.querySelector("[id*='" + questionId + "']");
        if (!questionContainer) return;
        
        var headers = questionContainer.querySelectorAll('.expandable-header');
        
        headers.forEach(function(header) {
            // Remove any existing listeners
            var newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            newHeader.addEventListener('click', function() {
                var targetId = this.getAttribute('data-target');
                var content = questionContainer.querySelector('#' + targetId);
                var icon = this.querySelector('.expand-icon');
                
                if (content) {
                    if (content.style.display === 'none' || content.style.display === '') {
                        content.style.display = 'block';
                        content.classList.add('show');
                        icon.classList.add('expanded');
                        icon.textContent = '▼';
                    } else {
                        content.classList.remove('show');
                        setTimeout(function() {
                            content.style.display = 'none';
                        }, 300);
                        icon.classList.remove('expanded');
                        icon.textContent = '▶';
                    }
                }
            });
        });
    }
    
    initializeExpandables();
});