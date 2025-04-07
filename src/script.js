let idiomaAtual = "pt-br";

async function carregarDados() {
    try {
        const response = await fetch('dados.json');
        const dados = await response.json();

        document.getElementById('ganesh').textContent = dados.informacoes[idiomaAtual].grupo;
        document.getElementById('subtitulo').textContent = dados.informacoes[idiomaAtual].subtitulo;

        const sobreDiv = document.getElementById('sobre');
        sobreDiv.innerHTML = "";
        dados.informacoes[idiomaAtual].sobre.forEach(paragrafo => {
            const p = document.createElement('p');
            p.textContent = paragrafo;
            sobreDiv.appendChild(p);
        });

        document.getElementById('idiomaTexto').textContent = idiomaAtual === "pt-br" ? "en-US" : "pt-BR";

    } catch (error) {
        console.error("Erro ao carregar o JSON", error);
    }
}

function trocarIdioma() {
    idiomaAtual = idiomaAtual === "pt-br" ? "en-us" : "pt-br";
    carregarDados();
}

document.getElementById('trocarIdioma').addEventListener('click', (event) => {
    event.preventDefault();
    trocarIdioma();
});

carregarDados();


function toggleMenu(){
    const menu = document.getElementById('menuHamb');
    menu.classList.toggle('active');
}