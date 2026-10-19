document.documentElement.classList.add('js');

const botaoMenu = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', aberto);
});

menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
    });
});

// Destaca no menu a seção que está visível
const links = document.querySelectorAll('.nav a');
const secoes = document.querySelectorAll('main section[id]');

const observadorMenu = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            links.forEach((link) => {
                link.classList.toggle('ativo', link.getAttribute('href') === '#' + entrada.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

secoes.forEach((secao) => observadorMenu.observe(secao));

const observadorAnimacao = new IntersectionObserver((entradas, observador) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.revelar').forEach((elemento) => observadorAnimacao.observe(elemento));

const botaoTopo = document.getElementById('btn-topo');

window.addEventListener('scroll', () => {
    botaoTopo.classList.toggle('mostrar', window.scrollY > 400);
});

botaoTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const filtros = document.querySelectorAll('.filtro');
const cartoes = document.querySelectorAll('.card');

filtros.forEach((botao) => {
    botao.addEventListener('click', () => {
        filtros.forEach((outro) => {
            outro.classList.remove('ativo');
            outro.setAttribute('aria-pressed', 'false');
        });
        botao.classList.add('ativo');
        botao.setAttribute('aria-pressed', 'true');

        const categoria = botao.dataset.filtro;
        cartoes.forEach((cartao) => {
            cartao.hidden = categoria !== 'todas' && cartao.dataset.categoria !== categoria;
        });
    });
});

const janela = document.getElementById('lightbox');
const imagemGrande = janela.querySelector('img');

function ampliar(imagem) {
    imagemGrande.src = imagem.src;
    imagemGrande.alt = imagem.alt;
    janela.showModal();
}

document.querySelectorAll('[data-ampliar]').forEach((imagem) => {
    imagem.tabIndex = 0;
    imagem.addEventListener('click', () => ampliar(imagem));
    imagem.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') ampliar(imagem);
    });
});

janela.addEventListener('click', (evento) => {
    if (evento.target === janela || evento.target.classList.contains('fechar')) {
        janela.close();
    }
});

const formulario = document.getElementById('form-contato');
const campos = formulario.querySelectorAll('input, textarea');
const contador = document.getElementById('contador');
const estado = document.getElementById('form-status');

function validar(campo) {
    const valor = campo.value.trim();
    let erro = '';

    if (campo.name === 'nome' && valor.length < 3) {
        erro = 'Informe seu nome (mínimo de 3 caracteres).';
    } else if (campo.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        erro = 'Informe um e-mail válido.';
    } else if (campo.name === 'mensagem' && valor.length < 10) {
        erro = 'A mensagem deve ter pelo menos 10 caracteres.';
    }

    document.getElementById('erro-' + campo.name).textContent = erro;
    campo.classList.toggle('invalido', erro !== '');
    campo.setAttribute('aria-invalid', erro !== '');
    return erro === '';
}

campos.forEach((campo) => {
    campo.addEventListener('input', () => {
        if (campo.classList.contains('invalido')) validar(campo);
        if (campo.name === 'mensagem') contador.textContent = campo.value.length + '/500';
    });
    campo.addEventListener('blur', () => validar(campo));
});

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const resultados = Array.from(campos).map(validar);

    if (resultados.includes(false)) {
        estado.textContent = 'Corrija os campos destacados e tente novamente.';
        estado.className = 'form-status is-error';
        formulario.querySelector('.invalido').focus();
        return;
    }

    estado.textContent = 'Mensagem enviada com sucesso. Obrigado pelo contato!';
    estado.className = 'form-status is-ok';
    formulario.reset();
    contador.textContent = '0/500';
});

document.getElementById('btn-mensagem').addEventListener('click', () => {
    document.getElementById('demo').innerText = 'Muito obrigado pela sua visita!';
});

document.getElementById('ano').textContent = new Date().getFullYear();
