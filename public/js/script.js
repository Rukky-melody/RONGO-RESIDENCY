/**
 * RONGO RESIDENCY & BAABFEST 
 * Core Site Logic - v1.1
 * Handles: Hero Animation, Navigation State, and Asset Carousel
 */

/* ==========================================================================
   1. HERO TYPEWRITER ANIMATION
   ========================================================================== */

const textElement = document.getElementById('typewriter');
const phrases = [
    "Artistic Freedom", 
    "Emerging Talent", 
    "Digital Protection", 
    "Cultural Heritage",
    "Sustainable Growth"
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typeSpeed = 150;

/**
 * Executes the character-by-character typing loop.
 * Adjusts timing based on user experience (slower typing, faster deletion).
 */
function initTypewriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;
        typeSpeed = 75; 
    } else {
        textElement.textContent = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;
        typeSpeed = 250;
    }

    // Lifecycle management for typing states
    if (!isDeleting && characterIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Final word dwell time
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    
    setTimeout(initTypewriter, typeSpeed);
}

document.addEventListener('DOMContentLoaded', initTypewriter);


/* ==========================================================================
   2. NAVIGATION & INTERACTIVE UI
   ========================================================================== */

const menuTrigger = document.querySelector('#mobile-menu');
const navContainer = document.querySelector('.nav-links');

/**
 * Toggles primary navigation drawer state.
 * Propagation is stopped to prevent the global click-to-close listener.
 */
menuTrigger.addEventListener('click', (e) => {
    e.stopPropagation(); 
    menuTrigger.classList.toggle('active');
    navContainer.classList.toggle('active');
});

/**
 * Mobile Navigation: Dropdown & Link Management.
 * Uses event matching to differentiate between category toggles and destinations.
 */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const isDropdownTrigger = link.classList.contains('dropbtn');

        if (isDropdownTrigger && window.innerWidth <= 992) {
            e.preventDefault();
            e.stopPropagation(); 
            
            const targetContent = link.nextElementSibling; 
            
            // Accordion: Ensure only one sub-menu is active at a time
            document.querySelectorAll('.dropdown-content').forEach(sub => {
                if (sub !== targetContent) sub.classList.remove('open');
            });

            targetContent.classList.toggle('open');
            
        } else {
            // Global Nav Reset: Closes all UI layers upon navigation
            resetNavigationState();
        }
    });
});

/**
 * Outside-Click Reset: Closes navigation if user clicks off-canvas.
 */
document.addEventListener('click', (e) => {
    if (!navContainer.contains(e.target) && !menuTrigger.contains(e.target)) {
        resetNavigationState();
    }
});

function resetNavigationState() {
    menuTrigger.classList.remove('active');
    navContainer.classList.remove('active');
    document.querySelectorAll('.dropdown-content').forEach(sub => sub.classList.remove('open'));
}


/* ==========================================================================
   3. HERO ASSET CAROUSEL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Change image every 6 seconds for a slower, "poetic" feel
    setInterval(nextSlide, 6000);
});

// ==========================================================================
// TEAM SECTION SLIDER LOGIC
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector('.team-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = track.querySelector('.team-card').offsetWidth;
            // Scroll left by exactly one card width + gap layout
            track.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = track.querySelector('.team-card').offsetWidth;
            // Scroll right by exactly one card width
            track.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
        });
    }
});

/**
 * SCROLL REVEAL - FLOAT IN ANIMATION
 * Triggers when elements enter the viewport.
 */
document.addEventListener("DOMContentLoaded", () => {
    const floatElements = document.querySelectorAll('.mv-card, .work-card, .platform-card, .impact-stat, .section-title, .intro-lead, .intro-body p, .team-card');
    
    if (floatElements.length === 0) return;

    // Initially hide them so they don't pop in before JS runs
    floatElements.forEach(el => el.classList.add('float-start'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('floating-in');
                // Stop observing once it has floated in
                obs.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    floatElements.forEach((el, index) => {
        // Add a slight stagger delay for consecutive sibling cards
        el.style.animationDelay = `${(index % 4) * 0.3}s`;
        observer.observe(el);
    });

    /**
     * STATS COUNTER ANIMATION
     */
    const counters = document.querySelectorAll('.counter');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    entry.target.innerText = Math.floor(progress * target);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        entry.target.innerText = target;
                    }
                };

                window.requestAnimationFrame(step);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Lower threshold for earlier activation

    counters.forEach(counter => countObserver.observe(counter));
});

/* ==========================================================================
   4. FORM SUBMISSION (AJAX)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.rongo-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'PLEASE WAIT...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = new URLSearchParams(formData);

            try {
                // Requesting application/json will often instruct proxies/Render 
                // to delay returning the loading HTML until the server finishes.
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const result = await response.json();
                        if (result.success && result.redirectUrl) {
                            window.location.href = result.redirectUrl;
                        } else {
                            window.location.href = '/success.html';
                        }
                    } else {
                        // In case Render still intercepts and sends back the HTML loading page with 200 OK
                        const text = await response.text();
                        if (text.includes('START BUILDING ON RENDER TODAY')) {
                            alert('The server is currently waking up from sleep. Please wait a moment and try submitting again.');
                        } else {
                            window.location.href = '/success.html';
                        }
                    }
                } else {
                    alert('Something went wrong. Please try again later.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Connection error. Please check your internet connection and try again.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});