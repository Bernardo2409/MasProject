// Carregar os dados do utilizador logado
const loggedIn = localStorage.getItem('myHealthLoggedIn');
if (!loggedIn) {
    window.location.href = "login.html"; // Redireciona para o login se não estiver logado
}

let userData = JSON.parse(localStorage.getItem('currentUser'));

// Verifique se o utilizador foi encontrado
if (!userData) {
    console.error('Usuário não encontrado.');
    window.location.href = "login.html"; // Redireciona caso os dados do usuário não sejam encontrados
} else {
    // Exibir o email do usuário no console para depuração
    console.log("Email do utilizador logado:", userData.email);
}

// Inicializar consultas associadas ao utilizador logado
userData.consultas = userData.consultas || [];  // Se não existir, inicializa com um array vazio.
console.log("Consultas encontradas:", userData.consultas);
console.log("Dados do utilizador:", userData);

// Função para criar uma consulta (usada apenas para exibição com KnockoutJS)
function Consulta(nome, telemovel, email, tipoConsulta, clinica, endereco, dataHora) {
    this.nome = nome;
    this.telemovel = telemovel;
    this.email = email;
    this.tipoConsulta = tipoConsulta; // Atualizado para tipoConsulta
    this.clinica = clinica; // Atualizado para nomeClinica
    this.endereco = endereco; // Atualizado para localClinica
    this.dataHora = dataHora; // Combinação de dataConsulta e horaConsulta

    // Computar o link do Google Maps para cada centro hospitalar
    this.mapSrc = ko.computed(function () {
        var apiKey = 'AIzaSyCIv5R-tIpRUiQzMf_twvWyflZxld9D-MA'; // Substitua pela chave válida
        var encodedLocation = encodeURIComponent(this.clinica); // Usando o nome da clínica
        var mapLink = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedLocation}`;
        console.log("URL do mapa gerado:", mapLink); // Verifique se o URL do mapa está correto
        return mapLink;
    }, this);
}

// Filtrar as consultas do usuário logado (somente as consultas com o email do usuário)
var viewModel = {
    consultas: ko.observableArray(userData.consultas.filter(function (item) {
        return item.emailPaciente === userData.email; // Filtra as consultas pelo email do usuário
    }).map(function (item) {
        return new Consulta(
            item.nomePaciente,
            item.telemovelPaciente,
            item.emailPaciente,
            item.tipoConsulta,
            item.nomeClinica,
            item.localClinica,
            item.dataConsulta + ' ' + item.horaConsulta // Combina data e hora
        );
    })),

    showConfirmModal: ko.observable(false),
    consultaParaExcluir: ko.observable(null), // Variável observável para armazenar a consulta selecionada

    limparConsultas: function () {
        if (confirm('Tem certeza de que deseja limpar todas as consultas? Isso não pode ser desfeito.')) {
            userData.consultas = []; // Remove todas as consultas de userData (memória)
            localStorage.setItem('currentUser', JSON.stringify(userData)); // Atualiza o localStorage com a mudança
            viewModel.consultas([]); // Limpa o observableArray do KnockoutJS
            alert('Todas as consultas foram apagadas.');
        }
    },

    // Função para confirmar a exclusão da consulta
    confirmarExclusao: function () {
        var consulta = viewModel.consultaParaExcluir(); // Obtém a consulta selecionada
        if (consulta) {
            // Remove a consulta do array consultas no currentUser (memória)
            userData.consultas = userData.consultas.filter(function(item) {
                return !(item.emailPaciente === consulta.email &&
                         item.dataConsulta === consulta.dataConsulta &&
                         item.horaConsulta === consulta.horaConsulta);
            });

            // Atualiza o localStorage com a nova lista de consultas
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Atualiza a lista de consultas no viewModel
        viewModel.consultas(viewModel.consultas().filter(function(item) {
            return !(item.email === consulta.email &&
                     item.dataConsulta === consulta.dataConsulta &&
                     item.horaConsulta === consulta.horaConsulta);
        }));

        alert('Consulta apagada com sucesso.');
    }

        // Fecha o modal de confirmação
        var confirmModal = document.getElementById('confirmModal');
        confirmModal.style.display = 'none';
    },

    // Função para definir a consulta a ser excluída
    setConsultaParaExcluir: function(consulta) {
        viewModel.consultaParaExcluir(consulta);
        viewModel.showConfirmModal(true); // Exibe o modal de confirmação
    },

    cancelarExclusao: function() {
        // Lógica para cancelar a exclusão, por exemplo, fechar o modal
        var confirmModal = document.getElementById('confirmModal');
        confirmModal.style.display = 'none'; // Fecha o modal
        console.log("Exclusão cancelada.");
    }
};

// Aplicar os Knockout Bindings
ko.applyBindings(viewModel);
