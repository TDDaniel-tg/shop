document.addEventListener('DOMContentLoaded', function() {
    // API Base URL
    const API_URL = 'http://localhost:5000/api';

    // Mobile menu toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const headerActions = document.querySelector('.header__actions');

    if (burger) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('nav--active');
            headerActions.classList.toggle('header__actions--active');
            burger.classList.toggle('burger--active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Video gallery functionality
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        const video = card.querySelector('.video-card__video');
        const playBtn = card.querySelector('.video-card__play');
        
        // Play video on hover
        card.addEventListener('mouseenter', () => {
            video.play();
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
        
        // Play/pause on click
        card.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playBtn.style.display = 'none';
            } else {
                video.pause();
                playBtn.style.display = 'block';
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.advantage, .video-card, .category-card').forEach(el => {
        observer.observe(el);
    });

    // Calculator functionality
    const calculatorForm = document.getElementById('calculatorForm');
    if (calculatorForm) {
        const inputs = calculatorForm.querySelectorAll('input, select');
        const priceDisplay = document.querySelector('.calculator__price-value');
        
        const calculatePrice = () => {
            const formData = new FormData(calculatorForm);
            const type = formData.get('type');
            const fabric = formData.get('fabric');
            const quantity = parseInt(formData.get('quantity')) || 50;
            const customization = formData.get('customization');
            
            // Simple price calculation
            let basePrice = 500;
            
            // Fabric modifiers
            if (fabric === 'cotton') basePrice *= 1.1;
            if (fabric === 'viscose') basePrice *= 1.2;
            
            // Customization
            let customizationPrice = 0;
            if (customization === 'printing') customizationPrice = 50;
            if (customization === 'embroidery') customizationPrice = 100;
            
            // Quantity discounts
            if (quantity >= 1000) basePrice *= 0.7;
            else if (quantity >= 500) basePrice *= 0.8;
            else if (quantity >= 100) basePrice *= 0.9;
            
            const totalPrice = (basePrice + customizationPrice) * quantity;
            priceDisplay.textContent = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0
            }).format(totalPrice);
        };
        
        inputs.forEach(input => {
            input.addEventListener('change', calculatePrice);
            input.addEventListener('input', calculatePrice);
        });
        
        // Initial calculation
        calculatePrice();
        
        // Form submission
        calculatorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(calculatorForm);
            const data = {
                type: 'price_request',
                customer: {
                    name: 'Не указано',
                    email: 'calculator@rubolka.ru',
                    phone: '+7 000 000-00-00'
                },
                products: [{
                    quantity: formData.get('quantity'),
                    customization: {
                        type: formData.get('customization')
                    }
                }],
                message: `Калькулятор: ${formData.get('type')}, ${formData.get('fabric')}, ${formData.get('quantity')} шт.`
            };
            
            try {
                // Show loading state
                const submitBtn = calculatorForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                    calculatorForm.reset();
                    calculatePrice();
                } else {
                    throw new Error('Ошибка отправки');
                }
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } catch (error) {
                console.error('Error submitting calculator:', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
            }
        });
    }

    // Hero form submission
    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        heroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(heroForm);
            const data = {
                type: 'catalog_request',
                customer: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                message: 'Запрос каталога с главной страницы'
            };
            
            try {
                const submitBtn = heroForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Спасибо за заявку! Мы отправим каталог на указанный email.');
                    heroForm.reset();
                } else {
                    throw new Error('Ошибка отправки');
                }
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
            }
        });
    }

    // Catalog button click
    document.querySelectorAll('.header__btn, .catalog__cta .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const heroForm = document.getElementById('heroForm');
            if (heroForm) {
                heroForm.scrollIntoView({ behavior: 'smooth' });
                heroForm.querySelector('input[name="name"]').focus();
            }
        });
    });

    // Add animation classes
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav--active,
        .header__actions--active {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .burger--active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .burger--active span:nth-child(2) {
            opacity: 0;
        }
        
        .burger--active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Phone number formatting
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7') value = value.substring(1);
                value = value.substring(0, 10);
                
                let formatted = '+7';
                if (value.length > 0) formatted += ' (' + value.substring(0, 3);
                if (value.length > 3) formatted += ') ' + value.substring(3, 6);
                if (value.length > 6) formatted += '-' + value.substring(6, 8);
                if (value.length > 8) formatted += '-' + value.substring(8, 10);
                
                e.target.value = formatted;
            }
        });
    });

    // Add analytics tracking for floating buttons
    document.querySelectorAll('.floating-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.classList.contains('floating-btn--whatsapp') ? 'WhatsApp' : 'Telegram';
            console.log(`Floating button clicked: ${type}`);
            // Here you can add Google Analytics or Yandex Metrika tracking
        });
    });
});