export function setupMainScript() {
    document.addEventListener('DOMContentLoaded', function () {
    // Всегда скрываем админ-панель по умолчанию
    const adminMenu = document.querySelector('.admin-panel-menu');
    if (adminMenu) adminMenu.style.display = 'none';
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.querySelector('.header-menu');
        const menuHeader = document.querySelector('.header-menu__header');

        function toggleMenu() {
            menu.classList.toggle('show');
        }

        menuToggle.addEventListener('click', function (event) {
            event.preventDefault();
            toggleMenu();
        });

        menuHeader.addEventListener('click', function (event) {
            event.preventDefault();
            toggleMenu();
        });

        document.querySelectorAll('.header-menu__link').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const dropdown = this.nextElementSibling;
                const isActive = dropdown.classList.contains('active');
                document.querySelectorAll('.header-menu__dropdown').forEach(menu => {
                    menu.classList.remove('active');
                    menu.previousElementSibling.classList.remove('active');
                });
                if (!isActive) {
                    dropdown.classList.add('active');
                    this.classList.add('active');
                    this.querySelector('.header-menu__icon').classList.add('active');
                } else {
                    this.querySelector('.header-menu__icon').classList.remove('active');
                }
            });
        });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('.header-menu__item')) {
                document.querySelectorAll('.header-menu__dropdown').forEach(menu => {
                    menu.classList.remove('active');
                    menu.previousElementSibling.classList.remove('active');
                });
                document.querySelectorAll('.header-menu__icon').forEach(icon => {
                    icon.classList.remove('active');
                });
            }
        });

        const container = document.querySelector('.search-container');
        const searchIcon = document.querySelector('.search-icon');
        const searchInput = document.querySelector('.search-input');
        container.addEventListener('mouseenter', function () {
            container.classList.add('active');
        });
        searchIcon.addEventListener('click', function () {
            container.classList.toggle('active');
        });
        container.addEventListener('click', function (event) {
            if (event.target === container) {
                container.classList.remove('active');
            }
        });
        // Показывать админ-панель только админу
        function renderAdminMenu() {
    fetch('/api/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const ul = document.querySelector('.header-menu__list');
            if (!ul) return;
            const old = document.querySelector('.admin-panel-menu');
            if (old) old.remove();
            if (data.role === 'admin') {
                const li = document.createElement('li');
                li.className = 'header-menu__item admin-panel-menu';
                li.innerHTML = `
                  <a class="header-menu__link" href="#" role="button">
                    Админ-панель
                    <span class="header-menu__icon"></span>
                  </a>
                  <ul class="header-menu__dropdown">
                    <li class="header-menu__dropdown-item">
                      <a class="header-menu__dropdown-link" href="http://localhost:3001/admin/table/products" target="_blank">Товары</a>
                    </li>
                    <li class="header-menu__dropdown-item">
                      <a class="header-menu__dropdown-link" href="http://localhost:3001/admin/table/users" target="_blank">Пользователи</a>
                    </li>
                    <li class="header-menu__dropdown-item">
                      <a class="header-menu__dropdown-link" href="http://localhost:3001/admin/table/mailings" target="_blank">Рассылка</a>
                    </li>
                    <li class="header-menu__dropdown-item">
                      <a class="header-menu__dropdown-link" href="http://localhost:3001/admin/table/user_profiles" target="_blank">Личный кабинет</a>
                    </li>
                    <li class="header-menu__dropdown-item">
                      <a class="header-menu__dropdown-link" href="http://localhost:3001/admin/table/promotions" target="_blank">Акции</a>
                    </li>
                  </ul>
                `;
                ul.appendChild(li);
            }
        });
}
document.addEventListener('DOMContentLoaded', renderAdminMenu);

    });
}
