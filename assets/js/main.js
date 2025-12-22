document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeLabel = toggleBtn.querySelector('.theme-label');
    
    // Theme Config
    const THEME_A = 'warm-academic';
    const THEME_B = 'cool-industrial';
    
    // Load stored theme or default
    const currentTheme = localStorage.getItem('saga-theme') || THEME_A;
    setTheme(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === THEME_A ? THEME_B : THEME_A;
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('saga-theme', theme);
        
        // Update Button Text (Optional UX enhancement)
        if (theme === THEME_A) {
            themeLabel.textContent = "Switch to Cool";
        } else {
            themeLabel.textContent = "Switch to Warm";
        }
    }
});
