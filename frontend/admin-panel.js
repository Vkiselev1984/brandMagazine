export function renderAdminPanel() {
    // Удаляем старую панель всегда, чтобы не было дублей
    const oldBar = document.querySelector('.admin-panel-bar');
    if (oldBar) oldBar.remove();
    // Получаем роль пользователя с сервера (а не из localStorage!)
    fetch('/api/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            if (data.role !== 'admin') return;

            // Создаём полоску админ-панели
            const adminBar = document.createElement('div');
            adminBar.className = 'admin-panel-bar';
            adminBar.innerHTML = `
                <button id="admin-add-product" class="admin-panel-btn">Товары</button>
                <button id="admin-users" class="admin-panel-btn">Пользователи</button>
                <button id="admin-mailings" class="admin-panel-btn">Рассылка</button>
                <button id="admin-profile" class="admin-panel-btn">Личный кабинет</button>
                <button id="admin-promotions" class="admin-panel-btn">Акции</button>
            `;
            // Вставляем внутри header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(adminBar);
            } else {
                document.body.insertBefore(adminBar, document.body.firstChild);
            }

            // Обработчики кнопок
            document.getElementById('admin-add-product').onclick = () => {
                window.open('http://localhost:3001/admin/table/products', '_blank');
            };
            document.getElementById('admin-users').onclick = () => {
                window.open('http://localhost:3001/admin/table/users', '_blank');
            };
            document.getElementById('admin-mailings').onclick = () => {
                window.open('http://localhost:3001/admin/table/mailings', '_blank');
            };
            document.getElementById('admin-profile').onclick = () => {
                window.open('http://localhost:3001/admin/table/user_profiles', '_blank');
            };
            document.getElementById('admin-promotions').onclick = () => {
                window.open('http://localhost:3001/admin/table/promotions', '_blank');
            };
        });
}


// Стили для админ-панели (можно вынести в CSS)
const style = document.createElement('style');
style.textContent = `
.admin-panel-bar {
    background: #222; color: #fff; padding: 10px 0; display: flex; gap: 20px; justify-content: center; align-items: center; z-index: 1000;
}
.admin-panel-btn {
    background: #f16d7f;
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.2s;
}
.admin-panel-btn:hover { background: #eee; }
`;
document.head.appendChild(style);
