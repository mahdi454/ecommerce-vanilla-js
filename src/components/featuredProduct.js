import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
import { loadCss } from '../service/loadCss.js';
import { featuredData } from '../service/loadData.js';

class FeaturedProducts extends HTMLElement {
  #CarouselTemplate = document.createElement('template');
  #CardTemplate = document.createElement('template');

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.container = document.createElement('section');
    this.shadowRoot.appendChild(this.container);
    this.currentIndex = 0;

    this.#initTemplates();
  }

  renderCarousel() {
    return `
    <div class="featured-carousel">
      <button class="featured-nav prev" aria-label="Previous">&#10094;</button>
      <div class="featured-track"></div>
      <button class="featured-nav next" aria-label="Next">&#10095;</button>
      <div class="stacked_card"></div>
    </div>
  `;
  }

  renderCard() {
    return `
    <article class="featured-card">

      <div class="child left">
        <img alt="">
      </div>

      <div class="child right">
        <div class="image_right_container">

        <div class="image_wrapper">
             <img class="secondary-image" alt="">

           ${this.renderDetails()}
        </div>

         </div>
      </div>

    </article>
  `;
  }

  renderDetails() {
    return `
    <div class="detail_con">
      <div class="title_con">
         <h4></h4>
         <div class="price_con">
           <span class="price"></span>
           <span class="currency">INR</span>
        </div>
      </div>

       <div class="actions">
            <button class="btn add-cart">Add to Cart</button>
            <button
            class="btn favorite"
            aria-label="Add to favorites">
            Add to Wishlist
            </button>
       </div>
    </div>
  `;
  }

  #initTemplates() {
    this.#CarouselTemplate.innerHTML = this.renderCarousel();
    this.#CardTemplate.innerHTML = this.renderCard();
  }

  async connectedCallback() {
    await loadCss(this.shadowRoot, '/src/components/featuredProduct.css');
    this.#renderLoading();

    try {
      const products = await featuredData();
      console.log(products);

      if (!products?.length) {
        this.#renderEmpty();
        return;
      }

      this.#render(products);
    } catch (err) {
      this.#renderError(err);
    }
  }

  #renderLoading() {
    this.container.innerHTML = `
      <div class="featured-state featured-loading">
        <span>Loading featured products</span>
      </div>
    `;
  }

  #renderEmpty() {
    this.container.innerHTML = `
      <div class="featured-state featured-empty">
        <h3>No Featured Products</h3>
        <p>Check back later for exciting new items.</p>
      </div>
    `;
  }

  #renderError(err) {
    console.error('Featured products error:', err);
    this.container.innerHTML = `
      <div class="featured-state featured-error">
        <h3>Something went wrong</h3>
        <p>Unable to load featured products. Please try again later.</p>
      </div>
    `;
  }

  #render(products) {
    this.container.textContent = '';

    const carousel = this.#CarouselTemplate.content.cloneNode(true);
    const track = carousel.querySelector('.featured-track');
    const fragment = document.createDocumentFragment();

    products.forEach((product, index) => {
      fragment.appendChild(this.#createCard(product, index === 0));
    });

    track.appendChild(fragment);
    this.container.appendChild(carousel);
    this.#initCarousel();
  }

  #createCard(product, isActive) {
    const card = this.#CardTemplate.content.cloneNode(true).firstElementChild;

    if (isActive) card.classList.add('active');

    // Left image
    const leftImg = card.querySelector('.child.left img');
    leftImg.src = product.featuredImage.url;
    leftImg.alt = product.title;

    // Right image
    const rightImg = card.querySelector('.secondary-image');
    const secondaryImage = product.images?.at(-1);
    if (secondaryImage) {
      rightImg.src = secondaryImage.url;
      rightImg.alt = secondaryImage.altText || product.title;
    }

    // Text content
    card.querySelector('h4').textContent = product.title;
    card.querySelector('.price').textContent = product.priceRange?.minVariantPrice?.amount || '';
    card.querySelector('.currency').textContent =
      product.priceRange?.minVariantPrice?.currencyCode || '';

    return card;
  }

  #initCarousel() {
    const nextBtn = this.shadowRoot.querySelector('.next');
    const prevBtn = this.shadowRoot.querySelector('.prev');

    nextBtn.addEventListener('click', () => {
      const cards = this.#getCards();
      this.currentIndex = (this.currentIndex + 1) % cards.length;
      this.#show(this.currentIndex);
    });

    prevBtn.addEventListener('click', () => {
      const cards = this.#getCards();
      this.currentIndex = (this.currentIndex - 1 + cards.length) % cards.length;
      this.#show(this.currentIndex);
    });

    // Initial animation
    this.#show(this.currentIndex);
  }

  #getCards() {
    return this.shadowRoot.querySelectorAll('.featured-card');
  }

  #show(index) {
    const cards = this.#getCards();

    cards.forEach((card) => {
      card.classList.remove('active');

      gsap.set(card, {
        opacity: 1,
        zIndex: 0,
        pointerEvents: 'none',
      });

      gsap.set(card.querySelector('.child.left'), { y: -2000 });
      gsap.set(card.querySelector('.child.right'), { y: 2000 });
    });

    const active = cards[index];
    active.classList.add('active');

    const left = active.querySelector('.child.left');
    const right = active.querySelector('.child.right');

    gsap.to(active, {
      zIndex: 2,
      pointerEvents: 'auto',
      duration: 0.5,
    });

    gsap.to(left, {
      y: 0,
      duration: 1.5,
      ease: 'power4.out',
    });

    gsap.to(right, {
      y: 0,
      duration: 1.5,
      ease: 'power4.out',
    });
  }
}

customElements.define('featured-products', FeaturedProducts);
