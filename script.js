
function toggleDisplay(elementId, displayStyle) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = displayStyle;
    } else {
        console.error(`Elemento com ID ${elementId} não encontrado.`);
    }
}
// Lista de contatos
const contatos = [
    { nome: "Mateus", link: "https://wa.me/559891386692" },
    { nome: "Leila", link: "https://wa.me/5598985182439" }
];

// Função para preencher as listas de contatos
function preencherContatos() {
    const listas = document.querySelectorAll(".contatos-lista");
    listas.forEach(lista => {
        lista.innerHTML = ""; // Limpa o conteúdo existente
        contatos.forEach(contato => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = contato.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = contato.nome;
            item.appendChild(link);
            lista.appendChild(item);
        });
    });
}

// Preenche os contatos ao carregar a página
document.addEventListener("DOMContentLoaded", preencherContatos);

document.getElementById("birthdate").addEventListener("input", function () {
    let birthDate = new Date(this.value);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Caso a pessoa ainda não tenha feito aniversário no ano atual
    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
        age--;
    }

    let responsavelField = document.getElementById("responsavel");
    
    if (age < 18) {
        responsavelField.required = true;
        responsavelField.style.display = "block"; 
    } else {
        responsavelField.required = false;
        responsavelField.style.display = "none"; 
        responsavelField.value = "";
    }
});

function abrirModal() {
    document.body.classList.add("modal-open");
    toggleDisplay("modalPagamento","flex");
}

function fecharModal() {
    document.body.classList.remove("modal-open");
    toggleDisplay("modalPagamento", "none");
}


// Spinner de carregamento
function showSpinner() {
    let spinner = document.createElement("div");
    spinner.id = "spinner";
    spinner.style.cssText = `
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);
        border: 4px solid rgba(0,0,0,0.1);
        border-top: 4px solid #007BFF;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    `;
    document.body.appendChild(spinner);
}

function hideSpinner() {
    let spinner = document.getElementById("spinner");
    if (spinner) spinner.remove();
}

document.getElementById("registration-form").addEventListener("submit", async function (event) {
    
    let name = encodeURIComponent(document.getElementById("name").value);
    let phone = encodeURIComponent(document.getElementById("phone").value);

    let cpf = document.getElementById("cpf").value;

    if (cpf.length !== 11){
        alert("SEU CPF DEVE CONTER APENAS 11 DÍGITOS SEM PONTOS OU TRAÇOS.");
        event.preventDefault();
        return;
    }
    

    let address = encodeURIComponent(document.getElementById("address").value);
    let emergencyPhone = encodeURIComponent(document.getElementById("emergency-phone").value);
    let birthdate = encodeURIComponent(document.getElementById("birthdate").value);
    let responsavel = encodeURIComponent(document.getElementById("responsavel").value);

    let data = { name, phone, address, cpf, emergencyPhone, birthdate, responsavel };

    showSpinner();

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwOPnUl6VVP-FeLYqZtBAfqzhSJ4n8q8o6skzzTTDqHiGMmY_eaLLqErG0t9z3k6eZO/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            mode: "no-cors"
        });

        alert("Dados enviados com sucesso!");
        event.target.reset();

        abrirModal();

    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        alert("Erro ao salvar os dados. Verifique a conexão.");
    } finally {
        hideSpinner();
    }
});


async function carregarInscritos() {
    const listaNomes = document.querySelector("#nomes-ul");
    listaNomes.innerHTML = "<li>Carregando...</li>";

    try {
        // Faz a requisição ao Apps Script
        const response = await fetch("https://script.google.com/macros/s/AKfycbwOPnUl6VVP-FeLYqZtBAfqzhSJ4n8q8o6skzzTTDqHiGMmY_eaLLqErG0t9z3k6eZO/exec"); 
        const inscritos = await response.json();

        if (inscritos.error) {
            console.error("Erro do servidor:", inscritos.error);
            alert("Erro ao carregar os nomes: " + inscritos.error);
            listaNomes.innerHTML = "<li>Erro ao carregar os nomes.</li>";
            return;
        }

        // Preenche a lista de nomes
        listaNomes.innerHTML = ""; // Limpa a lista
        inscritos.forEach(inscrito => {
            const li = document.createElement("li");
            li.textContent = inscrito["Nome Completo"] || "Nome não informado";
            li.style.cursor = "pointer";
            li.addEventListener("click", function () {
                mostrarDetalhes(inscrito);
            });

            listaNomes.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao buscar os dados. Verifique a conexão ou tente novamente.");
        listaNomes.innerHTML = "<li>Erro ao buscar os nomes.</li>";
    }
}

// Função para mostrar os detalhes do inscrito
function mostrarDetalhes(inscrito) {
    
    document.getElementById("detalhe-nome").textContent = inscrito["Nome Completo"] || "Não informado";
    document.getElementById("detalhe-telefone").textContent = inscrito["Telefone"] || "Não informado";
    document.getElementById("detalhe-endereco").textContent = inscrito["Endereço"] || "Não informado";
    document.getElementById("detalhe-emergency-phone").textContent = inscrito["Tel. Emergência"] || "Não informado";

    document.getElementById("input-pagamento").value = inscrito["Pagamento"] || "";
    document.getElementById("input-alimento").value = inscrito["Alimento"] || "";
    document.getElementById("input-observacao").value = inscrito["Observação"] || "";

    toggleDisplay("lista-nomes", "none");
    toggleDisplay("detalhes-inscrito", "block");
}

document.getElementById("voltar-lista").addEventListener("click", function () {
    toggleDisplay("lista-nomes","block");
    toggleDisplay("detalhes-inscrito","none");

});

// Salvar os detalhes adicionais
document.getElementById("salvar-detalhes").addEventListener("click", async function () {
    const dadosAtualizados = {
        "Nome Completo": document.getElementById("detalhe-nome").textContent, // Nome fixo
        "Pagamento": document.getElementById("input-pagamento").value,
        "Alimento": document.getElementById("input-alimento").value,
        "Observação": document.getElementById("input-observacao").value
    };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwOPnUl6VVP-FeLYqZtBAfqzhSJ4n8q8o6skzzTTDqHiGMmY_eaLLqErG0t9z3k6eZO/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados),
            mode: "no-cors"
        });

        const resultado = await response;
        if (resultado.error) {
            alert("Erro ao salvar: " + resultado.error);
        } else {
            alert("Dados salvos com sucesso!");
        }
    } catch (error) {
        alert("Erro ao comunicar com o servidor: " + error.message);
    }
});

document.getElementById("voltar-lista").addEventListener("click", function () {
    toggleDisplay("detalhes-inscrito", "none");
});


// Verificar se está autenticado e exibir a área correta
function autenticarAcesso() {
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true";
    console.log(`Autenticação: ${isAuthenticated}`);

    if (isAuthenticated) {
        // Exibir área admin e esconder login
        toggleDisplay("login-section", "none");
        toggleDisplay("admin-section", "block");

    } else {
        // Mostrar apenas a área de login
        toggleDisplay("login-section", "block");
        toggleDisplay("admin-section", "none");

    }
}

// Executar a verificação ao tentar acessar o container admin
document.getElementById("link-adm").addEventListener("click", function (event) {
    event.preventDefault();

    toggleDisplay("adm-container", "block");
    autenticarAcesso(); // Verifica se o login foi feito
});

// Lógica do formulário de login
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    toggleDisplay("login-error", "none");

    try {
        // Envia a requisição ao Netlify Function
        const response = await fetch("/.netlify/functions/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // Autenticação bem-sucedida
                sessionStorage.setItem("authenticated", "true"); 
                alert("Login realizado com sucesso!");
                toggleDisplay("login-section", "none");
                toggleDisplay("admin-section", "block");
            } else {
                // Falha na autenticação
                toggleDisplay("login-error", "block");
            }
        } else {
            throw new Error("Erro na comunicação com o servidor.");
        }
        console.log(await response.json()); // Exibe a resposta no console
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um problema ao validar suas credenciais. Tente novamente.");
    }
});


document.getElementById("logout").addEventListener("click", function () {
    sessionStorage.removeItem("authenticated"); // Remove autenticação
    toggleDisplay("login-section", "block");
    toggleDisplay("admin-section", "none");
    alert("Você foi desconectado.");
});

document.getElementById("link-adm").addEventListener("click", function (event) {
    event.preventDefault();
    toggleDisplay("modalPagamento", "none");
    toggleDisplay("contato-container", "none");
    toggleDisplay("inscricao-container", "none");
    toggleDisplay("adm-container", "block");

    carregarInscritos(); // Carrega a lista de nomes
    window.location.hash = "#adm-container";
});


document.getElementById("link-inscricao").addEventListener("click", function(event) {
    event.preventDefault();
   
    toggleDisplay("modalPagamento", "none");
    toggleDisplay("contato-container", "none");
    toggleDisplay("inscricao-container", "block");
    toggleDisplay("adm-container", "none");

    window.location.hash = "#inscricao-container";
})

document.getElementById("link-contato").addEventListener("click", function(event) {
    event.preventDefault();
    toggleDisplay("modalPagamento", "none");
    toggleDisplay("contato-container", "block");
    toggleDisplay("inscricao-container", "none");
    toggleDisplay("adm-container", "none");
    
    window.location.hash = "#contato-container";
});

document.getElementById("link-home").addEventListener("click", function(event) {
    event.preventDefault();
    toggleDisplay("modalPagamento", "none");
    toggleDisplay("contato-container", "none");
    toggleDisplay("inscricao-container", "none");
    toggleDisplay("adm-container", "none");

    window.location.hash = "#topo";
});
