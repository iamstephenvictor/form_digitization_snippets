// Load Flatpickr if not already loaded
if (typeof flatpickr === "undefined") {
    // Flatpickr CSS
    var flatpickrCSS = document.createElement("link");
    flatpickrCSS.rel = "stylesheet";
    flatpickrCSS.href =
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
    document.head.appendChild(flatpickrCSS);

    // Flatpickr JS
    var flatpickrJS = document.createElement("script");
    flatpickrJS.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    flatpickrJS.async = false;
    document.head.appendChild(flatpickrJS);

    flatpickrJS.onload = function () {
        window.flatpickrLoaded = true;
        console.log("Flatpickr loaded successfully");
    };
}

// Load jQuery if not already loaded (required for Select2)
if (typeof jQuery === "undefined") {
    var jqueryJS = document.createElement("script");
    jqueryJS.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jqueryJS.async = false;
    document.head.appendChild(jqueryJS);

    jqueryJS.onload = function () {
        loadSelect2();
    };
} else {
    loadSelect2();
}

// Function to load Select2 after jQuery is available
function loadSelect2() {
    if (typeof jQuery !== "undefined" && !jQuery.fn.select2) {
        // Select2 CSS
        var select2CSS = document.createElement("link");
        select2CSS.rel = "stylesheet";
        select2CSS.href =
            "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css";
        document.head.appendChild(select2CSS);

        // Select2 JS
        var select2JS = document.createElement("script");
        select2JS.src =
            "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js";
        select2JS.async = false;
        document.head.appendChild(select2JS);

        select2JS.onload = function () {
            window.select2Loaded = true;
            console.log("Select2 loaded successfully");
        };
    }
}

// Optional: Set a flag when both libraries are ready
window.checkLibrariesLoaded = function () {
    return {
        flatpickr: typeof flatpickr !== "undefined",
        select2:
            typeof jQuery !== "undefined" && jQuery.fn && jQuery.fn.select2,
        jquery: typeof jQuery !== "undefined",
    };
};
