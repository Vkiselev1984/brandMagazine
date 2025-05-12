export function setupRegistration() {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('registration-form');
        if (!form) return;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const firstName = document.getElementById('first-name');
            const lastName = document.getElementById('last-name');
            const gender = document.querySelector('input[name="gender"]:checked');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            if (!firstName || !lastName || !gender || !email || !password) return;
            const userData = {
                firstName: firstName.value,
                lastName: lastName.value,
                gender: gender.value,
                email: email.value,
                password: password.value
            };
            fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            })
                .then(async response => {
                    if (response.ok) {
                        const data = await response.text();
                        alert(data);
                        form.reset();
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
                .catch((error) => {
                    alert('Ошибка: ' + error.message);
                });
        });
    });
}
