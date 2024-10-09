import {
  addToCart,
  removeFromCart,
  addToCartPurchase,
} from '../controller/cartController.js';
import { publicProducts } from './service.js';

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');

  let activeCategory = null;
  let activeOrder = null;
  let products = [];

  const loadProducts = async () => {
    try {
      const dataProducts = await publicProducts();

      products = dataProducts.data;

      displayProducts(products);

      const searchInput = document.getElementById('search');
      const suggestions = document.getElementById('suggestions');

      searchInput.addEventListener('keyup', () => {
        const searchValue = searchInput.value.toLowerCase();
        const filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(searchValue)
        );
        updateSuggestions(filteredProducts);
      });

      document.getElementById('clearSearch').addEventListener('click', () => {
        searchInput.value = '';
        displayProducts(products);
      });

      document.addEventListener('click', (event) => {
        if (
          !searchInput.contains(event.target) &&
          !suggestions.contains(event.target)
        ) {
          searchInput.value = '';
          suggestions.style.display = 'none';
        }
      });

      function updateSuggestions(filteredProducts) {
        suggestions.innerHTML = '';

        if (filteredProducts.length === 0) {
          suggestions.style.display = 'none';
          return;
        }

        suggestions.style.display = 'block';

        filteredProducts.forEach((product) => {
          const li = document.createElement('li');
          li.textContent = product.name;
          li.addEventListener('click', () => {
            searchInput.value = product.name;
            suggestions.style.display = 'none';
            displayProducts([product]);
          });
          suggestions.appendChild(li);
        });
      }

      createCategoryMenu(products);

      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const filter = document.getElementById('filter');
  const filterMenu = document.getElementById('filter-menu');
  const categoryBtn = document.querySelector('.category');
  const orderBtn = document.querySelector('.order');
  const categoryList = document.querySelector('.category-list');
  const orderList = document.querySelector('.order-list');
  const iconCategory = document.querySelector('.icon-category');
  const iconOrder = document.querySelector('.icon-order');

  function closeAllFilterSubmenus() {
    const submenus = document.querySelectorAll('.filter-submenu-list');
    submenus.forEach((submenu) => {
      submenu.style.display = 'none';
      const parentItem = submenu.parentElement;
      parentItem.classList.remove('open');
      const icon = parentItem.querySelector('.icon');
      if (icon) {
        icon.textContent = '+';
      }
    });
  }

  filter.addEventListener('click', () => {
    if (filterMenu.classList.contains('show')) {
      closeAllFilterSubmenus();
    }
    filterMenu.classList.toggle('show');
  });

  categoryBtn.addEventListener('click', () => {
    const parentItem = categoryBtn.parentElement;
    const isOpen = parentItem.classList.contains('open');

    closeAllFilterSubmenus();

    if (!isOpen) {
      parentItem.classList.add('open');
      categoryList.style.display = 'flex';
      iconCategory.textContent = '-';
    } else {
      categoryList.style.display = 'none';
      iconCategory.textContent = '+';
    }
  });

  orderBtn.addEventListener('click', () => {
    const parentItem = orderBtn.parentElement;
    const isOpen = parentItem.classList.contains('open');

    closeAllFilterSubmenus();

    if (!isOpen) {
      parentItem.classList.add('open');
      orderList.style.display = 'flex';
      iconOrder.textContent = '-';
    } else {
      orderList.style.display = 'none';
      iconOrder.textContent = '+';
    }
  });

  const createCategoryMenu = (products) => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];

    categories.forEach((category) => {
      const menuItem = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = category;

      link.addEventListener('click', () => {
        if (activeCategory === category) {
          activeCategory = null;
        } else {
          activeCategory = category;
        }
        applyFilters();
      });

      menuItem.appendChild(link);
      categoryList.appendChild(menuItem);
    });

    categoryList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        return;
      }
      categoryList.classList.toggle('show');
    });
  };

  const applyFilters = () => {
    let filteredProducts = products;

    if (activeCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === activeCategory
      );
    }

    if (activeOrder) {
      if (activeOrder === 'price-smaller') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (activeOrder === 'price-bigger') {
        filteredProducts.sort((a, b) => b.price - a.price);
      }
    }

    displayProducts(filteredProducts);
  };

  orderList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const order = event.target.id;
      if (activeOrder === order) {
        activeOrder = null;
      } else {
        activeOrder = order;
      }
      applyFilters();
    });
  });

  const clearFiltersButton = document.querySelector('.clear-filter');
  clearFiltersButton.addEventListener('click', () => {
    activeCategory = null;
    activeOrder = null;
    document.getElementById('search').value = '';
    displayProducts(products);
  });

  document.addEventListener('click', (event) => {
    if (
      !filterMenu.contains(event.target) &&
      !filter.contains(event.target) &&
      filterMenu.classList.contains('show')
    ) {
      closeAllFilterSubmenus();
      filterMenu.classList.remove('show');
    }
  });

  const displayProducts = (products) => {
    const container = document.querySelector('.products-container');
    container.innerHTML = products
      .map((product) => {
        const cardBtnClass = token ? 'card-btn' : 'hidden';

        return `
        <div class="card" data-product-id="${product._id}" data-product-name="${
          product.name
        }">
          <div class="carousel">
            ${getImageCarousel(product.images)}
          </div>
          <h3>${product.name}</h3>
          <div class="card-text">
            <p>${product.type} ${product.brand} ${product.model} ${
          product.color
        }</p>
          </div>
          <div class="detals">
            <span class="detals-price">R$ ${parseFloat(product.price)
              .toFixed(2)
              .replace('.', ',')}</span>
            <button class="detals-btn" data-action="detals">Detalhes</button>
          </div>
          <div class="${cardBtnClass}">
            <button class="btn-cart" data-action="remove">-</button>
            <span><button class="btn-order" data-action="create-order">Comprar</button></span>
            <button class="btn-cart" data-action="add">+</button>
          </div>
        </div>
      `;
      })
      .join('');

    initializeCarousels();

    document
      .querySelectorAll(".detals-btn[data-action='detals']")
      .forEach((button) => {
        button.addEventListener('click', () => {
          const productId = button
            .closest('.card')
            .getAttribute('data-product-id');
          showModalProduct(productId);
        });
      });

    document
      .querySelectorAll(".btn-cart[data-action='add']")
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const productId = button
            .closest('.card')
            .getAttribute('data-product-id');
          await addToCart(productId);
        });
      });

    document
      .querySelectorAll(".btn-cart[data-action='remove']")
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const productId = button
            .closest('.card')
            .getAttribute('data-product-id');
          const productName = button
            .closest('.card')
            .getAttribute('data-product-name');
          await removeFromCart(productId, productName);
        });
      });

    document
      .querySelectorAll(".btn-order[data-action='create-order']")
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const productId = button
            .closest('.card')
            .getAttribute('data-product-id');
          await addToCartPurchase(productId);
        });
      });
  };

  const getImageCarousel = (images) => {
    if (!images || images.length === 0) {
      return `<img src="https://via.placeholder.com/200x200" alt="Placeholder Image" class="carousel-image active">`;
    }

    const imageElements = images
      .map(
        (image, index) => `
      <img src="${
        typeof image === 'object' ? Object.values(image).join('') : image
      }" alt="Image ${index + 1}" class="carousel-image ${
          index === 0 ? 'active' : ''
        }">
    `
      )
      .join('');

    const indicators = images
      .map(
        (_, index) => `
      <span class="indicator ${index === 0 ? 'active' : ''}"></span>
    `
      )
      .join('');

    return `
      <div class="carousel-container">
        ${imageElements}
      </div>
      <button class="carousel-button prev">❮</button>
      <button class="carousel-button next">❯</button>
      <div class="carousel-indicators">
        ${indicators} 
      </div>
    `;
  };

  const initializeCarousels = () => {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach((carousel) => {
      const images = carousel.querySelectorAll('.carousel-image');
      const indicators = carousel.parentNode.querySelectorAll('.indicator');
      let currentIndex = 0;
      const imageInterval = 5000;

      const showImage = (index) => {
        if (index >= images.length) {
          currentIndex = 0;
        } else if (index < 0) {
          currentIndex = images.length - 1;
        } else {
          currentIndex = index;
        }

        const offset = -currentIndex * 100;
        images.forEach((slide) => {
          slide.style.transform = `translateX(${offset}%)`;
        });

        indicators.forEach((indicator, idx) => {
          indicator.classList.toggle('active', idx === currentIndex);
        });
      };

      const prevButton = carousel.parentNode.querySelector(
        '.carousel-button.prev'
      );
      const nextButton = carousel.parentNode.querySelector(
        '.carousel-button.next'
      );

      prevButton.addEventListener('click', () => showImage(currentIndex - 1));
      nextButton.addEventListener('click', () => showImage(currentIndex + 1));

      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showImage(index));
      });

      setInterval(() => showImage(currentIndex + 1), imageInterval);
    });
  };

  loadProducts();

  function showModalProduct(productId) {
    const product = products.find((p) => p._id === productId);

    if (!product) {
      console.error('Produto não encontrado');
      return;
    }

    const modal = document.getElementById('modal-user');
    const title = document.getElementById('modal-user-title');
    const content = document.getElementById('modal-user-main');
    const btnClose = document.getElementById('close');
    const footer = document.getElementById('modal-user-footer');

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = `Detalhes do Produto`;

    content.innerHTML = `<span class='title-details'>${product.name}</span>`;
    content.classList.add('details-table');

    const table = document.createElement('table');
    table.className = 'details-table';

    for (let i = 0; i < product.details.length; i += 2) {
      const row = document.createElement('tr');

      const propertyCell = document.createElement('td');
      propertyCell.textContent = product.details[i];

      const valueCell = document.createElement('td');
      valueCell.textContent = product.details[i + 1];

      row.appendChild(propertyCell);
      row.appendChild(valueCell);
      table.appendChild(row);
    }

    content.appendChild(table);

    footer.innerHTML = `
      <button id="modalBtnOkDetail" class="ok">Fechar</button>
    `;

    btnClose.onclick = function () {
      modal.style.display = 'none';
    };

    modal.style.display = 'block';

    const exit = document.getElementById('modalBtnOkDetail');
    exit.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    btnClose.focus();
    btnClose.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
