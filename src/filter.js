export function setupFilter() {
  document.addEventListener('DOMContentLoaded', function () {
    const productContainer = document.querySelector('.goods__list');
    if (!productContainer) return;
    const isMain = !!productContainer.id; // id="product-list" только на главной
    const paginationContainer = document.querySelector('.pagination');
    let currentPage = 1;
    let currentLimit = isMain ? 3 : 9;
    let totalPages = 1;

    // --- Рендер товаров ---
    function renderProducts(products) {
      productContainer.innerHTML = '';
      if (!products || products.length === 0) {
        productContainer.innerHTML = '<li>Нет товаров для отображения</li>';
        return;
      }
      products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.className = 'goods__item product';
        listItem.dataset.id = product.id;
        // let adminEditIcon = '';
        // if (userRole === 'admin') {
        //   adminEditIcon = `<span class="admin-edit-icon" title="Редактировать товар" data-id="${product.id}" style="cursor:pointer;position:absolute;top:10px;right:10px;z-index:2;">
        //     <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        //       <rect width="20" height="20" fill="white" fill-opacity="0"/>
        //       <path d="M4 13.5V16H6.5L14.87 7.63L12.37 5.13L4 13.5ZM17.71 6.04C18.1 5.65 18.1 5.02 17.71 4.63L15.37 2.29C14.98 1.9 14.35 1.9 13.96 2.29L12.13 4.12L15.88 7.87L17.71 6.04Z" fill="#222"/>
        //     </svg>
        //   </span>`;
        // }
        listItem.innerHTML = `
          <div class="product__image-wrapper" style="position:relative;">
            <img class="product__image" src="${product.image}" alt="${product.title}">
            <!-- adminEditIcon -->
            <button class="product__add" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">Добавить в корзину</button>
          </div>
          <div class="product__content">
            <h3 class="product__title">${product.title}</h3>
            <p class="product__description">${product.description}</p>
            <p class="product__price">${product.price}</p>
          </div>
        `;
        productContainer.appendChild(listItem);
      });}

    // --- Рендер пагинации ---
    function renderPagination(total, limit) {
      if (isMain || !paginationContainer) return;
      paginationContainer.innerHTML = '';
      totalPages = Math.ceil(total / limit);
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'page-button' + (i === currentPage ? ' active' : '');
        btn.addEventListener('click', () => {
          currentPage = i;
          loadProducts();
        });
        paginationContainer.appendChild(btn);
      }
    }

    // --- Сбор фильтров из DOM (только для каталога) ---
    function getFilters() {
      if (isMain) return { limit: 3 };
      // Категория
      let category = '';
      const catActive = document.querySelector('.summary__item:nth-child(1) .summary__dropdown_link.active');
      if (catActive && catActive.textContent !== 'Все') category = catActive.textContent.trim();
      // Бренд
      let brand = '';
      const brandActive = document.querySelector('.summary__item:nth-child(2) .summary__dropdown_link.active');
      if (brandActive && brandActive.textContent !== 'Все') brand = brandActive.textContent.trim();
      // Тренды
      let trends = [];
      document.querySelectorAll('.filters__dropdown_item input[type="checkbox"]:checked').forEach(cb => trends.push(cb.value));
      // Размеры
      let sizes = [];
      document.querySelectorAll('.filters__dropdown_size input[type="checkbox"]:checked').forEach(cb => sizes.push(cb.value));
      // Поиск
      let search = '';
      const searchInput = document.querySelector('.search-input');
      if (searchInput) search = searchInput.value.trim();
      return {
        category,
        brand,
        trends: trends.join(','),
        sizes: sizes.join(','),
        search,
        page: currentPage,
        limit: currentLimit
      };
    }

    function buildQuery(params) {
      return Object.entries(params)
        .filter(([_, v]) => v && v !== 'all')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    }

    // --- Загрузка товаров ---
    function loadProducts() {
      const filters = getFilters();
      const query = buildQuery(filters);
      fetch(`/products?${query}`)
        .then(res => {
          if (!res.ok) throw new Error('Ошибка ответа сервера: ' + res.status);
          return res.json();
        })
        .then(data => {
          const products = data.products || data;
          const total = data.total || products.length;
          renderProducts(products);
          renderPagination(total, currentLimit);
        })
        .catch(err => {
          productContainer.innerHTML = `<li>Ошибка загрузки товаров: ${err.message}</li>`;
        });
    }

    // --- События для фильтров (только для каталога) ---
    if (!isMain) {
      // Категория/бренд (делегирование)
      document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('summary__dropdown_link')) {
          const parentList = e.target.closest('.summary__dropdown_list');
          if (parentList) {
            parentList.querySelectorAll('.summary__dropdown_link').forEach(link => link.classList.remove('active'));
          }
          e.target.classList.add('active');
          currentPage = 1;
          loadProducts();
          e.preventDefault();
        }
      });
      // Тренды, размеры — чекбоксы
      document.body.addEventListener('change', (e) => {
        if (e.target.matches('.filters__dropdown_item input[type="checkbox"], .filters__dropdown_size input[type="checkbox"]')) {
          currentPage = 1;
          loadProducts();
        }
      });
      // Поиск
      const searchInput = document.querySelector('.search-input');
      if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1; loadProducts(); });
    }

    // --- Первая загрузка ---
    loadProducts();
  });
}
