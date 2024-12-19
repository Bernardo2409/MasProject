document.addEventListener("DOMContentLoaded", () => {
    console.log("Carregando dados do usuário...");

    
    const userDataRaw = localStorage.getItem("currentUser");
    console.log("Dados brutos do localStorage:", userDataRaw);

    let userData = null;

    if (userDataRaw) {
        try {
            userData = JSON.parse(userDataRaw);
            console.log("Dados do usuário após parse:", userData);
        } catch (error) {
            console.error("Erro ao fazer parse dos dados do localStorage:", error);
        }
    } else {
        console.warn("Nenhum dado encontrado no localStorage para 'currentUser'.");
    }

    
    const userNameElement = document.getElementById("nome");
    console.log("Elemento userName encontrado:", userNameElement);

    
    if (userNameElement) {
        if (userData && userData.nome) {
            console.log("Nome do usuário encontrado:", userData.nome);
            userNameElement.textContent = userData.nome; 
        } else {
            console.warn("Propriedade 'nome' não encontrada em 'userData'. Usando valor padrão.");
            userNameElement.textContent = "Usuário"; 
        }
    } else {
        console.error("Elemento 'userName' não foi encontrado no DOM.");
    }
});