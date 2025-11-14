import './style.css'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmI4k56mDYLRuWcVXfNssqJx5T6QNZo1-RNwZ0q6WwMGUk0mLB1DwYdUsbHGUrnbUx/exec';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initScrollAnimations();
  initParallax();
  initMagneticButtons();
  initSmoothScroll();
  fetchAndRenderProducts();
});

function initLoader() {
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 1500);
  });
}

function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

function initParallax() {
  const parallaxBg = document.querySelector('.parallax-bg');
  const parallaxElements = document.querySelectorAll('.parallax-element');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (elementVisible) {
        const offset = (scrolled - elementTop) * 0.1;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  });
}

function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      this.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.15;
      const moveY = y * 0.15;

      this.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-2px)`;
    });

    button.addEventListener('mouseleave', function(e) {
      this.style.transform = 'translate(0, 0) translateY(0)';
    });
  });
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const heroBtn = document.querySelector('.hero-btn');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const productsSection = document.querySelector('#products');
      if (productsSection) {
        const offsetTop = productsSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }
}

let cartCount = 0;
const cartButton = document.querySelector('.nav-cart');

function formatCurrency(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

async function fetchAndRenderProducts() {
  const productsGrid = document.getElementById('products-grid');

  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const products = await response.json();

    productsGrid.innerHTML = '';

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';

      productCard.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${product.image_url}" alt="${product.title}" class="product-image" onerror="this.src='https://images.pexels.com/photos/3737581/pexels-photo-3737581.jpeg?auto=compress&cs=tinysrgb&w=600'">
          <button class="product-quick-add magnetic-btn">Add to Cart</button>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">${formatCurrency(product.price)}</p>
        </div>
      `;

      productsGrid.appendChild(productCard);

      const addButton = productCard.querySelector('.product-quick-add');
      addButton.addEventListener('click', (e) => {
        e.stopPropagation();
        cartCount++;
        cartButton.textContent = `Cart (${cartCount})`;

        addButton.textContent = 'Added!';
        addButton.style.background = '#D4AF37';
        addButton.style.color = '#ffffff';

        setTimeout(() => {
          addButton.textContent = 'Add to Cart';
          addButton.style.background = '#ffffff';
          addButton.style.color = '#1a1a1a';
        }, 1500);
      });
    });

    initScrollAnimations();
  } catch (error) {
    console.error('Error fetching products:', error);
    productsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">Unable to load products. Please try again later.</p>';
  }
}
