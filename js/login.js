const form = document.getElementById('loginForm');
const erroMsg = document.getElementById('erroMsg');

// Ao submeter o login
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  
  const users = JSON.parse(localStorage.getItem('myHealthUsers')) || [];

  
  const userData = users.find(user => user.email === email);

  if (!userData) {
    erroMsg.textContent = "Conta não encontrada. Crie uma conta primeiro.";
    return;
  }

  
  if (userData.password === password) {
    if (userData.validated) {
      
      if (!userData.consultas) {
        userData.consultas = []; 
      }

      
      localStorage.setItem('myHealthLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(userData));

      window.location.href = "index.html"; 
    } else {
      erroMsg.innerHTML = 'Conta não validada. Crie uma conta primeiro. <br><a href="validation.html">Ir para a página de validação</a>';
    }
  } else {
    erroMsg.textContent = "Credenciais inválidas. Verifique o email e a password.";
  }
});


const clearUsersBtn = document.getElementById('clearUsersBtn');
clearUsersBtn.addEventListener('click', () => {
  
  localStorage.removeItem('myHealthUsers');
  localStorage.removeItem('currentUser');

  
  sucessoMsg.textContent = 'Todos os utilizadores foram apagados com sucesso!';
  erroMsg.textContent = '';
});


