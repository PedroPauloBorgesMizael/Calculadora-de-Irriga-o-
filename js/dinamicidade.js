const calculadoraBtn = document.querySelector('#calculadoraSecao')
const informacoesBtn = document.querySelector('#meteorologiaSecao')
const BdBtn = document.querySelector('#BDSecao')
const ajudaBtn = document.querySelector('#ajudaSecao')

const secaoCalculadora = document.querySelector('#hiddenPaginaPrincipal')
const secaoMeteorologia = document.querySelector('#hiddenMeteorologia')
const secaoBD = document.querySelector('#hiddenBD')
const secaoAjuda = document.querySelector('#hiddenAjuda')

const botoes = document.querySelectorAll('.cabecalho__item')
const secoes = document.querySelectorAll('.secaoOculta') 


function removerSelecao() {
    botoes.forEach(botao => botao.classList.remove('selecionado'))
}

function ocultarTodasSecoes() {
    secoes.forEach(secao => secao.hidden = true)
}

calculadoraBtn.addEventListener('click', () => {
    removerSelecao()
    ocultarTodasSecoes()
    calculadoraBtn.classList.add('selecionado')
    secaoCalculadora.hidden = false
})

informacoesBtn.addEventListener('click', () => {
    removerSelecao()
    ocultarTodasSecoes()
    informacoesBtn.classList.add('selecionado')
    secaoMeteorologia.hidden = false
})

BdBtn.addEventListener('click', () => {
    removerSelecao()
    ocultarTodasSecoes()
    BdBtn.classList.add('selecionado')
    secaoBD.hidden = false
})

ajudaBtn.addEventListener('click', () => {
    removerSelecao()
    ocultarTodasSecoes()
    ajudaBtn.classList.add('selecionado')
    secaoAjuda.hidden = false
})