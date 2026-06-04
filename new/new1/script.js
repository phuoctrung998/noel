// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Tạo hiệu ứng tuyết rơi
    createSnowflakes();
    
    // Thêm hiệu ứng fade-in cho các phần tử khi scroll
    addScrollAnimations();
    
    // Thêm sự kiện click cho các thẻ ảnh
    setupMemoryCards();
    
    // Thêm sự kiện đóng modal
    setupModal();
    
    // Tạo trái tim bay ngẫu nhiên
    setInterval(createHeart, 3000);
    
    // Thêm sự kiện click để tạo pháo hoa
    document.addEventListener('click', function(e) {
        // Chỉ tạo pháo hoa khi click vào phần Năm Mới
        if (e.target.closest('.newyear-section')) {
            createFirework(e.clientX, e.clientY);
        }
    });
});

// Tạo hiệu ứng tuyết rơi
function createSnowflakes() {
    const snowContainer = document.querySelector('.snow-container');
    const snowflakeCount = 100;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        
        // Thiết lập vị trí ngẫu nhiên
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Thiết lập kích thước ngẫu nhiên
        const size = Math.random() * 10 + 10;
        snowflake.style.fontSize = size + 'px';
        
        // Thiết lập thời gian rơi ngẫu nhiên
        const duration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = duration + 's';
        
        // Thiết lập độ trễ ngẫu nhiên
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        
        // Thiết lập opacity ngẫu nhiên
        snowflake.style.opacity = Math.random() * 0.8 + 0.2;
        
        snowContainer.appendChild(snowflake);
    }
}

// Tạo hiệu ứng pháo hoa
function createFirework(x, y) {
    const fireworksContainer = document.querySelector('.fireworks-container');
    const particleCount = 100;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('firework-particle');
        
        // Thiết lập vị trí ban đầu
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Thiết lập màu sắc ngẫu nhiên
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        // Thiết lập kích thước
        const size = Math.random() * 5 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Thiết lập border-radius để tạo hình tròn
        particle.style.borderRadius = '50%';
        
        // Thiết lập vị trí tuyệt đối
        particle.style.position = 'absolute';
        
        // Tính toán hướng bay ngẫu nhiên
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        // Thêm vào container
        fireworksContainer.appendChild(particle);
        
        // Animation cho particle
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animateParticle = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.01;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animateParticle);
    }
}

// Tạo trái tim bay
function createHeart() {
    const heartsContainer = document.querySelector('.hearts-container');
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Thiết lập vị trí ngẫu nhiên theo chiều ngang
    heart.style.left = Math.random() * 100 + '%';
    
    // Thiết lập màu sắc ngẫu nhiên
    const colors = ['#e74c3c', '#ff6b6b', '#ff8e8e', '#ffaaaa'];
    heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Thiết lập kích thước ngẫu nhiên
    const size = Math.random() * 15 + 10;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    // Thiết lập độ trễ ngẫu nhiên
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    heartsContainer.appendChild(heart);
    
    // Xóa trái tim sau khi animation kết thúc
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Thêm hiệu ứng fade-in khi scroll
function addScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .memory-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Thiết lập các thẻ ảnh
function setupMemoryCards() {
    const memoryCards = document.querySelectorAll('.memory-card');
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    
    memoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            modalMessage.textContent = message;
            modal.style.display = 'block';
        });
    });
}

// Thiết lập modal
function setupModal() {
    const modal = document.getElementById('messageModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Hàm scroll đến phần Năm Mới
function scrollToNewYear() {
    document.getElementById('newyear').scrollIntoView({ behavior: 'smooth' });
}

// Hàm scroll đến phần Gallery
function scrollToGallery() {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}