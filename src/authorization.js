export function setupAuthorization() {
    document.addEventListener('DOMContentLoaded', function () {
        const openAuthPopupButton = document.getElementById('open-auth-popup');
        const authPopup = document.getElementById('auth-popup');
        const authForm = document.getElementById('auth-form');
        const userInfo = document.getElementById('user-info');
        const usernameDisplay = document.getElementById('username');
        const closePopupButton = document.getElementById('close-popup');
        const logoutButton = document.getElementById('logout-button');

        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            userInfo.style.display = 'block';
            usernameDisplay.textContent = user.firstName;
            authForm.style.display = 'none';
        } else {
            authForm.style.display = 'block';
            userInfo.style.display = 'none';
        }

        if (openAuthPopupButton && authPopup) {
            openAuthPopupButton.addEventListener('click', function () {
                authPopup.style.display = 'block';
            });
        }

        if (authForm) {
            authForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const email = this[0].value;
                const password = this[1].value;
                fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })
                    .then(async response => {
                        if (response.ok) {
                            const user = await response.json();
                            alert('Login successful!');
                            localStorage.setItem('loggedInUser', JSON.stringify(user));
                            if (user.role) {
                                localStorage.setItem('userRole', user.role);
                            } else {
                                localStorage.removeItem('userRole');
                            }
                            // Для совместимости: сохраняем userRole отдельно и в loggedInUser
                            let loggedUser = user;
                            loggedUser.userRole = user.role;
                            localStorage.setItem('loggedInUser', JSON.stringify(loggedUser));
                            authPopup.style.display = 'none';
                            authForm.style.display = 'none';
                            userInfo.style.display = 'block';
                            usernameDisplay.textContent = user.firstName;
                            // Синхронизация корзины
const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
if (localCart.length > 0) {
    fetch('/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: localCart })
    }).then(() => {
        localStorage.removeItem('cart');
        window.location.reload();
    });
} else {
    window.location.reload();
} // Чтобы отобразить админ-панель
                        } else if (response.status === 400) {
                            const result = await response.json();
                            if (result.errors) {
                                alert(result.errors.map(e => e.msg).join('\n'));
                            } else {
                                alert('Ошибка валидации');
                            }
                        } else {
                            const text = await response.text();
                            alert(text);
                        }
                    })
                    .catch(error => {
                        alert('Ошибка: ' + error.message);
                    });
            });
        }

        if (closePopupButton) {
            closePopupButton.addEventListener('click', function () {
                authPopup.style.display = 'none';
            });
        }

        window.addEventListener('click', function (event) {
            if (event.target === authPopup) {
                authPopup.style.display = 'none';
            }
        });

        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('userRole');
                authForm.style.display = 'block';
                userInfo.style.display = 'none';
            });
        }
    });
}
