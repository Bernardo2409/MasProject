
const loggedIn = localStorage.getItem('myHealthLoggedIn');
if (!loggedIn) {
  window.location.href = "login.html";
}
$(document).ready(function() {
    
    $('#dataConsulta').datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0,
    });

    
    $('#modalPagamento').hide();

    
    $('#mostrarOpcoes').click(function() {
        if (validarFormulario()) {
            var localSelecionado = $('#localConsulta').val();
            buscarCentrosDeSaude(localSelecionado);
        }
    });

    
    function validarFormulario() {
        var nome = $('#nome').val().trim();
        var telemovel = $('#telemovel').val().trim();
        var email = $('#email').val().trim();
        var dataConsulta = $('#dataConsulta').val().trim();
        var horaConsulta = $('#horaConsulta').val().trim();
        var localConsulta = $('#localConsulta').val().trim();
        var tipoConsulta = $('#tipoConsulta').val().trim();

        if (!nome || !telemovel.match(/^[0-9]{9}$/) || !email.match(/^\S+@\S+\.\S+$/) || !dataConsulta || !horaConsulta || !tipoConsulta) {
            alert("Por favor, preencha todos os campos corretamente.");
            return false;
        }
        return true;
    }

    
    function buscarCentrosDeSaude(cidade) {
        var service = new google.maps.places.PlacesService(document.createElement('div'));
        var coordenadas = {
            'Lisboa': { lat: 38.7169, lng: -9.1395 },
            'Porto': { lat: 41.1496, lng: -8.611 },
            'Aveiro': { lat: 40.6405, lng: -8.6538 }
        };

        var location = coordenadas[cidade];

        service.nearbySearch({
            location: new google.maps.LatLng(location.lat, location.lng),
            radius: 5000,
            type: ['hospital', 'doctor', 'health'],
            keyword: ['centro de saúde', 'clínica', 'saúde', 'consultório'],
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var locaisEncontrados = results.map(function(result) {
                    return '<li class="consulta-item" data-name="' + result.name +
                        '" data-local="' + result.vicinity +
                        '"><strong>Clínica:</strong> ' + result.name +
                        ' | <strong>Local:</strong> ' + result.vicinity + '</li>';
                });

                $('#listaConsultas').html(locaisEncontrados.join(''));
                $('#consultasDisponiveis').show();

                
                $('.consulta-item').click(function() {
                    mostrarDetalhesConsulta($(this));
                });
            } else {
                alert("Nenhum centro de saúde encontrado para a localização escolhida.");
                $('#consultasDisponiveis').hide();
            }
        });
    }

    

    var consultaDetalhes = {};

    function mostrarDetalhesConsulta(item) {
        var nomePaciente = $('#nome').val();
        var telemovelPaciente = $('#telemovel').val();
        var emailPaciente = $('#email').val();
        var dataConsulta = $('#dataConsulta').val();
        var horaConsulta = $('#horaConsulta').val();
        var localConsulta = $('#localConsulta').val();
        var tipoConsulta = $('#tipoConsulta').val();
        var nomeClinica = item.data('name');
        var localClinica = item.data('local');
        
        consultaDetalhes = {
            nomePaciente: nomePaciente,
            telemovelPaciente: telemovelPaciente,
            emailPaciente: emailPaciente,
            dataConsulta: dataConsulta,
            horaConsulta: horaConsulta,
            localConsulta: localConsulta,
            tipoConsulta: tipoConsulta,
            nomeClinica: nomeClinica,
            localClinica: localClinica
        };
        
        var googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(localClinica)}&output=embed`;
    
        
        var detalhesHtml = `
            <div id="detalhesConsulta" style="background-color: #e6f9e6; padding: 20px; border-radius: 10px; position: relative;">
                <!-- Título "Confirmar consulta" -->
                <h2 style="color: #28a745; text-align: center; position: absolute; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1;">
                    Confirmar consulta
                </h2>
    
                <!-- Div para os detalhes e mapa (Flexbox) -->
                <div style="display: flex; justify-content: space-between; margin-top: 60px;">
                    <!-- Div para os detalhes -->
                    <div style="flex: 1; padding-right: 20px;">
                        <p><strong>Nome do Paciente:</strong> ${nomePaciente}</p>
                        <p><strong>Telemóvel:</strong> ${telemovelPaciente}</p>
                        <p><strong>Email:</strong> ${emailPaciente}</p>
                        <p><strong>Data da Consulta:</strong> ${dataConsulta}</p>
                        <p><strong>Hora da Consulta:</strong> ${horaConsulta}</p>
                        <p><strong>Local:</strong> ${localConsulta}</p>
                        <p><strong>Tipo de Consulta:</strong> ${tipoConsulta}</p>
                        <p><strong>Clínica:</strong> ${nomeClinica}</p>
                        <p><strong>Endereço da Clínica:</strong> ${localClinica}</p>
    
                        <!-- Botões -->
                        <div>
                            <button id="cancelar" class="btn" style="background-color: #dc3545; color: white; margin-top: 20px; margin-right: 10px;">
                                Cancelar
                            </button>
                            <button id="confirmar" class="btn" style="background-color: #28a745; color: white; margin-top: 20px;">
                                Confirmar
                            </button>
                        </div>
                    </div>
    
                    <!-- Div para o mapa -->
                    <div style="flex: 1;">
                        <div style="margin-top: 20px; text-align: center;">
                            <!-- Adicionar o mapa do Google Maps -->
                            <iframe 
                                src="${googleMapsLink}"
                                width="100%" 
                                height="400" 
                                frameborder="0" 
                                style="border: 0;" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        
        $('#escolherLocal').html(detalhesHtml);
    
        
        $('#consultasDisponiveis').hide();
    
        
        $('#cancelar').click(function() {
            location.reload();
        });
    
        
        $('#confirmar').click(function() {
            $('#modalPagamento').fadeIn(); 
        });
    }
    
    
    $('#confirmarPagamento').click(function() {
        
        if (Object.keys(consultaDetalhes).length === 0) {
            alert("Por favor, selecione uma consulta antes de confirmar o pagamento.");
            return;
        }

        
        var currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

        
        if (!currentUser.consultas) {
            currentUser.consultas = [];
        }

        
        currentUser.consultas.push(consultaDetalhes);

        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert("Pagamento concluído com sucesso!");
        $('#modalPagamento').hide();
    });
    
    $('#fecharModal').click(function() {
        $('#modalPagamento').fadeOut();
    });

    
    $('#paypalBtn').click(function() {
        var campoHtml = `
            <label for="emailPayPal">Email (PayPal):</label>
            <input type="email" id="emailPayPal" class="form-control" placeholder="Digite seu email" required>
            <p id="erroPaypal" style="color: red; display: none;">Por favor, insira um email válido.</p>
        `;
        $('#campoPagamento').html(campoHtml);
    });

    $('#mbwayBtn').click(function() {
        var campoHtml = `
            <label for="telemovelMBWay">Nº Telemóvel (MBWay):</label>
            <input type="text" id="telemovelMBWay" class="form-control" placeholder="Digite o número de telemóvel" required>
            <p id="erroMBWay" style="color: red; display: none;">O número de telemóvel deve ter 9 dígitos.</p>
        `;
        $('#campoPagamento').html(campoHtml);
    });

    $('#cartaoBtn').click(function() {
        var campoHtml = `
            <label for="numeroCartao">Número do Cartão:</label>
            <input type="text" id="numeroCartao" class="form-control" placeholder="Digite o número do cartão" required>
            <p id="erroCartao" style="color: red; display: none;">O número do cartão deve ter no mínimo 12 dígitos.</p>
        `;
        $('#campoPagamento').html(campoHtml);
    });

    
    $('#fecharModal').click(function() {
        $('#modalPagamento').hide();
    });

    
    $('#confirmarPagamento').click(function() {
        var metodoPagamento = $('#campoPagamento').find('input').attr('id');
        var isValido = false;

        if (metodoPagamento === 'emailPayPal') {
            var email = $('#emailPayPal').val().trim();
            isValido = validarEmail(email);
            if (!isValido) {
                $('#erroPaypal').show();
            }
        } else if (metodoPagamento === 'telemovelMBWay') {
            var telemovel = $('#telemovelMBWay').val().trim();
            isValido = validarTelemovel(telemovel);
            if (!isValido) {
                $('#erroMBWay').show();
            }
        } else if (metodoPagamento === 'numeroCartao') {
            var numeroCartao = $('#numeroCartao').val().trim();
            isValido = validarCartao(numeroCartao);
            if (!isValido) {
                $('#erroCartao').show();
            }
        }

        if (isValido) {
            
            alert('Pagamento concluído com sucesso!');
            $('#modalPagamento').hide();
            location.reload();
        }
    });

    
    function validarEmail(email) {
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    
    function validarTelemovel(telemovel) {
        var regexTelemovel = /^[0-9]{9}$/;
        return regexTelemovel.test(telemovel);
    }

    
    function validarCartao(numeroCartao) {
        var regexCartao = /^[0-9]{12,}$/;
        return regexCartao.test(numeroCartao);
    }
});


function loadGoogleMapsScript() {
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCIv5R-tIpRUiQzMf_twvWyflZxld9D-MA&libraries=places&callback=initGoogleMaps";
    script.async = true;
    document.head.appendChild(script);
}

function initGoogleMaps() {
    console.log("Google Maps API Loaded");
}

loadGoogleMapsScript();