function converterParaJSON(response) {
    return response.json();
}

function processarDados(data) {
    const noticiasContainer = document.getElementById('noticia-container');
    noticiasContainer.innerHTML = '';

    if (data.items && data.items.length > 0) {
        const numeroNoticiasExibir = 3;
        for (let i = 0; i < numeroNoticiasExibir; i++) {
            const noticia = data.items[i];
            const titulo = noticia.titulo;
            const descricao = noticia.descricao;
            const dataPublicacao = new Date(noticia.data_publicacao).toLocaleDateString('pt-BR');

            const noticiaElemento = document.createElement('div');
            noticiaElemento.classList.add('noticia-item');

            const tituloElemento = document.createElement('h3');
            tituloElemento.textContent = titulo;

            const descricaoElemento = document.createElement('p');
            descricaoElemento.textContent = descricao;

            const dataPublicacaoElemento = document.createElement('p');
            dataPublicacaoElemento.textContent = `Data de publicação: ${dataPublicacao}`;

            noticiaElemento.appendChild(tituloElemento);
            noticiaElemento.appendChild(descricaoElemento);
            noticiaElemento.appendChild(dataPublicacaoElemento);

            noticiasContainer.appendChild(noticiaElemento);
        }
    } else {
        console.log('Nenhuma notícia encontrada.');
    }
}

function fetchIBGENoticias() {
    fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=release')
        .then(converterParaJSON) 
        .then(processarDados)   
        .catch(error => {
            console.error('Erro ao buscar notícias do IBGE:', error);
            const noticiasContainer = document.getElementById('noticia-container');
            noticiasContainer.textContent = 'Erro ao buscar notícias.';
        });
}

function salvarInteresse(interesse) {
    let interesses = JSON.parse(localStorage.getItem('meus-interesses')) || [];
    interesses.push(interesse);
    localStorage.setItem('meus-interesses', JSON.stringify(interesses));
}

function carregarInteresses() {
    const interesses = JSON.parse(localStorage.getItem('meus-interesses'));

    const lista = document.getElementById('lista-interesses');
    lista.innerHTML = ''; 

    if (interesses && interesses.length > 0) {
        interesses.forEach(interesse => {
            const li = document.createElement('li');
            li.textContent = interesse;
            lista.appendChild(li);
        });
    }
}

function limparInteresses() {
    localStorage.removeItem('meus-interesses');
    document.getElementById('lista-interesses').innerHTML = '';
}

function adicionarInteresse() {
    const novoInteresse = document.getElementById('novo-interesse').value;
    if (novoInteresse) {
        salvarInteresse(novoInteresse);
        document.getElementById('novo-interesse').value = '';
    }
}

window.onload = () => {
    carregarInteresses();
    fetchIBGENoticias();
    setInterval(carregarInteresses, 1000); 
};

document.getElementById('adicionar-interesse').addEventListener('click', adicionarInteresse);
document.getElementById('limpar-interesses').addEventListener('click', limparInteresses);
