// Toggle between dark and light themes
function toggleTheme() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;

    themeToggleButton.addEventListener('change', () => {
        if (themeToggleButton.checked) {
            rootElement.classList.add('dark-theme');
            rootElement.classList.remove('light-theme');
        } else {
            rootElement.classList.remove('dark-theme');
            rootElement.classList.add('light-theme');
        }
        // Save the preference to localStorage
        localStorage.setItem('theme', themeToggleButton.checked ? 'dark' : 'light');
    });

    // Check for saved user preferences, if any, on load of the website
    if (localStorage.getItem('theme') === 'light') {
        rootElement.classList.remove('dark-theme');
        rootElement.classList.add('light-theme');
        themeToggleButton.checked = false;
    }
}

// Initialize theme toggle functionality once DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    toggleTheme();
});
