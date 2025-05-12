export function setupCartPopup() {
    document.addEventListener('DOMContentLoaded', function () {
        const cartCount = document.querySelector('.cart__count');
        const cartItemsList = document.getElementById('cart-items');
        const popup = document.getElementById('popup');
        const productContainer = document.querySelector('.goods__list');

        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
            if (cartCount) cartCount.textContent = totalCount;
        }

        function openPopup(event) {
            if (event) event.preventDefault();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (popup && cartItemsList) {
                cartItemsList.innerHTML = '';
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
                        title: productItem.querySelector('.product__title').textContent,
                        price: productItem.querySelector('.product__price').textContent,
                        image: productItem.querySelector('.product__image').src,
                        description: productItem.querySelector('.product__description')?.textContent || '',
                        quantity: 1
                    };
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
            });
        }

        updateCartCount();
    });
}

export function renderCartPage() {
    document.addEventListener('DOMContentLoaded', function () {
        const cartItemsList = document.getElementById('cart-list');
        if (!cartItemsList) return;
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
    });
}
