
const loggedIn = localStorage.getItem('myHealthLoggedIn');
if (!loggedIn) {
    window.location.href = "login.html";
}

let userData = JSON.parse(localStorage.getItem('currentUser'));


if (!userData) {
    console.error('Usuário não encontrado.');
    window.location.href = "login.html";
} else {
    
    console.log("Email do utilizador logado:", userData.email);
}


userData.consultas = userData.consultas || [];  
console.log("Consultas encontradas:", userData.consultas);
console.log("Dados do utilizador:", userData);


function Consulta(nome, telemovel, email, tipoConsulta, clinica, endereco, dataHora) {
    this.nome = nome;
    this.telemovel = telemovel;
    this.email = email;
    this.tipoConsulta = tipoConsulta; 
    this.clinica = clinica; 
    this.endereco = endereco;
    this.dataHora = dataHora;

    
    this.mapSrc = ko.computed(function () {
        var apiKey = 'AIzaSyCIv5R-tIpRUiQzMf_twvWyflZxld9D-MA'; 
        var encodedLocation = encodeURIComponent(this.clinica); 
        var mapLink = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedLocation}`;
        console.log("URL do mapa gerado:", mapLink);
        return mapLink;
    }, this);
}


var viewModel = {
    consultas: ko.observableArray(userData.consultas.filter(function (item) {
        return item.emailPaciente === userData.email;
    }).map(function (item) {
        return new Consulta(
            item.nomePaciente,
            item.telemovelPaciente,
            item.emailPaciente,
            item.tipoConsulta,
            item.nomeClinica,
            item.localClinica,
            `${item.dataConsulta} ${item.horaConsulta}`
        );
    })),

    
    consultaSelecionada: ko.observable(),

    
    abrirModal: function (consulta) {
        console.log("Abrindo modal para consulta:", consulta); 
        viewModel.consultaSelecionada(consulta); 
        document.getElementById('confirmationModal').style.display = 'flex'; 
    },

    
    fecharModal: function () {
        console.log("Fechando modal.");
        document.getElementById('confirmationModal').style.display = 'none'; 
    },

    
    cancelarMarcacao: function () {
        const consulta = viewModel.consultaSelecionada();
        console.log("Cancelando consulta:", consulta); 


        viewModel.consultas.remove(consulta);


        userData.consultas = ko.toJS(viewModel.consultas);
        localStorage.setItem('currentUser', JSON.stringify(userData));


        viewModel.fecharModal();

        alert("Consulta cancelada com sucesso.");
    }
};


document.getElementById('cancelButton').addEventListener('click', viewModel.fecharModal);
document.getElementById('confirmButton').addEventListener('click', viewModel.cancelarMarcacao);


ko.applyBindings(viewModel);
