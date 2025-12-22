document.addEventListener('DOMContentLoaded', () => {
    const htmlEl = document.documentElement;

    // ============================
    // THEME LOGIC (Warm vs Cool)
    // ============================
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = themeBtn.querySelector('.theme-icon-sun');
    const snowIcon = themeBtn.querySelector('.theme-icon-snow');

    const THEME_WARM = 'warm-academic';
    const THEME_COOL = 'cool-industrial';

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('saga-theme', theme);
        updateThemeIcons(theme);
    }

    function updateThemeIcons(theme) {
        if (theme === THEME_WARM) {
            sunIcon.style.display = 'block';
            snowIcon.style.display = 'none';
            themeBtn.setAttribute('aria-label', 'Switch to Cool Mode');
        } else {
            sunIcon.style.display = 'none';
            snowIcon.style.display = 'block';
            themeBtn.setAttribute('aria-label', 'Switch to Warm Mode');
        }
    }

    // Initialize Theme
    const savedTheme = localStorage.getItem('saga-theme') || THEME_WARM;
    setTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === THEME_WARM ? THEME_COOL : THEME_WARM;
        setTheme(next);
    });

    // ============================
    // FONT LOGIC (Serif vs Sans)
    // ============================
    const fontBtn = document.getElementById('font-toggle');
    const FONT_SERIF = 'serif';
    const FONT_SANS = 'sans';

    function setFont(font) {
        htmlEl.setAttribute('data-font', font);
        localStorage.setItem('saga-font', font);

        // Optional: Update aria-label
        fontBtn.setAttribute('aria-label', font === FONT_SERIF ? 'Switch to Sans-Serif Font' : 'Switch to Serif Font');
    }

    // Initialize Font
    const savedFont = localStorage.getItem('saga-font') || FONT_SERIF;
    setFont(savedFont);

    fontBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-font');
        const next = current === FONT_SERIF ? FONT_SANS : FONT_SERIF;
        setFont(next);
    });
});
