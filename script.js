document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    const navLinks = document.querySelectorAll('nav ul li a');
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    const promoPopup = document.getElementById('promoPopup');
    const closePromoPopupButtons = document.querySelectorAll('.popup-close');
    const popupOrderBtn = document.getElementById('popupOrderBtn');
    const orderInquiryPopup = document.getElementById('orderInquiryPopup');
    const showOrderPopupBtn = document.getElementById('showOrderPopupBtn');
    const orderInquiryForm = document.getElementById('orderInquiryForm');
    const currentYearSpan = document.getElementById('currentYear');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const welcomePopup = document.getElementById('welcomePopup');
    const closeWelcomePopup = document.getElementById('closeWelcomePopup');

    // Smooth scrolling & Active Nav Link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = header.offsetHeight;
                    let elementPosition = targetElement.getBoundingClientRect().top;
                    let offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active state after scroll completes
                    setTimeout(() => {
                        navLinks.forEach(nav => nav.classList.remove('active'));
                        this.classList.add('active');
                    }, 1000); // Wait for smooth scroll to complete
                }
            }

            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Header scroll effect & Active link highlighting
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Clear the previous timeout
        clearTimeout(scrollTimeout);
        
        // Set a new timeout
        scrollTimeout = setTimeout(function() {
            let currentSectionId = '';
            const sections = document.querySelectorAll('section[id]');
            const headerHeight = header.offsetHeight;
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if we're at the bottom of the page
            if (scrollPosition + windowHeight >= documentHeight - 100) {
                currentSectionId = 'contact';
            } else {
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top + scrollPosition;
                    const sectionBottom = sectionTop + rect.height;
                    
                    // Check if the section is in view
                    if (scrollPosition >= sectionTop - headerHeight && scrollPosition < sectionBottom - headerHeight) {
                        currentSectionId = section.getAttribute('id');
                    }
                });
            }

            // Special case for hero section
            const heroSection = document.querySelector('#hero');
            if (heroSection) {
                const heroRect = heroSection.getBoundingClientRect();
                if (scrollPosition < heroRect.bottom - headerHeight) {
                    currentSectionId = 'hero';
                }
            }

            // Update active state
            if (currentSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === currentSectionId) {
                        link.classList.add('active');
                    }
                });
            }
        }, 100); // Add a small delay to ensure smooth scroll completes
    });

    // Mobile menu toggle
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
            const isExpanded = navUl.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded.toString());
            if (isExpanded) {
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Generic Pop-up Close Logic
    closePromoPopupButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.popup-overlay').classList.remove('active');
        });
    });
    
    // Promo Pop-up Logic
    if (promoPopup) {
        setTimeout(() => {
            promoPopup.classList.add('active');
        }, 1500);

        if (popupOrderBtn) {
            popupOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                promoPopup.classList.remove('active');
                const menuSection = document.querySelector('#menu');
                if (menuSection) {
                     const headerOffset = header.offsetHeight;
                     const elementPosition = menuSection.getBoundingClientRect().top;
                     const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                     window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        }

        // Close popup when clicking outside
        promoPopup.addEventListener('click', function(e) {
            if (e.target === promoPopup) {
                promoPopup.classList.remove('active');
            }
        });

        // Close popup when clicking close button
        document.getElementById('closePromoPopup').addEventListener('click', function() {
            promoPopup.classList.remove('active');
        });
    }

    // Order Inquiry Pop-up Logic
    const orderInquiryBtn = document.getElementById('orderInquiryBtn');
    if (orderInquiryPopup && orderInquiryBtn) {
        orderInquiryBtn.addEventListener('click', () => {
            orderInquiryPopup.classList.add('active');
            if(orderInquiryForm) orderInquiryForm.elements['name'].focus();
        });

        orderInquiryPopup.addEventListener('click', function(e) {
            if (e.target === orderInquiryPopup) {
                orderInquiryPopup.classList.remove('active');
            }
        });

        if (orderInquiryForm) {
            orderInquiryForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = this.elements['name'].value;
                const phone = this.elements['phone'].value;
                const message = this.elements['message'].value;
                
                const whatsappNumber = "923334258221";
                const whatsappMessage = `Assalam-o-Alaikum CACAO Pakistan,\n\nMy Name: ${name}\nMy Phone: ${phone}\n\nInquiry: ${message}\n\nSent from your website.`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                
                window.open(whatsappUrl, '_blank');
                
                alert(`Thank you, ${name}! We've opened WhatsApp for you to send your inquiry. If it doesn't open, please copy your message and send it to ${whatsappNumber}.`);
                
                orderInquiryPopup.classList.remove('active');
                this.reset();
            });
        }
    }

    // Update Footer Year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Animations
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Welcome Popup
    if (welcomePopup && closeWelcomePopup) {
        closeWelcomePopup.addEventListener('click', () => {
            welcomePopup.classList.remove('show');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                welcomePopup.classList.add('show');
            });
        });
    }

    // Nav Link Ripple Effect
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = (e.offsetX) + 'px';
            ripple.style.top = (e.offsetY) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Initialize all functionality
    initializeAnimations();
    initializeFormValidation();
    initializeCookieConsent();
    initializeLazyLoading();

    // Order Type Selection Handler
    const orderTypeSelect = document.getElementById('orderType');
    const deliveryArea = document.getElementById('deliveryArea');
    const pickupInfo = document.getElementById('pickupInfo');
    const mainAreaSelect = document.getElementById('mainAreaSelect');
    const phaseSelect = document.getElementById('phaseSelect');
    const blockSelect = document.getElementById('blockSelect');
    const streetAddress = document.getElementById('streetAddress');

    // Area data for Lahore
    const areaData = {
        dha: {
            phases: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9', 'Phase 10', 'Phase 11', 'Phase 12', 'Phase 13'],
            blocks: {
                'Phase 1': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M'],
                'Phase 2': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M', 'Block N', 'Block P', 'Block Q', 'Block R', 'Block S', 'Block T', 'Block U', 'Block V', 'Block W'],
                'Phase 3': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M', 'Block N', 'Block P', 'Block Q', 'Block R', 'Block S', 'Block T', 'Block U', 'Block V', 'Block W', 'Block X', 'Block Y', 'Block Z'],
                'Phase 4': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M', 'Block N', 'Block P', 'Block Q', 'Block R'],
                'Phase 5': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M'],
                'Phase 6': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M'],
                'Phase 7': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M', 'Block N', 'Block P', 'Block Q', 'Block R', 'Block S', 'Block T', 'Block U', 'Block V', 'Block W', 'Block X', 'Block Y', 'Block Z'],
                'Phase 8': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M', 'Block N', 'Block P', 'Block Q', 'Block R', 'Block S', 'Block T'],
                'Phase 9': ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F'],
                'Phase 10': ['Block A', 'Block B', 'Block C', 'Block D'],
                'Phase 11': ['Block A', 'Block B', 'Block C'],
                'Phase 12': ['Under Development'],
                'Phase 13': ['Under Development']
            }
        },
        bahria: {
            phases: ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E', 'Sector F', 'Overseas Block', 'Safari Valley', 'Safari Villas', 'Janiper Block', 'Tulip Block', 'EME Sector'],
            blocks: {
                'Sector A': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'],
                'Sector B': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'],
                'Sector C': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'],
                'Sector D': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'],
                'Sector E': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'],
                'Sector F': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5']
            }
        },
        'lake-city': {
            phases: ['Sector M1', 'Sector M2', 'Sector M3', 'Sector M4', 'Sector M5', 'Sector M6', 'Sector M7', 'Sector M8']
        },
        gulberg: {
            phases: ['Gulberg 1', 'Gulberg 2', 'Gulberg 3', 'Gulberg 4', 'Gulberg 5', 'Gulberg Greens']
        },
        johar: {
            phases: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H', 'Block J', 'Block K', 'Block L', 'Block M', 'Block N', 'Block P', 'Block Q', 'Block R']
        },
        wapda: {
            phases: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Block H']
        },
        valencia: {
            phases: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F']
        },
        paragon: {
            phases: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E']
        },
        eme: {
            phases: ['Block A', 'Block B', 'Block C', 'Block D']
        },
        pcsir: {
            phases: ['Phase 1', 'Phase 2']
        },
        'state-life': {
            phases: ['Block 1', 'Block 2', 'Block 3', 'Block 4']
        },
        'pak-arab': {
            phases: ['Block A', 'Block B', 'Block C']
        }
    };

    const confirmLocation = document.getElementById('confirmLocation');
    const selectedAddress = document.getElementById('selectedAddress');
    const addressSummary = document.getElementById('addressSummary');
    const editAddress = document.getElementById('editAddress');

    if (orderTypeSelect) {
        orderTypeSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            // Reset all fields
            deliveryArea.style.display = 'none';
            pickupInfo.style.display = 'none';
            mainAreaSelect.value = '';
            phaseSelect.value = '';
            blockSelect.value = '';
            streetAddress.value = '';
            selectedAddress.style.display = 'none';
            confirmLocation.style.display = 'none';
            
            // Show appropriate section based on selection
            if (selectedValue === 'delivery') {
                deliveryArea.style.display = 'block';
                mainAreaSelect.focus();
            } else if (selectedValue === 'pickup') {
                pickupInfo.style.display = 'block';
            }
        });
    }

    if (mainAreaSelect) {
        mainAreaSelect.addEventListener('change', function() {
            const selectedArea = this.value;
            phaseSelect.style.display = 'none';
            blockSelect.style.display = 'none';
            streetAddress.style.display = 'none';
            confirmLocation.style.display = 'none';
            selectedAddress.style.display = 'none';
            
            if (selectedArea && areaData[selectedArea]) {
                // Populate phases
                phaseSelect.innerHTML = '<option value="">Select Phase/Block</option>';
                areaData[selectedArea].phases.forEach(phase => {
                    phaseSelect.innerHTML += `<option value="${phase}">${phase}</option>`;
                });
                phaseSelect.style.display = 'block';
            }
        });
    }

    if (phaseSelect) {
        phaseSelect.addEventListener('change', function() {
            const selectedArea = mainAreaSelect.value;
            const selectedPhase = this.value;
            blockSelect.style.display = 'none';
            streetAddress.style.display = 'none';
            confirmLocation.style.display = 'none';
            selectedAddress.style.display = 'none';
            
            if (selectedArea && selectedPhase && areaData[selectedArea].blocks && areaData[selectedArea].blocks[selectedPhase]) {
                // Populate blocks if available
                blockSelect.innerHTML = '<option value="">Select Sub-Block</option>';
                areaData[selectedArea].blocks[selectedPhase].forEach(block => {
                    blockSelect.innerHTML += `<option value="${block}">${block}</option>`;
                });
                blockSelect.style.display = 'block';
            } else {
                // If no blocks, show street address input
                streetAddress.style.display = 'block';
            }
        });
    }

    if (blockSelect) {
        blockSelect.addEventListener('change', function() {
            if (this.value) {
                streetAddress.style.display = 'block';
                streetAddress.focus();
            }
        });
    }

    if (streetAddress) {
        streetAddress.addEventListener('input', function() {
            confirmLocation.style.display = this.value.length >= 5 ? 'block' : 'none';
        });
    }

    if (confirmLocation) {
        confirmLocation.addEventListener('click', function() {
            const area = mainAreaSelect.options[mainAreaSelect.selectedIndex].text;
            const phase = phaseSelect.value;
            const block = blockSelect.style.display !== 'none' ? blockSelect.value : '';
            const street = streetAddress.value;

            const fullAddress = `${street}, ${block ? block + ', ' : ''}${phase}, ${area}`;
            addressSummary.textContent = fullAddress;

            // Hide input fields and show confirmed address
            mainAreaSelect.style.display = 'none';
            phaseSelect.style.display = 'none';
            blockSelect.style.display = 'none';
            streetAddress.style.display = 'none';
            confirmLocation.style.display = 'none';
            selectedAddress.style.display = 'block';
        });
    }

    if (editAddress) {
        editAddress.addEventListener('click', function() {
            // Show input fields and hide confirmed address
            mainAreaSelect.style.display = 'block';
            phaseSelect.style.display = 'block';
            if (blockSelect.value) blockSelect.style.display = 'block';
            streetAddress.style.display = 'block';
            confirmLocation.style.display = 'block';
            selectedAddress.style.display = 'none';
        });
    }

    // Review form notification
    const reviewForm = document.getElementById('reviewForm');
    const reviewNotification = document.getElementById('reviewNotification');
    if (reviewForm && reviewNotification) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.elements['name'].value;
            const review = this.elements['review'].value;
            const rating = this.elements['rating'].value;
            
            // Prepare WhatsApp message
            const whatsappNumber = "923334258221";
            const whatsappMessage = `🌟 *New Review from ${name}* 🌟\n\n` +
                `Rating: ${'⭐'.repeat(rating)}\n\n` +
                `Review: ${review}\n\n` +
                `Sent from CACAO website`;
            
            // Show notification
            reviewNotification.style.display = 'flex';
            reviewNotification.classList.add('show');
            
            // Reset form
            reviewForm.reset();
            
            // After 2 seconds, redirect to WhatsApp
            setTimeout(() => {
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappUrl, '_blank');
                
                // Hide notification after 3.5 seconds
                setTimeout(() => {
                    reviewNotification.classList.remove('show');
                    setTimeout(() => {
                        reviewNotification.style.display = 'none';
                    }, 300);
                }, 1500);
            }, 2000);
        });
    }

    // Animated Counters in About Us
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = Math.ceil(target / 100);
                if (count < target) {
                    counter.innerText = count + increment;
                    setTimeout(updateCount, 18);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
    // Trigger counters when About section is visible
    const aboutSection = document.getElementById('about');
    let countersStarted = false;
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    animateCounters();
                    countersStarted = true;
                }
            });
        }, { threshold: 0.3 });
        observer.observe(aboutSection);
    }
    // Meet the Bakers Popup Logic
    const meetBakersBtn = document.getElementById('meetBakersBtn');
    const bakersPopup = document.getElementById('bakersPopup');
    const closeBakersPopup = document.getElementById('closeBakersPopup');
    if (meetBakersBtn && bakersPopup) {
        meetBakersBtn.addEventListener('click', () => {
            bakersPopup.classList.add('active');
        });
    }
    if (closeBakersPopup && bakersPopup) {
        closeBakersPopup.addEventListener('click', () => {
            bakersPopup.classList.remove('active');
        });
    }
    if (bakersPopup) {
        bakersPopup.addEventListener('click', function(e) {
            if (e.target === bakersPopup) {
                bakersPopup.classList.remove('active');
            }
        });
    }
});

// Initialize animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    document.querySelectorAll('section, .menu-item, .testimonial-card, .feature').forEach((el, index) => {
        el.dataset.index = index;
        observer.observe(el);
    });
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.querySelector('.order-inquiry-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[name="name"]').value;
        const phone = this.querySelector('input[name="phone"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        
        if (name.length < 3) {
            alert('Please enter a valid name (minimum 3 characters)');
            return;
        }
        
        if (!/^03\d{9}$/.test(phone)) {
            alert('Please enter a valid phone number (03XXXXXXXXX)');
            return;
        }
        
        if (message.length < 10) {
            alert('Please enter a detailed message (minimum 10 characters)');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Message sent successfully!');
            this.reset();
        }, 1500);
    });
}

// Initialize cookie consent
function initializeCookieConsent() {
    const cookieConsent = document.querySelector('.cookie-consent');
    if (!cookieConsent) return;

    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }

    document.querySelector('.accept-cookies')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.remove('show');
        alert('Cookie preferences saved!');
    });

    document.querySelector('.decline-cookies')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.classList.remove('show');
        alert('Cookie preferences saved!');
    });
}

// Initialize lazy loading
function initializeLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}