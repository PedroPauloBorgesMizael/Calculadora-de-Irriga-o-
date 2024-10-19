document.querySelector(".form__container.entrar form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.querySelector("input[type='email']").value;
    const senha = document.querySelector("input[type='password']").value;
    
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, senha: senha }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

document.querySelector(".form__container.registrar form").addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.querySelector("input[type='text']").value;
    const email = document.querySelector("input[type='email']").value;
    const senha = document.querySelector("input[type='password']").value;
    
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nome, email: email, senha: senha }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});