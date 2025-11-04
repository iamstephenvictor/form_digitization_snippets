Qualtrics.SurveyEngine.addOnload(function () {
    var that = this;
    var questionId = this.questionId;

    // === EXPANDABLE CONTENT FUNCTIONALITY ===
    function initializeExpandables() {
        // Find the question container
        var questionContainer = document.querySelector(
            "[id*='" + questionId + "']"
        );
        if (!questionContainer) return;

        // Find all expandable headers in this question
        var headers = questionContainer.querySelectorAll(".expandable-header");

        headers.forEach(function (header) {
            // Remove any existing listeners to prevent duplicates
            var newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            // Add click listener
            newHeader.addEventListener("click", function () {
                var targetId = this.getAttribute("data-target");
                var content = questionContainer.querySelector("#" + targetId);
                var icon = this.querySelector(".expand-icon");

                if (content) {
                    if (
                        content.style.display === "none" ||
                        content.style.display === ""
                    ) {
                        // Expand
                        content.style.display = "block";
                        content.classList.add("show");
                        icon.classList.add("expanded");
                        icon.textContent = "▼";
                    } else {
                        // Collapse
                        content.classList.remove("show");
                        setTimeout(function () {
                            content.style.display = "none";
                        }, 300);
                        icon.classList.remove("expanded");
                        icon.textContent = "▶";
                    }
                }
            });
        });
    }

    // === FLATPICKR DATE FUNCTIONALITY ===
    function initializeDatePicker() {
        // Wait for DOM to be ready
        setTimeout(function () {
            // Try multiple selector methods
            var selectors = [
                "[id*='" + questionId + "'] input[type=text]",
                "#QR\\~" + questionId + " input[type=text]",
                "#QR\\~" + questionId + " input.InputText",
                "#QID" + questionId.replace("QID", "") + " input[type=text]",
                "input[id*='" + questionId + "']",
            ];

            var inputElement = null;

            for (var i = 0; i < selectors.length; i++) {
                inputElement = document.querySelector(selectors[i]);
                if (inputElement) {
                    break;
                }
            }

            if (!inputElement) {
                console.warn("Date picker: Could not find input element");
                return;
            }

            // Check if already initialized
            if (inputElement.classList.contains("flatpickr-input")) {
                return;
            }

            try {
                var fp = flatpickr(inputElement, {
                    mode: "single",
                    dateFormat: "Y-m-d",
                    allowInput: true,
                    altInput: true,
                    altFormat: "F j, Y",

                    onChange: function (selectedDates, dateStr, instance) {
                        if (selectedDates.length === 1) {
                            var dateOfRemoval = selectedDates[0];
                            // Use the new API method
                            Qualtrics.SurveyEngine.setJSEmbeddedData(
                                "DateDeterminationIsMade",
                                dateStr
                            );
                        }
                    },
                });

                inputElement.placeholder = "Click to select date";
            } catch (error) {
                console.error("Error initializing date picker:", error);
                // Fallback to HTML5 date input
                inputElement.type = "date";
                inputElement.addEventListener("change", function (e) {
                    Qualtrics.SurveyEngine.setJSEmbeddedData(
                        "DateDeterminationIsMade",
                        e.target.value
                    );
                });
            }
        }, 500);
    }

    // Initialize expandables immediately
    initializeExpandables();

    // Check if Flatpickr is available
    if (typeof flatpickr !== "undefined") {
        initializeDatePicker();
    } else {
        // Load Flatpickr for question preview mode
        if (!document.querySelector('link[href*="flatpickr"]')) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href =
                "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
            document.head.appendChild(link);
        }

        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
        script.async = false;
        document.head.appendChild(script);

        script.onload = function () {
            initializeDatePicker();
        };

        script.onerror = function () {
            console.error("Failed to load Flatpickr from CDN");
            // Fallback to HTML5
            setTimeout(function () {
                var input = document.querySelector(
                    "[id*='" + questionId + "'] input[type=text]"
                );
                if (input) {
                    input.type = "date";
                    input.addEventListener("change", function (e) {
                        Qualtrics.SurveyEngine.setJSEmbeddedData(
                            "DateDeterminationIsMade",
                            e.target.value
                        );
                    });
                }
            }, 500);
        };
    }
});

// Ensure expandables work even if DOM wasn't ready earlier
Qualtrics.SurveyEngine.addOnReady(function () {
    var questionId = this.questionId;
    var questionContainer = document.querySelector(
        "[id*='" + questionId + "']"
    );

    if (questionContainer) {
        // Check if expandables are properly initialized
        var headers = questionContainer.querySelectorAll(".expandable-header");
        headers.forEach(function (header) {
            if (!header.onclick && !header.hasAttribute("data-initialized")) {
                header.setAttribute("data-initialized", "true");
                header.style.cursor = "pointer";
            }
        });
    }
});
