const personaje = document.getElementById('personaje');
const gameArea = document.getElementById('gameArea');
const meta = document.getElementById('meta');

const niveles = [
    {
        fondo: 'callebg.jpg',
        obstaculos: [
            { id: 'obstaculo1', direccion: 'derecha', bottom: 100 }
        ]
    },
    {
        fondo: 'callebg2.jpg',
        obstaculos: [

        ]
    },
    // Agrega más niveles si lo deseas
];

let nivelActual = 0;
// Definir variables globales para las velocidades
window.velocidadPersonaje = 10; // Velocidad inicial del personaje
window.velocidadObstaculos = 3; // Velocidad inicial de los obstáculos

// Configurar la dificultad según el radio button seleccionado
function configurarDificultad() {
    const dificultadSeleccionada = document.querySelector('input[name="dificultad"]:checked').value;

    switch (dificultadSeleccionada) {
        case 'baja':
            window.velocidadPersonaje = 5;
            window.velocidadObstaculos = 2;
            break;
        case 'media':
            window.velocidadPersonaje = 10;
            window.velocidadObstaculos = 5;
            break;
        case 'alta':
            window.velocidadPersonaje = 15;
            window.velocidadObstaculos = 8;
            break;
        default:
            window.velocidadPersonaje = 10;
            window.velocidadObstaculos = 3;
            break;
    }
}

// Inicializar la dificultad al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    configurarDificultad();
});

// Configurar la dificultad cuando se cambie el radio button
document.querySelectorAll('input[name="dificultad"]').forEach(radio => {
    radio.addEventListener('change', configurarDificultad);
});

document.addEventListener('keydown', moverPersonaje);

// Función para mover el personaje
function moverPersonaje(event) {
    let topPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('bottom'));
    let leftPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('left'));

    // Tecla hacia arriba (avanzar)
    if (event.key === 'ArrowUp') {
        if (topPos + velocidadPersonaje + personaje.offsetHeight < gameArea.offsetHeight) {
            personaje.style.bottom = (topPos + velocidadPersonaje) + 'px';
        } else {
            verificarMeta();
        }
    }

    // Tecla hacia abajo (retroceder)
    if (event.key === 'ArrowDown') {
        if (topPos - velocidadPersonaje >= 0) {
            personaje.style.bottom = (topPos - velocidadPersonaje) + 'px';
        }
    }

    // Tecla hacia la izquierda
    if (event.key === 'ArrowLeft') {
        if (leftPos - velocidadPersonaje >= 0) {
            personaje.style.left = (leftPos - velocidadPersonaje) + 'px';
        }
    }

    // Tecla hacia la derecha
    if (event.key === 'ArrowRight') {
        if (leftPos + velocidadPersonaje + personaje.offsetWidth <= gameArea.offsetWidth) {
            personaje.style.left = (leftPos + velocidadPersonaje) + 'px';
        }
    }

    verificarColision();
}

// Función para verificar si el personaje ha llegado a la meta
function verificarMeta() {
    const topPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('bottom'));
    const metaPos = gameArea.offsetHeight - meta.offsetHeight;

    if (topPos + personaje.offsetHeight >= metaPos) {
        pasarAlSiguienteNivel();
    }
}

// Función para cargar el nivel actual
function cargarNivel(nivel) {
    const configuracion = niveles[nivel];
    gameArea.style.backgroundImage = `url(${configuracion.fondo})`;

    // Elimina obstáculos existentes
    document.querySelectorAll('.obstaculo').forEach(obstaculo => obstaculo.remove());

    // Agrega nuevos obstáculos
    configuracion.obstaculos.forEach(obstaculoConfig => {
        const obstaculo = document.createElement('div');
        obstaculo.id = obstaculoConfig.id;
        obstaculo.className = 'obstaculo';
        obstaculo.style.bottom = `${obstaculoConfig.bottom}px`;
        obstaculo.style.left = obstaculoConfig.direccion === 'derecha' ? '0px' : `${gameArea.offsetWidth - 60}px`;
        obstaculo.dataset.direccion = obstaculoConfig.direccion;
        gameArea.appendChild(obstaculo);
    });
}

// Función para mover los obstáculos
function moverObstaculos() {
    document.querySelectorAll('.obstaculo').forEach(obstaculo => {
        let leftPos = parseInt(window.getComputedStyle(obstaculo).getPropertyValue('left'));
        let direccion = obstaculo.dataset.direccion;

        if (direccion === 'derecha') {
            if (leftPos >= gameArea.offsetWidth) {
                obstaculo.style.left = '-60px';
            } else {
                obstaculo.style.left = (leftPos + velocidadObstaculos) + 'px';
            }
        } else if (direccion === 'izquierda') {
            if (leftPos <= -60) {
                obstaculo.style.left = `${gameArea.offsetWidth}px`;
            } else {
                obstaculo.style.left = (leftPos - velocidadObstaculos) + 'px';
                obstaculo.style.transform = 'rotate(180deg)';
            }
        }

        verificarColision();
    });
}

// Función para verificar colisión entre el personaje y los obstáculos
function verificarColision() {
    const personajeRect = personaje.getBoundingClientRect();

    document.querySelectorAll('.obstaculo').forEach(obstaculo => {
        const obstaculoRect = obstaculo.getBoundingClientRect();

        if (
            personajeRect.left < obstaculoRect.right &&
            personajeRect.right > obstaculoRect.left &&
            personajeRect.top < obstaculoRect.bottom &&
            personajeRect.bottom > obstaculoRect.top
        ) {
            alert('¡Colisión! Has perdido. Reiniciando nivel...');
            reiniciarNivel();
        }
    });
}

// Función para reiniciar el nivel
function reiniciarNivel() {
    personaje.style.bottom = '0px';
    personaje.style.left = '50%';
}

// Función para pasar al siguiente nivel
function pasarAlSiguienteNivel() {
    nivelActual++;
    if (nivelActual < niveles.length) {
        alert(`¡Felicidades! Has pasado al nivel ${nivelActual + 1}.`);
        cargarNivel(nivelActual);
        reiniciarNivel();
    } else {
        alert('¡Has completado todos los niveles!');
        nivelActual = 0;
        cargarNivel(nivelActual);
        reiniciarNivel();
    }
}

// Inicializar el primer nivel
cargarNivel(nivelActual);

// Mueve los obstáculos continuamente
setInterval(moverObstaculos, 30);
