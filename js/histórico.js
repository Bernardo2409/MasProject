const loggedIn = localStorage.getItem('myHealthLoggedIn');
if (!loggedIn) {
  window.location.href = "login.html";
}
const currentUser = "currentUser"; 

        
        if (!localStorage.getItem(currentUser)) {
            localStorage.setItem(currentUser, JSON.stringify({}));
        }

        const fileInputs = document.querySelectorAll('.fileInput');

        fileInputs.forEach(input => {
            input.addEventListener('change', event => {
                const rowClass = event.target.dataset.row; 
                const row = document.querySelector(`.${rowClass}`); 

                
                const data = row.children[0].textContent;
                const local = row.children[1].textContent;
                const especialidade = row.children[2].textContent;
                const medico = row.children[3].textContent;

                
                const file = event.target.files[0];
                if (!file) {
                    alert("Nenhum ficheiro foi selecionado.");
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileContent = e.target.result;

                    
                    const newEntry = {
                        data,
                        local,
                        especialidade,
                        medico,
                        fileName: file.name,
                        fileContent
                    };

                    
                    let storedData = JSON.parse(localStorage.getItem(currentUser)) || {};

                    
                    storedData[rowClass] = newEntry;

                    
                    try {
                        localStorage.setItem(currentUser, JSON.stringify(storedData));
                        alert(`Ficheiro "${file.name}" adicionado à consulta de ${especialidade} em ${local}.`);
                    } catch (error) {
                        console.error("Erro ao salvar no localStorage:", error);
                        alert("Erro ao salvar o ficheiro. Verifique o tamanho do ficheiro ou o espaço disponível.");
                    }
                };

                reader.readAsDataURL(file);
            });
        });

        
        window.addEventListener('load', () => {
            const storedData = JSON.parse(localStorage.getItem(currentUser)) || {};

            Object.entries(storedData).forEach(([rowClass, fileData]) => {
                const row = document.querySelector(`.${rowClass}`);
                if (row) {
                    const cell = document.createElement('td');
                    const link = document.createElement('a');
                    link.href = fileData.fileContent; 
                    link.textContent = `Abrir ${fileData.fileName}`;
                    link.target = "_blank"; 
                    cell.appendChild(link);
                    row.appendChild(cell);
                }
            });
        });