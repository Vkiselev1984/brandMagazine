import { renderAdminPanel } from './admin-panel.js';
import { setupAuthorization } from './authorization.js';
import { setupCartPopup, renderCartPage } from './cart-popup.js';
import { setupFilter } from './filter.js';
import { setupRegistration } from './registration.js';
import { setupMainScript } from './script.js';
import { setupDropdownFilters } from './submenu.js';

setupRegistration();
setupAuthorization();
setupMainScript();
setupFilter();
setupCartPopup();

// Для страницы корзины отображаем все товары из корзины
if (window.location.pathname.endsWith('cart.html')) {
    renderCartPage();
}
renderAdminPanel();
setupDropdownFilters();
