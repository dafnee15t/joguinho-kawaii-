// ==============================
// CONFIGURAÇÕES DO JOGO
// ==============================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ==============================
// CHÃO
// ==============================

const chaoY = 250;


// ==============================
// DINOSSAURO
// ==============================

let dinossauroX = 100;
let dinossauroY = chaoY - 50;

const dinossauroLargura = 40;
const dinossauroAltura = 50;


// ==============================
// PULO
// ==============================

let velocidadeY = 0;

const forcaPulo = -12;
const gravidade = 0.6;

let noChao = true;


// ==============================
// CACTOS
// ==============================

let cactos = [];

const velocidadeInicial = 5;
const velocidadeMaxima = 8;

let velocidadeCacto = velocidadeInicial;

let contadorCacto = 100;


// ==============================
// PONTUAÇÃO
// ==============================

let pontuacao = 0;


// ==============================
// RECORDE
// ==============================

// Pega o recorde salvo no navegador
let recorde = Number(localStorage.getItem("recordeJogo")) || 0;


// ==============================
// GAME OVER
// ==============================

let gameOver = false;


// ==============================
// DESENHAR O CHÃO
// ==============================

function desenharChao() {

    ctx.fillStyle = "#555";

    ctx.fillRect(
        0,
        chaoY,
        canvas.width,
        3
    );
}


// ==============================
// DESENHAR O DINOSSAURO
// ==============================

function desenharDinossauro() {

    ctx.fillStyle = "#333";

    // Corpo
    ctx.fillRect(
        dinossauroX,
        dinossauroY + 15,
        30,
        30
    );

    // Cabeça
    ctx.fillRect(
        dinossauroX + 20,
        dinossauroY,
        25,
        25
    );

    // Pescoço
    ctx.fillRect(
        dinossauroX + 15,
        dinossauroY + 10,
        15,
        20
    );

    // Perna 1
    ctx.fillRect(
        dinossauroX + 5,
        dinossauroY + 40,
        8,
        10
    );

    // Perna 2
    ctx.fillRect(
        dinossauroX + 20,
        dinossauroY + 40,
        8,
        10
    );

    // Cauda
    ctx.fillRect(
        dinossauroX - 10,
        dinossauroY + 25,
        15,
        8
    );

    // Olho
    ctx.fillStyle = "white";

    ctx.fillRect(
        dinossauroX + 35,
        dinossauroY + 6,
        5,
        5
    );
}


// ==============================
// CRIAR CACTO
// ==============================

function criarCacto() {

    // Define aleatoriamente se será alto ou baixo
    const alto = Math.random() < 0.5;

    const altura = alto ? 55 : 35;
    const largura = alto ? 20 : 15;

    const cacto = {

        x: canvas.width,

        y: chaoY - altura,

        largura: largura,

        altura: altura
    };

    cactos.push(cacto);
}


// ==============================
// DESENHAR CACTOS
// ==============================

function desenharCactos() {

    ctx.fillStyle = "green";

    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        // Tronco
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );

        // Braço esquerdo
        if (cacto.altura > 40) {

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 15,
                8,
                8
            );

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 8,
                5,
                15
            );
        }

        // Braço direito
        if (cacto.altura > 40) {

            ctx.fillRect(
                cacto.x + cacto.largura,
                cacto.y + 25,
                8,
                8
            );

            ctx.fillRect(
                cacto.x + cacto.largura + 3,
                cacto.y + 18,
                5,
                15
            );
        }
    }
}


// ==============================
// ATUALIZAR CACTOS
// ==============================

function atualizarCactos() {

    for (let i = 0; i < cactos.length; i++) {

        cactos[i].x -= velocidadeCacto;
    }

    // Remove cactos que saíram da tela
    cactos = cactos.filter(function(cacto) {

        return cacto.x + cacto.largura > 0;
    });
}


// ==============================
// CONTROLAR CRIAÇÃO DOS CACTOS
// ==============================

function controlarCactos() {

    contadorCacto--;

    if (contadorCacto <= 0) {

        criarCacto();

        // Intervalo aleatório entre os cactos
        contadorCacto =
            Math.floor(Math.random() * 90) + 60;
    }
}


// ==============================
// ATUALIZAR DINOSSAURO
// ==============================

function atualizarDinossauro() {

    velocidadeY += gravidade;

    dinossauroY += velocidadeY;

    // Impede o dinossauro de atravessar o chão
    if (dinossauroY >= chaoY - dinossauroAltura) {

        dinossauroY = chaoY - dinossauroAltura;

        velocidadeY = 0;

        noChao = true;
    }
}


// ==============================
// FAZER O DINOSSAURO PULAR
// ==============================

function pular() {

    if (noChao && !gameOver) {

        velocidadeY = forcaPulo;

        noChao = false;
    }
}


// ==============================
// ATUALIZAR PONTUAÇÃO
// ==============================

function atualizarPontuacao() {

    pontuacao++;

    // A cada 100 pontos aumenta a velocidade
    const nivelVelocidade =
        Math.floor(pontuacao / 100);

    velocidadeCacto =
        velocidadeInicial +
        (nivelVelocidade * 0.5);

    // Limita a velocidade
    if (velocidadeCacto > velocidadeMaxima) {

        velocidadeCacto = velocidadeMaxima;
    }

    // Se passar do recorde, salva o novo recorde
    if (pontuacao > recorde) {

        recorde = pontuacao;

        localStorage.setItem(
            "recordeJogo",
            recorde
        );
    }
}


// ==============================
// DESENHAR PONTUAÇÃO E RECORDE
// ==============================

function desenharPontuacao() {

    ctx.fillStyle = "#333";

    ctx.font = "20px Arial";

    ctx.textAlign = "right";

    // Pontuação com 5 números
    const textoPontuacao =
        pontuacao.toString().padStart(5, "0");

    // Recorde com 5 números
    const textoRecorde =
        recorde.toString().padStart(5, "0");

    // Tudo junto para não ficar sobreposto
    ctx.fillText(
        textoPontuacao +
        "   Hi " +
        textoRecorde,

        canvas.width - 20,
        30
    );

    ctx.textAlign = "left";
}


// ==============================
// VERIFICAR COLISÃO
// ==============================

function verificarColisao() {

    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        // Colisão entre dinossauro e cacto
        if (
            dinossauroX <
                cacto.x + cacto.largura &&

            dinossauroX + dinossauroLargura >
                cacto.x &&

            dinossauroY <
                cacto.y + cacto.altura &&

            dinossauroY + dinossauroAltura >
                cacto.y
        ) {

            gameOver = true;

            velocidadeY = 0;

            return;
        }
    }
}


// ==============================
// DESENHAR GAME OVER
// ==============================

function desenharGameOver() {

    // Fundo transparente
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Texto principal
    ctx.fillStyle = "#333";

    ctx.font = "bold 40px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAMER OVER",
        canvas.width / 2,
        130
    );

    // Texto para reiniciar
    ctx.font = "20px Arial";

    ctx.fillText(
        "aperte espaço para jogar de novo",
        canvas.width / 2,
        170
    );

    ctx.textAlign = "left";
}


// ==============================
// REINICIAR JOGO
// ==============================

function reiniciarJogo() {

    // Volta o dinossauro para o início
    dinossauroX = 100;

    dinossauroY =
        chaoY - dinossauroAltura;

    velocidadeY = 0;

    noChao = true;

    // Apaga todos os cactos
    cactos = [];

    contadorCacto = 100;

    // Zera a pontuação
    pontuacao = 0;

    // Volta a velocidade inicial
    velocidadeCacto =
        velocidadeInicial;

    // Tira o game over
    gameOver = false;
}


// ==============================
// TECLAS
// ==============================

document.addEventListener(
    "keydown",
    function(event) {

        // Espaço
        if (event.code === "Space") {

            event.preventDefault();

            if (gameOver) {

                reiniciarJogo();

            } else {

                pular();
            }
        }

        // Seta para cima
        if (
            event.code === "ArrowUp" &&
            !gameOver
        ) {

            event.preventDefault();

            pular();
        }
    }
);


// ==============================
// DESENHAR TUDO
// ==============================

function desenhar() {

    // Limpa a tela
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    desenharChao();

    desenharDinossauro();

    desenharCactos();

    desenharPontuacao();

    // Se perdeu, mostra a tela de game over
    if (gameOver) {

        desenharGameOver();
    }
}


// ==============================
// LOOP PRINCIPAL
// ==============================

function jogo() {

    if (!gameOver) {

        atualizarDinossauro();

        atualizarCactos();

        controlarCactos();

        atualizarPontuacao();

        verificarColisao();
    }

    desenhar();

    requestAnimationFrame(jogo);
}


// ==============================
// COMEÇAR O JOGO
// ==============================

jogo();