// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeSwitch = document.getElementById('theme-switch');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeSwitch.checked = savedTheme === 'dark';
    
    themeSwitch.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
    
    // Calculator
    const calculatorElements = {
        area: document.getElementById('area'),
        areaValue: document.getElementById('area-value'),
        type: document.getElementById('type'),
        rooms: document.getElementById('rooms'),
        terrace: document.getElementById('terrace'),
        windows: document.getElementById('windows'),
        finish: document.getElementById('finish'),
        electric: document.getElementById('electric'),
        totalPrice: document.getElementById('total-price'),
        basePrice: document.getElementById('base-price'),
        optionsPrice: document.getElementById('options-price')
    };
    
    const config = {
        basePrice: {
            base: 25000,
            warm: 35000,
            premium: 50000
        },
        roomMultiplier: {
            1: 1,
            2: 1.1,
            3: 1.25,
            '4': 1.4
        }
    };
    
    function calculatePrice() {
        const area = parseInt(calculatorElements.area.value);
        const type = calculatorElements.type.value;
        const rooms = calculatorElements.rooms.value;
        
        // Base price
        let base = area * config.basePrice[type] * config.roomMultiplier[rooms];
        
        // Options
        let options = 0;
        [calculatorElements.terrace, calculatorElements.windows, 
         calculatorElements.finish, calculatorElements.electric].forEach(el => {
            if (el.checked) {
                options += parseInt(el.value);
            }
        });
        
        const total = base + options;
        
        calculatorElements.areaValue.textContent = `${area} м²`;
        calculatorElements.basePrice.textContent = formatPrice(base);
        calculatorElements.optionsPrice.textContent = formatPrice(options);
        calculatorElements.totalPrice.textContent = formatPrice(total);
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }
    
    // Calculator event listeners
    calculatorElements.area.addEventListener('input', calculatePrice);
    calculatorElements.type.addEventListener('change', calculatePrice);
    calculatorElements.rooms.addEventListener('change', calculatePrice);
    [calculatorElements.terrace, calculatorElements.windows, 
     calculatorElements.finish, calculatorElements.electric].forEach(el => {
        el.addEventListener('change', calculatePrice);
    });
    
    // Initial calculation
    calculatePrice();
    
    // Order form
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
        closeOrderForm();
        orderForm.reset();
    });
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ Заявка отправлена! Ожидайте звонок.');
        this.reset();
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.style.animationPlayState = 'running';
            }
        });
    });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Mobile menu (simplified)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
});

// Utility functions
function openCalculator(area = 30) {
    document.getElementById('area').value = area;
    document.getElementById('area-value').textContent = `${area} м²`;
    document.querySelector(`#calculator`).scrollIntoView({ behavior: 'smooth' });
    calculatePrice(); // Recalculate
}

function showOrderForm() {
    document.getElementById('orderModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeOrderForm() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderForm();
    }
}

// Phone input mask (simplified)
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('8')) value = '7' + value.slice(1);
        if (value.startsWith('7')) {
            value = '+7 (' + value.slice(1,4) + ') ' + 
                   value.slice(4,7) + '-' + 
                   value.slice(7,9) + '-' + 
                   value.slice(9,11);
        }
        e.target.value = value;
    });
});