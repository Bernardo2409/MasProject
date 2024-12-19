// Função para tocar áudio
let audio1 = new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/clickUp.mp3");

function playAudio(url) {
  let audio = new Audio(url);
  audio.load();
  audio.play();
}

// Função para atualizar o nome do usuário
// Função para atualizar o nome do usuário
function updateUserName() {
  // Recupera o valor de `currentUser` do localStorage
  const userDataRaw = localStorage.getItem("currentUser");
  let userData = null;

  // Faz o parse seguro para JSON e captura erros
  if (userDataRaw) {
    try {
      userData = JSON.parse(userDataRaw);
    } catch (error) {
      console.error("Erro ao fazer parse dos dados do localStorage:", error);
    }
  }

  // Seleciona o elemento HTML onde o nome será exibido
  const userNameElement = document.getElementById("userName");

  // Atualiza o conteúdo do elemento com o nome do usuário ou "Usuário" como fallback
  if (userNameElement) {
    if (userData && userData.nome) {
      userNameElement.textContent = userData.nome; // Exibe o nome
    } else {
      userNameElement.textContent = "Usuário"; // Fallback caso o nome não esteja disponível
    }
  } else {
    console.error("Elemento com id 'userName' não encontrado no DOM.");
  }
}

// Certifique-se de que essa função é chamada após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  updateUserName(); // Atualiza o nome quando a página for carregada
});


// Função para abrir o chat
function chatOpen() {
  const helloMessage = document.getElementById("hello-message");
  if (helloMessage) {
    helloMessage.style.display = "none"; // Remove a mensagem "Olá, Usuário!"
  }
  document.getElementById("chat-open").style.display = "none";
  document.getElementById("chat-close").style.display = "block";
  document.getElementById("chat-window1").style.display = "block";
  playAudio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/clickUp.mp3");

  updateUserName(); // Atualiza o nome do usuário ao abrir o chat
}

// Função para abrir uma conversa dentro do chat
function openConversation() {
  document.getElementById("chat-window2").style.display = "block";
  document.getElementById("chat-window1").style.display = "none";
  playAudio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/clickUp.mp3");

  updateUserName(); // Atualiza o nome do usuário ao abrir outra janela
}

// Atualiza o nome do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  updateUserName(); // Atualiza o nome quando a página for carregada
});

// Função para fechar o chat
function chatClose() {
  document.getElementById("chat-open").style.display = "block";
  document.getElementById("chat-close").style.display = "none";
  document.getElementById("chat-window1").style.display = "none";
  document.getElementById("chat-window2").style.display = "none";
  playAudio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/clickUp.mp3");
}

// Função de resposta do usuário
function userResponse() {
  const userText = document.getElementById("textInput").value.trim();

  if (userText === "") {
    alert("Por favor, escreva algo!");
    return;
  }

  playAudio("https://prodigits.co.uk/content/ringtones/tone/2020/alert/preview/4331e9c25345461.mp3");
  addMessageToChat(userText, "user");
  document.getElementById("textInput").value = "";

  // Simula a resposta do admin após 1 segundo
  setTimeout(() => adminResponse(userText), 1000);
}

// Função para adicionar mensagens ao chat
function addMessageToChat(message, sender) {
  const chatBox = document.getElementById("messageBox");
  const messageDiv = document.createElement("div");

  messageDiv.className = sender === "user" ? "first-chat" : "second-chat";
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
}

// Função para resposta do admin via OpenAI API
async function adminResponse(userPrompt) {
  const BASE_URL = "https://api.openai.com/v1/chat/completions"; // Endpoint correto
  const API_TOKEN = "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";

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Você é um assistente útil no site português de agendamento de consultas médicas. Não te esqueças que o site é português de Portugal, logo tenta dizer as coisas de maneira mais certa possível. Também dás conselhos de clinicas e de médicos ao utilizador" },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Obter detalhes do erro
      throw new Error(`Erro na API: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    const adminMessage = data.choices[0].message.content;
    addMessageToChat(adminMessage, "admin");
  } catch (error) {
    console.error("Erro ao buscar resposta da API:", error);
    addMessageToChat("Desculpe, algo deu errado. Por favor, tente novamente mais tarde.", "admin");
  }
}

// Envia a mensagem ao pressionar Enter
document.getElementById("textInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    userResponse();
  }
});
