export function setupCartPopup() {
    document.addEventListener('DOMContentLoaded', function () {
        const cartCount = document.querySelector('.cart__count');
        const cartItemsList = document.getElementById('cart-items');
        const popup = document.getElementById('popup');
        const productContainer = document.querySelector('.goods__list');

        function updateCartCount() {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                fetch('/api/cart', { credentials: 'include' })
                    .then(res => res.json())
                    .then(data => {
                        const cart = data.items || [];
                        const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
                        if (cartCount) cartCount.textContent = totalCount;
                    });
            } else {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
                if (cartCount) cartCount.textContent = totalCount;
            }
        }

        function openPopup(event) {
            if (event) event.preventDefault();
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (popup && cartItemsList) {
                cartItemsList.innerHTML = '';
                if (loggedInUser) {
                    // Авторизованный пользователь — корзина с сервера
                    fetch('/api/cart', { credentials: 'include' })
                        .then(res => res.json())
                        .then(data => {
                            const cart = data.items || [];
                            if (cart.length === 0) {
                                cartItemsList.innerHTML = '<li>Ваша корзина пуста.</li>';
                            } else {
                                cart.forEach(item => {
                                    const listItem = document.createElement('li');
                                    listItem.innerHTML = `
                                        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px;">
                                        <span>${item.title} (${item.quantity || 1})</span>
                                        <span>${item.price} руб.</span>
                                    `;
                                    cartItemsList.appendChild(listItem);
                                });
                            }
                            popup.style.display = 'block';
                        });
                } else {
                    // Неавторизованный — localStorage
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    if (cart.length === 0) {
                        cartItemsList.innerHTML = '<li>Ваша корзина пуста.</li>';
                    } else {
                        cart.forEach(item => {
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `
                                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px;">
                                <span>${item.title} (${item.quantity || 1})</span>
                                <span>${item.price} руб.</span>
                            `;
                            cartItemsList.appendChild(listItem);
                        });
                    }
                    popup.style.display = 'block';
                }
            }
        }

        updateCartCount();

        const cartIcon = document.querySelector('.nav__link--cart');
        if (cartIcon) {
            cartIcon.addEventListener('click', function (event) {
                openPopup(event);
            });
        }

        if (popup) {
            popup.addEventListener('click', function (event) {
                if (event.target === popup) {
                    popup.style.display = 'none';
                }
            });
        }

        const closeButton = document.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', function () {
                popup.style.display = 'none';
            });
        }

        if (productContainer) {
            productContainer.addEventListener('click', function (event) {
                if (event.target.classList.contains('product__add')) {
                    const productItem = event.target.closest('.goods__item');
                    const product = {
                        product_id: productItem.dataset.id,
                        title: productItem.querySelector('.product__title').textContent,
                        price: productItem.querySelector('.product__price').textContent,
                        image: productItem.querySelector('.product__image').src,
                        description: productItem.querySelector('.product__description')?.textContent || '',
                        quantity: 1
                    };
                    const loggedInUser = localStorage.getItem('loggedInUser');
                    if (loggedInUser) {
                        // Авторизован — отправляем на сервер
                        fetch('/api/cart/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(product),
                            credentials: 'include'
                        })
                        .then(res => {
                            if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);
                            return res.json();
                        })
                        .then(data => {
                            if (data.success) {
                                updateCartCount();
                                alert('Товар добавлен в корзину!');
                            } else {
                                alert('Ошибка добавления в корзину');
                            }
                        })
                        .catch(err => {
                            alert(err.message);
                        });
                    } else {
                        // Неавторизован — localStorage
                        const cart = JSON.parse(localStorage.getItem('cart')) || [];
                        const existingItem = cart.find(cartItem => cartItem.title === product.title);
                        if (existingItem) {
                            existingItem.quantity += 1;
                        } else {
                            cart.push(product);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartCount();
                    }
                }
            });
        }

        updateCartCount();
    });
}

export function renderCartPage() {
    document.addEventListener('DOMContentLoaded', function () {
        const cartItemsList = document.getElementById('cart-list');
        if (!cartItemsList) return;
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            fetch('/api/cart', { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    const cart = data.items || [];
                    cartItemsList.innerHTML = '';
                    if (!cart || cart.length === 0) {
                        cartItemsList.innerHTML = '<li class="empty">Ваша корзина пуста.</li>';
                    } else {
                        cart.forEach((item, idx) => {
                            cartItemsList.innerHTML += `
                                <li>
                                    <img src="${item.image}" alt="${item.title}">
                                    <div class="cart__item">
                                        <span class="cart__item-title">${item.title}</span>
                                        <span class="cart__item-desc">${item.description || ''}</span>
                                        <span class="cart__item-price">${item.price} руб.</span>
                                        <span class="cart__item-qty" style="font-weight:bold; color:#f16d7f;">
                                            x${item.quantity || 1}
                                            <button class="decrease-btn" data-id="${item.product_id}" title="Уменьшить количество">-</button>
                                        </span>
                                        <button class="remove-btn" data-id="${item.product_id}" title="Удалить товар">&times;</button>
                                    </div>
                                </li>
                            `;
                        });
                    }
                    // Очистка корзины (для авторизованных можно реализовать по желанию)
                    const clearBtn = document.querySelector('.cart__button');
                    if (clearBtn) {
                        clearBtn.onclick = () => {
                            alert('Очистка всей корзины реализуется отдельно');
                        };
                    }
                    // Продолжить покупки
                    const continueBtn = document.querySelectorAll('.cart__button')[1];
                    if (continueBtn) {
                        continueBtn.onclick = () => {
                            window.location.href = 'index.html';
                        };
                    }
                    // Делегирование событий для уменьшения и удаления
                    cartItemsList.addEventListener('click', function (e) {
                        const product_id = e.target.dataset.id;
                        if (e.target.classList.contains('remove-btn')) {
                            fetch('/api/cart/remove', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ product_id }),
                                credentials: 'include'
                            }).then(() => location.reload());
                        }
                        if (e.target.classList.contains('decrease-btn')) {
                            const item = cart.find(i => i.product_id == product_id);
                            if (item && item.quantity > 1) {
                                fetch('/api/cart/update', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ product_id, quantity: item.quantity - 1 }),
                                    credentials: 'include'
                                }).then(() => location.reload());
                            } else if (item) {
                                fetch('/api/cart/remove', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ product_id }),
                                    credentials: 'include'
                                }).then(() => location.reload());
                            }
                        }
                    });
                });
        } else {
            // Неавторизованный — localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cartItemsList.innerHTML = '';
            if (!cart || cart.length === 0) {
                cartItemsList.innerHTML = '<li class="empty">Ваша корзина пуста.</li>';
            } else {
                cart.forEach((item, idx) => {
                    cartItemsList.innerHTML += `
                        <li>
                            <img src="${item.image}" alt="${item.title}">
                            <div class="cart__item">
                                <span class="cart__item-title">${item.title}</span>
                                <span class="cart__item-desc">${item.description || ''}</span>
                                <span class="cart__item-price">${item.price} руб.</span>
                                <span class="cart__item-qty" style="font-weight:bold; color:#f16d7f;">
                                    x${item.quantity || 1}
                                    <button class="decrease-btn" data-idx="${idx}" title="Уменьшить количество">-</button>
                                </span>
                                <button class="remove-btn" data-idx="${idx}" title="Удалить товар">&times;</button>
                            </div>
                        </li>
                    `;
                });
            }
            // Очистка корзины
            const clearBtn = document.querySelector('.cart__button');
            if (clearBtn) {
                clearBtn.onclick = () => {
                    localStorage.removeItem('cart');
                    cartItemsList.innerHTML = '<li class="empty">Ваша корзина пуста.</li>';
                };
            }
            // Продолжить покупки
            const continueBtn = document.querySelectorAll('.cart__button')[1];
            if (continueBtn) {
                continueBtn.onclick = () => {
                    window.location.href = 'index.html';
                };
            }
            // Делегирование событий для уменьшения и удаления
            cartItemsList.addEventListener('click', function (e) {
                const idx = e.target.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (e.target.classList.contains('remove-btn')) {
                    cart.splice(idx, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    location.reload();
                }
                if (e.target.classList.contains('decrease-btn')) {
                    if (cart[idx].quantity > 1) {
                        cart[idx].quantity -= 1;
                    } else {
                        cart.splice(idx, 1);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    location.reload();
                }
            });
        }
    });
}
