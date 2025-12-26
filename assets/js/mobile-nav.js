document.addEventListener('DOMContentLoaded', () => {
    // Only active on mobile or small screens, but the script runs always. 
    // We can rely on CSS to handle display, but JS toggle is needed.

    // Select all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');

        if (link) {
            link.addEventListener('click', (e) => {
                // Check if we are in mobile view by checking visibility of mobile text
                // or simply check window width, or rely on CSS state.
                // A robust way to check if "mobile mode" is active:
                const mobileText = link.querySelector('.mobile-text');
                const isMobile = window.getComputedStyle(mobileText).display !== 'none';

                if (isMobile) {
                    e.preventDefault(); // Prevent default link behavior on mobile

                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });

                    // Toggle current
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Auto-highlight active link
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.dropdown-content a, .site-header .nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath && currentPath !== '') {
            link.classList.add('active');
            // If it's a dropdown item, also highlight the parent
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('.nav-link');
                if (parentLink) parentLink.classList.add('active');
            }
        }
    });
});
