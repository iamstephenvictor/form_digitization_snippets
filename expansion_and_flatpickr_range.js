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

    // === FLATPICKR DATE RANGE FUNCTIONALITY ===
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
                    mode: "range", // Changed to range mode
                    dateFormat: "Y-m-d",
                    allowInput: true,
                    altInput: true,
                    altFormat: "F j, Y",

                    onChange: function (selectedDates, dateStr, instance) {
                        // Store the full range string (e.g., "2024-01-01 to 2024-01-31")
                        Qualtrics.SurveyEngine.setJSEmbeddedData(
                            "DatesOfAccreditationRange",
                            dateStr
                        );

                        // Store start and end dates separately when both are selected
                        if (selectedDates.length === 2) {
                            var startDate = selectedDates[0]
                                .toISOString()
                                .split("T")[0];
                            var endDate = selectedDates[1]
                                .toISOString()
                                .split("T")[0];

                            Qualtrics.SurveyEngine.setJSEmbeddedData(
                                "DatesOfAccreditationStart",
                                startDate
                            );
                            Qualtrics.SurveyEngine.setJSEmbeddedData(
                                "DatesOfAccreditationEnd",
                                endDate
                            );

                            // Optional: Calculate days in range
                            var daysDiff =
                                Math.floor(
                                    (selectedDates[1] - selectedDates[0]) /
                                        (1000 * 60 * 60 * 24)
                                ) + 1;
                            Qualtrics.SurveyEngine.setJSEmbeddedData(
                                "DatesOfAccreditationDays",
                                daysDiff
                            );
                        }
                    },
                });

                inputElement.placeholder = "Select date range";
            } catch (error) {
                console.error("Error initializing date picker:", error);
                // Fallback to HTML5 date input
                inputElement.type = "date";
                inputElement.addEventListener("change", function (e) {
                    Qualtrics.SurveyEngine.setJSEmbeddedData(
                        "DatesOfAccreditationRange",
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
            // Fallback to HTML5 (note: HTML5 doesn't have native range support)
            setTimeout(function () {
                var input = document.querySelector(
                    "[id*='" + questionId + "'] input[type=text]"
                );
                if (input) {
                    input.placeholder = "Enter start date - end date";
                    input.addEventListener("change", function (e) {
                        // Try to parse a manually entered range
                        var value = e.target.value;
                        if (value.includes(" - ") || value.includes(" to ")) {
                            var parts = value.split(/\s*(-|to)\s*/);
                            if (parts.length >= 3) {
                                Qualtrics.SurveyEngine.setJSEmbeddedData(
                                    "DatesOfAccreditationStart",
                                    parts[0]
                                );
                                Qualtrics.SurveyEngine.setJSEmbeddedData(
                                    "DatesOfAccreditationEnd",
                                    parts[2]
                                );
                            }
                        }
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
