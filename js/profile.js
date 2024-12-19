const loggedIn = localStorage.getItem('myHealthLoggedIn');
if (!loggedIn) {
    window.location.href = "login.html";
}

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem('myHealthUsers')) || [];

if (!currentUser) {
    window.location.href = "login.html";
} else {
    const userData = users.find(user => user.email === currentUser.email);

    if (!userData) {
        window.location.href = "login.html";
    } else {
        document.getElementById('nome').value = userData.nome || "";
        document.getElementById('email').value = userData.email || "";
        document.getElementById('ntele').value = userData.ntele || "";
        document.getElementById('nns').value = userData.nns || "";
        document.getElementById('morada').value = userData.morada || "";
        document.getElementById('contribuinte').value = userData.contribuinte || "";
    }
}

const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // Obter os valores do formulário
    const nome = document.getElementById('nome').value.trim() || "";
    const email = document.getElementById('email').value.trim() || "";
    const ntele = document.getElementById('ntele').value.trim() || "";
    const nns = document.getElementById('nns').value.trim() || "";
    const morada = document.getElementById('morada').value.trim() || "";
    const contribuinte = document.getElementById('contribuinte').value.trim() || "";

    // Validações
    if (!/^\d{9}$/.test(ntele)) {
        alert("O número de telemóvel deve conter exatamente 9 dígitos.");
        return;
    }

    if (morada.split(' ').length < 2) {
        alert("A morada deve conter pelo menos duas palavras.");
        return;
    }

    if (!/^\d{9}$/.test(contribuinte)) {
        alert("O número de contribuinte deve conter exatamente 9 dígitos.");
        return;
    }

    // Atualizar os dados do utilizador
    const userData = users.find(user => user.email === currentUser.email);

    userData.nome = nome;
    userData.email = email;
    userData.ntele = ntele;
    userData.nns = nns;
    userData.morada = morada;
    userData.contribuinte = contribuinte;

    // Atualizar o localStorage
    localStorage.setItem('myHealthUsers', JSON.stringify(users));

    alert('Perfil atualizado com sucesso!');
});

// Logout
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('myHealthLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = "login.html";
});
