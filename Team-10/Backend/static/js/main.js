// Variables globales
let allCasos = [];
let currentFilter = 'todos';
let lastTimestamp = 0;

// Elementos DOM principales
const accordionAlta = document.getElementById('accordion-alta');
const accordionMedia = document.getElementById('accordion-media');
const accordionBaja = document.getElementById('accordion-baja');
const totalCasosCounter = document.getElementById('total-casos').querySelector('.count');
const altaCounter = document.getElementById('casos-alta').querySelector('.count');
const mediaCounter = document.getElementById('casos-media').querySelector('.count');
const bajaCounter = document.getElementById('casos-baja').querySelector('.count');
const notificacion = document.getElementById('notificacion');
const filtroBusqueda = document.getElementById('filtro-busqueda');
const botonesFilter = document.querySelectorAll('.filter-buttons button');

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar casos iniciales
    cargarCasos();
    
    // Configurar el filtro de búsqueda
    filtroBusqueda.addEventListener('input', filtrarCasosPorTexto);
    
    // Configurar botones de filtro
    botonesFilter.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFilter.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            mostrarCasosFiltrados();
        });
    });
    
    // Verificar periódicamente si hay nuevos casos
    setInterval(verificarNuevosCasos, 10000);
});

// Cargar todos los casos desde la API
async function cargarCasos() {
    try {
        const response = await fetch('/api/casos');
        const data = await response.json();
        allCasos = data;
        
        // Actualizar el timestamp para futuras verificaciones
        actualizarTimestamp();
        
        // Mostrar los casos según el filtro actual
        mostrarCasosFiltrados();
        
        // Actualizar contadores
        actualizarContadores();
    } catch (error) {
        console.error('Error al cargar los casos:', error);
    }
}

// Mostrar casos aplicando el filtro actual
function mostrarCasosFiltrados() {
    // Limpiar los contenedores
    accordionAlta.innerHTML = '';
    accordionMedia.innerHTML = '';
    accordionBaja.innerHTML = '';
    
    // Filtrar casos según el filtro actual y la búsqueda
    let casosFiltrados = allCasos;
    
    // Filtrar por prioridad si no es "todos"
    if (currentFilter !== 'todos') {
        casosFiltrados = casosFiltrados.filter(caso => caso.prioridad.toLowerCase() === currentFilter);
    }
    
    // Filtrar por texto si hay búsqueda
    const textoBusqueda = filtroBusqueda.value.toLowerCase().trim();
    if (textoBusqueda) {
        casosFiltrados = casosFiltrados.filter(caso => 
            caso.nombre.toLowerCase().includes(textoBusqueda) ||
            caso.especie_raza.toLowerCase().includes(textoBusqueda) ||
            caso.ubicacion.toLowerCase().includes(textoBusqueda) ||
            caso.estado_general.toLowerCase().includes(textoBusqueda)
        );
    }
    
    // Mostrar los casos filtrados
    casosFiltrados.forEach(caso => {
        const casoElement = crearElementoCaso(caso);
        
        switch (caso.prioridad.toLowerCase()) {
            case 'alta':
                accordionAlta.appendChild(casoElement);
                break;
            case 'media':
                accordionMedia.appendChild(casoElement);
                break;
            case 'baja':
                accordionBaja.appendChild(casoElement);
                break;
        }
    });
    
    // Mostrar mensaje si no hay casos
    if (casosFiltrados.length === 0) {
        const mensaje = document.createElement('div');
        mensaje.className = 'no-casos-mensaje';
        mensaje.innerHTML = `<p>No se encontraron casos que coincidan con el filtro${textoBusqueda ? ' "' + textoBusqueda + '"' : ''}.</p>`;
        
        // Añadir a todos los contenedores si el filtro es "todos"
        if (currentFilter === 'todos') {
            accordionAlta.appendChild(mensaje.cloneNode(true));
            accordionMedia.appendChild(mensaje.cloneNode(true));
            accordionBaja.appendChild(mensaje.cloneNode(true));
        } else {
            // O solo al contenedor correspondiente
            switch (currentFilter) {
                case 'alta':
                    accordionAlta.appendChild(mensaje);
                    break;
                case 'media':
                    accordionMedia.appendChild(mensaje);
                    break;
                case 'baja':
                    accordionBaja.appendChild(mensaje);
                    break;
            }
        }
    }
}

// Filtrar casos por texto de búsqueda
function filtrarCasosPorTexto() {
    mostrarCasosFiltrados();
}

// Crear un elemento de caso a partir de la plantilla
function crearElementoCaso(caso) {
    const template = document.getElementById('plantilla-caso');
    const clon = template.content.cloneNode(true);
    
    // Rellenar los datos básicos en la cabecera compacta
    const casoElement = clon.querySelector('.caso-accordion');
    const prioridad = clon.querySelector('.caso-prioridad');
    const titulo = clon.querySelector('.caso-titulo');
    const ubicacionMini = clon.querySelector('.caso-ubicacion-mini span');
    const fecha = clon.querySelector('.caso-fecha');
    
    // Configurar la prioridad
    prioridad.textContent = caso.prioridad.charAt(0).toUpperCase() + caso.prioridad.slice(1);
    prioridad.classList.add(caso.prioridad.toLowerCase());
    
    // Título (ahora es la descripción resumida)
    titulo.textContent = caso.nombre || 'Sin descripción';
    
    // Crear o actualizar el elemento para el estado general en la miniatura
    let estadoMini = clon.querySelector('.caso-estado-mini');
    if (!estadoMini) {
        estadoMini = document.createElement('p');
        estadoMini.className = 'caso-estado-mini';
        const icon = document.createElement('i');
        icon.className = 'fas fa-heartbeat';
        estadoMini.appendChild(icon);
        const span = document.createElement('span');
        estadoMini.appendChild(span);
        
        // Insertar el estado antes de la ubicación
        const resumenDiv = clon.querySelector('.caso-resumen');
        const ubicacionElem = clon.querySelector('.caso-ubicacion-mini');
        resumenDiv.insertBefore(estadoMini, ubicacionElem);
    }
    
    // Actualizar el estado general en la miniatura
    estadoMini.querySelector('span').textContent = caso.estado_general || 'Estado desconocido';
    
    // Ubicación para el header compacto
    ubicacionMini.textContent = caso.ubicacion || 'Ubicación desconocida';
    
    // Fecha en formato legible
    const fechaObj = new Date(caso.fecha_reporte);
    fecha.textContent = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString().slice(0, 5);
    
    // Configurar la imagen
    const imagen = clon.querySelector('.caso-img');
    if (caso.foto) {
        imagen.src = '/' + caso.foto;
        imagen.alt = `Foto de ${caso.nombre}`;
    } else {
        imagen.src = '/static/img/no-image.jpg';
        imagen.alt = 'No hay imagen disponible';
    }
    
    // Rellenar solo los campos que tengan información
    // Especie/Raza
    if (caso.especie_raza && caso.especie_raza !== 'No especificado') {
        const especieElem = clon.querySelector('.caso-especie');
        especieElem.innerHTML = `<i class="fas fa-dog"></i> <span><strong>Tipo:</strong> ${caso.especie_raza}</span>`;
    }
    
    // Sexo
    if (caso.sexo && caso.sexo !== 'No especificado') {
        const sexoElem = clon.querySelector('.caso-sexo');
        const iconoSexo = caso.sexo.toLowerCase() === 'macho' ? 'fa-mars' : 'fa-venus';
        sexoElem.innerHTML = `<i class="fas ${iconoSexo}"></i> <span><strong>Sexo:</strong> ${caso.sexo}</span>`;
    }
    
    // Edad
    if (caso.edad && caso.edad !== 'No especificado') {
        const edadElem = clon.querySelector('.caso-edad');
        edadElem.innerHTML = `<i class="fas fa-birthday-cake"></i> <span><strong>Edad:</strong> ${caso.edad}</span>`;
    }
    
    // Ubicación completa
    if (caso.ubicacion && caso.ubicacion !== 'No especificado') {
        const ubicacionElem = clon.querySelector('.caso-ubicacion-completa');
        ubicacionElem.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span><strong>Ubicación:</strong> ${caso.ubicacion}</span>`;
    }
    
    // Estado
    if (caso.estado_general && caso.estado_general !== 'No especificado') {
        const estadoElem = clon.querySelector('.caso-estado');
        estadoElem.innerHTML = `<i class="fas fa-heartbeat"></i> <span><strong>Estado:</strong> ${caso.estado_general}</span>`;
    }
    
    // Daños
    if (caso.danos_visibles && caso.danos_visibles !== 'No especificado') {
        const danosElem = clon.querySelector('.caso-danos');
        danosElem.innerHTML = `<i class="fas fa-first-aid"></i> <span><strong>Condición física:</strong> ${caso.danos_visibles}</span>`;
    }
    
    // Peligro/Contexto
    if (caso.contexto_peligro && caso.contexto_peligro !== 'No especificado') {
        const peligroElem = clon.querySelector('.caso-peligro');
        peligroElem.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span><strong>Situación:</strong> ${caso.contexto_peligro}</span>`;
    }
    
    // Contacto
    if (caso.contacto && caso.contacto !== 'No especificado') {
        const contactoElem = clon.querySelector('.caso-contacto');
        contactoElem.innerHTML = `<i class="fas fa-user"></i> <span><strong>Contacto:</strong> ${caso.contacto}</span>`;
    }
    
    // Enlace a la página de detalle
    const btnVerDetalle = clon.querySelector('.btn-ver-caso');
    btnVerDetalle.href = `/caso/${caso.id}`;
    
    // Configurar comportamiento de botones de decisión
    const btnAceptar = clon.querySelector('.btn-aceptar');
    const btnRechazar = clon.querySelector('.btn-rechazar');
    
    btnAceptar.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el clic se propague al acordeón
        actualizarDecision(caso.id, caso.prioridad, 'aceptado');
    });
    
    btnRechazar.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el clic se propague al acordeón
        actualizarDecision(caso.id, caso.prioridad, 'rechazado');
    });
    
    // Configurar el comportamiento del acordeón
    const header = clon.querySelector('.caso-header-compacto');
    header.addEventListener('click', () => {
        casoElement.classList.toggle('active');
    });
    
    return casoElement;
}

// Actualizar la decisión (aceptar/rechazar)
async function actualizarDecision(idCaso, prioridad, decision) {
    try {
        const response = await fetch(`/api/actualizar-prioridad/${idCaso}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prioridad: prioridad,
                decision: decision
            })
        });
        
        if (response.ok) {
            // Recargar los casos para mostrar los cambios
            cargarCasos();
            mostrarNotificacion(`Caso ${decision === 'aceptado' ? 'aceptado' : 'rechazado'} correctamente`);
        } else {
            console.error('Error al actualizar la decisión');
            mostrarNotificacion('Error al actualizar la decisión', true);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al comunicarse con el servidor', true);
    }
}

// Actualizar los contadores
function actualizarContadores() {
    const total = allCasos.length;
    const alta = allCasos.filter(caso => caso.prioridad.toLowerCase() === 'alta').length;
    const media = allCasos.filter(caso => caso.prioridad.toLowerCase() === 'media').length;
    const baja = allCasos.filter(caso => caso.prioridad.toLowerCase() === 'baja').length;
    
    totalCasosCounter.textContent = total;
    altaCounter.textContent = alta;
    mediaCounter.textContent = media;
    bajaCounter.textContent = baja;
    
    console.log('Contadores actualizados:', { total, alta, media, baja });
}

// Verificar si hay nuevos casos
async function verificarNuevosCasos() {
    try {
        const response = await fetch(`/verificar-nuevos?timestamp=${lastTimestamp || 0}`);
        const data = await response.json();
        
        if (data.hay_nuevos) {
            // Hay nuevos casos, actualizar
            mostrarNotificacion(`¡${data.cantidad} nuevo(s) caso(s) recibido(s)!`);
            cargarCasos();
        }
    } catch (error) {
        console.error('Error al verificar nuevos casos:', error);
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, esError = false) {
    notificacion.textContent = mensaje;
    notificacion.className = 'notification active' + (esError ? ' error' : '');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        notificacion.className = 'notification';
    }, 5000);
}

// Actualizar el timestamp para verificar nuevos casos
function actualizarTimestamp() {
    if (allCasos.length > 0) {
        // Buscar el caso más reciente
        const fechas = allCasos.map(caso => {
            if (caso.fecha_reporte) {
                try {
                    return new Date(caso.fecha_reporte).getTime() / 1000;
                } catch (e) {
                    console.error('Error al procesar fecha:', e);
                    return 0;
                }
            }
            return 0;
        });
        
        lastTimestamp = Math.max(...fechas) || 0; // Usar 0 como fallback si Math.max retorna NaN
        console.log('Último timestamp actualizado:', lastTimestamp);
    } else {
        lastTimestamp = 0;
        console.log('No hay casos, timestamp establecido a 0');
    }
} 