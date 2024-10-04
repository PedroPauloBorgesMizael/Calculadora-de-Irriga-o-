const camposDoFormulario = document.querySelectorAll("[required");
const formulario = document.querySelector("[data-formulario]");

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const listaRespostas = {
        "nome": e.target.elements["nome"].value,
        "email": e.target.elements["email"].value,
        "senha": e.target.elements["senha"].value,
        "confirmarSenha": e.target.elements["confirmarSenha"].value
    }

    localStorage.setItem("cadastro", JSON.stringify(listaRespostas));

    window.location.href = './login.html';
})

camposDoFormulario.forEach((campo) => {
    campo.addEventListener("blur", () => verificaCampo(campo));
    campo.addEventListener("invalid", evento => evento.preventDefault());
})

//define tipos de erros//
const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'tooShort'
]

//Mensagens personalizadas para todos os erros//
const mensagens = {
    nome: {
        valueMissing: "O campo de nome não pode estar vazio.",
        patternMismatch: "Por favor, preencha um nome válido.",
        tooShort: "Por favor, preencha um nome válido."
    },
    email: {
        valueMissing: "O campo de e-mail não pode estar vazio.",
        typeMismatch: "Por favor, preencha um email válido.",
        tooShort: "Por favor, preencha um e-mail válido."
    },
    senha: {
        valueMissing: 'O campo da senha não pode estar vazio.',
        patternMismatch: "Por favor, preencha uma senha válida.",
        tooShort: "O campo da senha não tem caractéres suficientes."
    },
    confirmarSenha: {
        valueMissing: 'O campo de confirmar senha não pode estar vazio.',
    },
    termos: {
        valueMissing: 'Você deve aceitar nossos termos antes de continuar.',
    }
}

function verificaCampo(campo) {
    let mensagem = "";
    campo.setCustomValidity('');
    tiposDeErro.forEach(erro => {
        if (campo.validity[erro]) {
            mensagem = mensagens[campo.name][erro];
        }
    })
    
    const validadorDeInput = campo.checkValidity();
    const mensagemErro = campo.parentNode.querySelector(".mensagem-erro");

    if(!validadorDeInput) {
        mensagemErro.textContent = mensagem;
    } else {
        mensagemErro.textContent = "";
    }
}

function verificarSenha() {
    const senha = document.querySelector("#senha");
    const confirmarSenha = document.querySelector("#confirmarSenha");

    if(senha !== confirmarSenha) {
        console.log("As senhas não podem ser diferentes!")
    }
}