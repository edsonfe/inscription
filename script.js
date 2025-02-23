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
        responsavelField.style.display = "block"; // Exibir o campo
    } else {
        responsavelField.required = false;
        responsavelField.style.display = "none"; // Ocultar o campo
        responsavelField.value = ""; // Limpar o campo caso seja ocultado
    }
});

function abrirModal() {
    document.getElementById("modalPagamento").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalPagamento").style.display = "none";
}

document.getElementById("registration-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let name = encodeURIComponent(document.getElementById("name").value);
    let phone = encodeURIComponent(document.getElementById("phone").value);
    let address = encodeURIComponent(document.getElementById("address").value);
    let cpf = encodeURIComponent(document.getElementById("cpf").value);
    let emergencyPhone = encodeURIComponent(document.getElementById("emergency-phone").value);
    let birthdate = encodeURIComponent(document.getElementById("birthdate").value);
    let responsavel = encodeURIComponent(document.getElementById("responsavel").value);

    let data = { name, phone, address, cpf, emergencyPhone, birthdate, responsavel };

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycbwNvr43hj6foNk9KUZ2fCJKSDehGgeLDRRRLcLAcL2SJmyhZxRGl7bAg4OyXPKrk4Yb/exec", {
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
    }
});
//Exibir área de inscrição
document.getElementById("link-inscricao").addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("modalPagamento").style.display = "none";
    document.getElementById("contato-container").style.display = "none";
    document.getElementById("inscricao-container").style.display = "block";
    window.location.hash = "#inscricao-container";
})

document.getElementById("link-contato").addEventListener("click", function (event) {
    document.getElementById("inscricao-container").style.display = "none";
    document.getElementById("modalPagamento").style.display = "none";
    document.getElementById("contato-container").style.display = "block";
    window.location.hash = "#contato-container"; // Rolar a página até o topo
});

// Ocultar a área e rolar ao topo ao clicar em "Home"
document.getElementById("link-home").addEventListener("click", function (event) {
    document.getElementById("inscricao-container", "modalPagamento").style.display = "none";
    document.getElementById("modalPagamento").style.display = "none";
    document.getElementById("contato-container").style.display = "none";
    window.location.hash = "#topo"; // Rolar a página até o topo
});