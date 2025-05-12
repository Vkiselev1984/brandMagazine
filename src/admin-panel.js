export function renderAdminPanel() {
    // Проверяем роль пользователя
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') return;

    // Создаём полоску админ-панели
    const adminBar = document.createElement('div');
    adminBar.className = 'admin-panel-bar';
    adminBar.innerHTML = `
        <button id="admin-add-product" class="admin-panel-btn">Добавить товар</button>
        <button id="admin-users" class="admin-panel-btn">Пользователи</button>
    `;
    // Вставляем внутри header
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(adminBar); // Добавляем adminBar в конец header
    } else {
        document.body.insertBefore(adminBar, document.body.firstChild); // Если header не найден, добавляем в начало body
    }

    // Обработчики кнопок
    document.getElementById('admin-add-product').onclick = () => {
        window.location.href = '/edit-product.html';
    };
    document.getElementById('admin-users').onclick = () => {
        window.location.href = '/users.html';
    };
}

// Стили для админ-панели (можно вынести в CSS)
const style = document.createElement('style');
style.textContent = `
.admin-panel-bar {
    background: #222; color: #fff; padding: 10px 0; display: flex; gap: 20px; justify-content: center; align-items: center; z-index: 1000;
}
.admin-panel-btn {
    background: #fff; color: #222; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s;
}
.admin-panel-btn:hover { background: #eee; }
`;
document.head.appendChild(style);
