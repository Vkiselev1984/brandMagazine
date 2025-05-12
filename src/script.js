export function setupMainScript() {
    document.addEventListener('DOMContentLoaded', function () {
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
    });
}
