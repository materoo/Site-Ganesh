//TENTATIVA DE CRIAR AS LINHAS E COLUNAS COM 0s e 1s para o background
const numbers = document.getElementById('numbers');
if (numbers) {
    const columnCount = Math.floor(window.innerWidth / 20);
    const rowCount = Math.floor(window.innerHeight / 10);

    function getRandomChar() {
        return Math.random() > 0.5 ? '1' : '0';
    }

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.classList.add('column');
        column.style.animationDuration = `${Math.random() * 5 + 5}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;

        for (let j = 0; j < rowCount; j++) {
            const char = document.createElement('span');
            char.classList.add('char');
            char.textContent = getRandomChar();
            column.appendChild(char);
        }
        numbers.appendChild(column);
    }

    setInterval(() => {
        document.querySelectorAll('.char').forEach(char => {
            char.textContent = getRandomChar();
        });
    }, 200);
}


// Funções que criam conteúdo dinâmico na INDEX.HTML
const createSobreTitle = (div, idioma) => {
    const h1 = document.createElement("h1");
    h1.id = "sobre-title";
    const text = document.createTextNode(idioma === "en-us" ? "About " : "Sobre o ");
    const span = document.createElement("span");
    span.id = "ganesh-span";
    span.textContent = "Ganesh";
    h1.appendChild(text);
    h1.appendChild(span);
    div.appendChild(h1);
};

const createLearnMoreButton = (div, idioma) => {
    const link = document.createElement("a");
    link.className = "sobre-button";
    link.href = "#";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("class", "bi bi-search");
    svg.setAttribute("viewBox", "0 0 16 16");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
        "d",
        "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 " +
        "1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 " +
        "5.5 0 0 1 11 0"
    );
    svg.appendChild(path);
    link.appendChild(svg);
    link.appendChild(document.createTextNode(idioma === "en-us" ? "Learn More" : "Saiba Mais"));
    div.appendChild(link);
};


// ---- FUNÇÕES DE CARREGAMENTO DE DADOS ----

// função para carregar dados da página principal
async function carregarDados(idiomaAtual) {
    const grupoDiv = document.getElementById("grupo");
    const subtituloDiv = document.getElementById("subtitulo");
    const sobreDiv = document.getElementById("sobre");

    if (!grupoDiv && !subtituloDiv && !sobreDiv) return;

    try {
        const response = await fetch("/src/dados.json");
        const dados = await response.json();
        const idioma = idiomaAtual === "en-us" ? "en-us" : "pt-br";

        if (grupoDiv) grupoDiv.textContent = dados.informacoes[idioma].grupo;
        if (subtituloDiv) subtituloDiv.textContent = dados.informacoes[idioma].subtitulo;
        if (sobreDiv) {
            sobreDiv.innerHTML = "";
            createSobreTitle(sobreDiv, idioma);
            dados.informacoes[idioma].sobre.forEach((paragrafo) => {
                const p = document.createElement("p");
                p.textContent = paragrafo;
                sobreDiv.appendChild(p);
            });
            createLearnMoreButton(sobreDiv, idioma);
        }
    } catch (error) {
        console.error("Erro ao carregar dados da página principal:", error);
    }
}

// função para carregar TÍTULOS das páginas
async function carregarTitulos(idiomaAtual) {
    const tituloNoticias = document.getElementById("titulo-noticias");
    const navLinkNoticias = document.getElementById("nav-link-noticias");

     if (!tituloNoticias && !navLinkNoticias) return;

    try {
        const response = await fetch("/src/dados.json");
        const dados = await response.json();
        const idioma = idiomaAtual === "en-us" ? "en-us" : "pt-br";
        const textoNoticias = dados.titulos_pagina[idioma].noticias;

        if (tituloNoticias) {
            tituloNoticias.textContent = textoNoticias;
        }
        if (navLinkNoticias) {
            navLinkNoticias.textContent = textoNoticias;
        }
    } catch (error) {
        console.error("Erro ao carregar títulos:", error);
    }
}


// Função para carregar a LISTA DE NOTÍCIAS
let paginaAtual = 1;
const noticiasPorPagina = 5;

const carregarNoticias = async (idiomaAtual) => {
    const noticiasDiv = document.getElementById("noticias");
    if (!noticiasDiv) return; // Se a div de notícias não existe, não faz nada

    try {
        const response = await fetch("/src/dados.json");
        const dados = await response.json();
        const idioma = idiomaAtual === "en-us" ? "en-us" : "pt-br";
        const noticias = dados.noticias[idioma];

        noticiasDiv.innerHTML = "";

        const inicio = (paginaAtual - 1) * noticiasPorPagina;
        const fim = inicio + noticiasPorPagina;
        const noticiasPagina = noticias.slice(inicio, fim);

        noticiasPagina.forEach((noticia) => {
            const container = document.createElement("div");
            container.className = "noticia";
            const titulo = document.createElement("h2");
            titulo.textContent = noticia.titulo;
            const descricao = document.createElement("p");
            descricao.textContent = noticia.descricao;
            container.appendChild(titulo);
            container.appendChild(descricao);
            noticiasDiv.appendChild(container);
        });

        // Lógica de paginação
        const verMaisBtn = document.getElementById("ver-mais");
        const voltarBtn = document.getElementById("voltar");
        const paginaIndicador = document.getElementById("pagina");
        const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);

        paginaIndicador.textContent = `${paginaAtual}`;
        verMaisBtn.style.display = "inline-block";
        voltarBtn.style.display = "inline-block";

        verMaisBtn.disabled = fim >= noticias.length;
        voltarBtn.disabled = paginaAtual <= 1;

        verMaisBtn.onclick = () => {
            if (fim < noticias.length) {
                paginaAtual++;
                carregarNoticias(idioma);
            }
        };

        voltarBtn.onclick = () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                carregarNoticias(idioma);
            }
        };

    } catch (error) {
        console.error("Erro ao carregar notícias", error);
    }
};

// ---- FUNÇÕES DE INTERAÇÃO ----

const changeLanguage = (newLanguage) => {
    document.getElementById("idioma-selecionado").textContent = newLanguage === "en-us" ? "en-US" : "pt-BR";
    document.querySelector("#bandeira-idioma").src = `img/${newLanguage === "en-us" ? "US.svg" : "BR.svg"}`;
    localStorage.setItem("idiomaSelecionado", newLanguage);

    carregarDados(newLanguage);
    carregarNoticias(newLanguage);
    carregarTitulos(newLanguage); 
};

// Função para abrir/fechar o menu hambúrguer
function toggleMenu() {
    const menu = document.getElementById("menuHamb");
    menu.classList.toggle("active");
}

// ---- INICIALIZAÇÃO DA PÁGINA ----
document.addEventListener("DOMContentLoaded", () => {
    const idiomaSalvo = localStorage.getItem("idiomaSelecionado") || "pt-br";

    document.querySelector("#idioma-selecionado").textContent = idiomaSalvo === "en-us" ? "en-US" : "pt-BR";
    document.querySelector("#bandeira-idioma").src = `img/${idiomaSalvo === "en-us" ? "US.svg" : "BR.svg"}`;

    carregarDados(idiomaSalvo);
    carregarNoticias(idiomaSalvo);
    carregarTitulos(idiomaSalvo);
});