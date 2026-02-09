// Get elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const angryMessage = document.getElementById('angryMessage');
const questionSection = document.getElementById('questionSection');
const successSection = document.getElementById('successSection');
const confettiCanvas = document.getElementById('confetti');
const initialPhoto = document.getElementById('initialPhoto');
const carouselWrapper = document.getElementById('carouselWrapper');

// Carousel elements
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const totalItems = items.length;
let noClickCount = 0;
let autoRotate;

// Carousel update function
function updateCarousel() {
    items.forEach((item, index) => {
        item.classList.remove('active', 'prev-1', 'prev-2', 'next-1', 'next-2');
        
        if (index === currentIndex) {
            item.classList.add('active');
        } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
            item.classList.add('prev-1');
        } else if (index === (currentIndex - 2 + totalItems) % totalItems) {
            item.classList.add('prev-2');
        } else if (index === (currentIndex + 1) % totalItems) {
            item.classList.add('next-1');
        } else if (index === (currentIndex + 2) % totalItems) {
            item.classList.add('next-2');
        }
    });
}

// Carousel navigation
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
});

// Start auto-rotate function
function startAutoRotate() {
    autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 3000);
}

// Pause auto-rotate on hover
function setupCarouselHover() {
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
    carousel.addEventListener('mouseleave', () => startAutoRotate());
}

// No button behavior
noBtn.addEventListener('mouseenter', function() {
    const randomX = Math.random() * (window.innerWidth - 200);
    const randomY = Math.random() * (window.innerHeight - 100);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
});

noBtn.addEventListener('click', function() {
    noClickCount++;
    angryMessage.classList.add('show');
    
    const currentSize = 1 + (noClickCount * 0.2);
    yesBtn.style.transform = `scale(${currentSize})`;
});

// Yes button - show success with confetti
yesBtn.addEventListener('click', function() {
    // Hide initial photo and question
    initialPhoto.style.display = 'none';
    questionSection.style.display = 'none';
    
    // Show success message
    successSection.classList.add('show');
    
    // Play music
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(() => {
            console.log('Music autoplay blocked');
        });
    }
    
    // Show carousel after a short delay
    setTimeout(() => {
        carouselWrapper.classList.add('show');
        updateCarousel();
        startAutoRotate();
        setupCarouselHover();
    }, 1500);
    
    // Start confetti
    createConfetti();
});

// Confetti animation
function createConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const confettiCount = 150;
    const confetti = [];
    
    const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#ffd89b'];
    
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confetti.forEach((c, index) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle - index / 3) * 15;
            
            if (c.y > confettiCanvas.height) {
                confetti[index] = {
                    x: Math.random() * confettiCanvas.width,
                    y: -10,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngleIncremental: c.tiltAngleIncremental,
                    tiltAngle: c.tiltAngle
                };
            }
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}