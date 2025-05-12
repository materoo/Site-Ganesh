const createSobreTitle = (div, idioma) => {
  const h1 = document.createElement("h1");
  h1.id = "sobre-title";

  const text = document.createTextNode(
    idioma === "en-us" ? "About " : "Sobre o "
  );
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
  link.appendChild(
    document.createTextNode(idioma === "en-us" ? "Learn More" : "Saiba Mais")
  );

  div.appendChild(link);
};

async function carregarDados(idiomaAtual) {
  try {
    idiomaAtual = idiomaAtual === "en-us" ? "en-us" : "pt-br";
    const response = await fetch("/src/dados.json");
    const dados = await response.json();

    document.getElementById("grupo").textContent =
      dados.informacoes[idiomaAtual].grupo;
    document.getElementById("subtitulo").textContent =
      dados.informacoes[idiomaAtual].subtitulo;

    const sobreDiv = document.getElementById("sobre");
    sobreDiv.innerHTML = "";

    createSobreTitle(sobreDiv, idiomaAtual);

    dados.informacoes[idiomaAtual].sobre.forEach((paragrafo) => {
      const p = document.createElement("p");
      p.textContent = paragrafo;
      sobreDiv.appendChild(p);
    });

    createLearnMoreButton(sobreDiv, idiomaAtual);
  } catch (error) {
    console.error("Erro ao carregar o JSON", error);
  }
}

const changeLanguage = (newLanguage) => {
  document.getElementById("idioma-selecionado").textContent =
    newLanguage === "en-us" ? "en-US" : "pt-BR";
  document.querySelector("#bandeira-idioma").src = `img/${
    newLanguage === "en-us" ? "US.svg" : "BR.svg"
  }`;
  localStorage.setItem("idiomaSelecionado", newLanguage);
  carregarDados(newLanguage === "en-us" ? "en-us" : "pt-br");
};

document.addEventListener("DOMContentLoaded", () => {
  const idiomaSalvo = localStorage.getItem("idiomaSelecionado") || "pt-BR";
  document.querySelector("#idioma-selecionado").textContent =
    idiomaSalvo === "en-us" ? "en-US" : "pt-BR";
  document.querySelector("#bandeira-idioma").src = `img/${
    idiomaSalvo === "en-us" ? "US.svg" : "BR.svg"
  }`;

  carregarDados(idiomaSalvo === "en-us" ? "en-us" : "pt-br");
});

function toggleMenu() {
  const menu = document.getElementById("menuHamb");
  menu.classList.toggle("active");
}
