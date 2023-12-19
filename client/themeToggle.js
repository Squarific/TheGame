// This script is responsible for toggling between light and dark themes with their respective emoji.
document.addEventListener('DOMContentLoaded', function() {
    var checkbox = document.getElementById('theme-toggle');
    var htmlElement = document.documentElement; // This should be the root HTML element.

    checkbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            htmlElement.classList.add('dark-theme');
            htmlElement.classList.remove('light-theme');
        } else {
            htmlElement.classList.add('light-theme');
            htmlElement.classList.remove('dark-theme');
        }
    });

    // Set initial theme mode based on the checkbox checked property
    if (checkbox.checked) {
        htmlElement.classList.add('dark-theme');
    } else {
        htmlElement.classList.add('light-theme');
    }
});
