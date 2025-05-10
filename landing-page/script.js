// Tab functionality for the installation section
document.addEventListener('DOMContentLoaded', () => {
    // Installation tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const animateOnScroll = () => {
        featureCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardBottom = card.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight - 100 && cardBottom > 0) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for feature cards
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run once on page load
    animateOnScroll();

    // Add syntax highlighting style to code blocks
    document.querySelectorAll('.code-snippet code').forEach(block => {
        // Simple syntax highlighting for keywords
        const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 
                         'return', 'if', 'else', 'for', 'while', 'class', 'extends',
                         'module.exports', 'require', 'enabled', 'plugins', 'presets'];
        
        const operators = ['=>', ':', '=', '+', '-', '*', '/', '[', ']', '{', '}', '(', ')', ',', ';'];
        
        const strings = ['"', "'", '`'];
        
        let html = block.innerHTML;
        
        // Highlight keywords
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span style="color: #ff79c6;">${keyword}</span>`);
        });
        
        // Highlight strings - simplified approach
        html = html.replace(/(["'`])(.*?)\1/g, '<span style="color: #f1fa8c;">$&</span>');
        
        // Highlight comments
        html = html.replace(/(\/\/.*)/g, '<span style="color: #6272a4;">$1</span>');
        
        block.innerHTML = html;
    });
}); 