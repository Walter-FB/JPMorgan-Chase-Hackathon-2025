// Variables globales
let casoData = null;

// Elementos DOM principales
const statusBanner = document.getElementById('status-banner');
const fotoPrincipal = document.getElementById('caso-foto-principal');
const fotosAdicionales = document.getElementById('fotos-adicionales');
const casoNombre = document.getElementById('caso-nombre');
const casoUbicacion = document.getElementById('caso-ubicacion');
const casoFecha = document.getElementById('caso-fecha');
const casoEspecie = document.getElementById('caso-especie');
const casoSexo = document.getElementById('caso-sexo');
const casoEdad = document.getElementById('caso-edad');
const casoEstadoGeneral = document.getElementById('caso-estado-general');
const casoDanos = document.getElementById('caso-danos');
const casoPeligro = document.getElementById('caso-peligro');
const casoContacto = document.getElementById('caso-contacto');
const correoOriginal = document.getElementById('correo-original');
const btnGuardarDecision = document.getElementById('btn-guardar-decision');

// Botones de prioridad y acción
const btnPrioridad = document.querySelectorAll('.btn-prioridad');
const btnAccion = document.querySelectorAll('.btn-accion');

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del caso
    cargarCaso();
    
    // Configurar eventos de botones de prioridad
    btnPrioridad.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnPrioridad.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            verificarSeleccion();
        });
    });
    
    // Configurar eventos de botones de acción
    btnAccion.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnAccion.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            verificarSeleccion();
        });
    });
    
    // Configurar evento de guardar decisión
    btnGuardarDecision.addEventListener('click', guardarDecision);
});

// Cargar datos del caso desde la API
async function cargarCaso() {
    try {
        const response = await fetch(`/api/caso/${idCaso}`);
        
        if (!response.ok) {
            mostrarError('No se pudo cargar el caso. El caso no existe o ha sido eliminado.');
            return;
        }
        
        casoData = await response.json();
        mostrarDatosCaso();
    } catch (error) {
        console.error('Error al cargar el caso:', error);
        mostrarError('Error de conexión al cargar el caso.');
    }
}

// Mostrar los datos del caso en la interfaz
function mostrarDatosCaso() {
    // Verificar si ya se ha tomado una decisión sobre el caso
    if (casoData.decision) {
        mostrarBannerDecision();
    }
    
    // Mostrar la imagen principal
    if (casoData.foto) {
        fotoPrincipal.src = '/' + casoData.foto;
        fotoPrincipal.alt = `Foto de ${casoData.nombre}`;
    } else {
        fotoPrincipal.src = '/static/img/no-image.jpg';
        fotoPrincipal.alt = 'No hay imagen disponible';
    }
    
    // Mostrar fotos adicionales
    if (casoData.adjuntos_extra && casoData.adjuntos_extra.length > 0) {
        fotosAdicionales.innerHTML = '';
        casoData.adjuntos_extra.forEach(adjunto => {
            if (adjunto.toLowerCase().endsWith('.jpg') || adjunto.toLowerCase().endsWith('.jpeg') || 
                adjunto.toLowerCase().endsWith('.png') || adjunto.toLowerCase().endsWith('.gif')) {
                const img = document.createElement('img');
                img.src = '/' + adjunto;
                img.className = 'caso-foto-adicional';
                img.addEventListener('click', () => {
                    fotoPrincipal.src = '/' + adjunto;
                });
                fotosAdicionales.appendChild(img);
            }
        });
    } else {
        fotosAdicionales.innerHTML = '<p>No hay fotos adicionales</p>';
    }
    
    // Información básica
    casoNombre.textContent = casoData.nombre || 'Sin nombre';
    casoUbicacion.textContent = formatearDato('Ubicación', casoData.ubicacion);
    
    // Fecha en formato legible
    const fechaObj = new Date(casoData.fecha_reporte);
    const fechaFormateada = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString();
    casoFecha.textContent = `Reportado: ${fechaFormateada}`;
    
    // Información adicional (solo mostrar si está disponible)
    casoEspecie.textContent = formatearDato('Tipo', casoData.especie_raza);
    casoSexo.textContent = formatearDato('Sexo', casoData.sexo);
    casoEdad.textContent = formatearDato('Edad', casoData.edad);
    
    // Información detallada
    casoEstadoGeneral.textContent = formatearDato('Estado general', casoData.estado_general);
    casoDanos.textContent = formatearDato('Condición física', casoData.danos_visibles);
    casoPeligro.textContent = formatearDato('Situación actual', casoData.contexto_peligro);
    casoContacto.textContent = formatearDato('Persona de contacto', casoData.contacto);
    
    // Correo original
    correoOriginal.textContent = casoData.correo_original || 'No disponible';
    
    // Marcar botones de prioridad según los datos
    if (casoData.decision) {
        // Si ya hay decisión, seleccionar los botones correspondientes
        const btnPrioridadSeleccionado = document.querySelector(`.btn-prioridad.btn-${casoData.prioridad}`);
        if (btnPrioridadSeleccionado) {
            btnPrioridadSeleccionado.classList.add('selected');
        }
        
        const btnAccionSeleccionado = document.querySelector(`.btn-accion.btn-${casoData.decision === 'aceptado' ? 'aceptar' : 'rechazar'}`);
        if (btnAccionSeleccionado) {
            btnAccionSeleccionado.classList.add('selected');
        }
        
        // Deshabilitar botones
        btnPrioridad.forEach(btn => btn.disabled = true);
        btnAccion.forEach(btn => btn.disabled = true);
        btnGuardarDecision.disabled = true;
    } else {
        // Si no hay decisión, seleccionar botón de prioridad actual
        const btnPrioridadActual = document.querySelector(`.btn-prioridad.btn-${casoData.prioridad}`);
        if (btnPrioridadActual) {
            btnPrioridadActual.classList.add('selected');
        }
    }
}

// Función para formatear datos con etiquetas
function formatearDato(etiqueta, valor) {
    if (!valor || valor === 'No especificado') {
        return `${etiqueta}: No disponible`;
    }
    return `${etiqueta}: ${valor}`;
}

// Verificar si se han seleccionado ambas opciones (prioridad y acción)
function verificarSeleccion() {
    const hayPrioridad = document.querySelector('.btn-prioridad.selected');
    const hayAccion = document.querySelector('.btn-accion.selected');
    
    btnGuardarDecision.disabled = !(hayPrioridad && hayAccion);
}

// Guardar la decisión
async function guardarDecision() {
    const prioridadSeleccionada = document.querySelector('.btn-prioridad.selected');
    const accionSeleccionada = document.querySelector('.btn-accion.selected');
    
    if (!prioridadSeleccionada || !accionSeleccionada) {
        alert('Debes seleccionar una prioridad y una acción');
        return;
    }
    
    const prioridad = prioridadSeleccionada.dataset.prioridad;
    const decision = accionSeleccionada.dataset.accion;
    
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
            // Recargar el caso para mostrar los cambios
            cargarCaso();
            
            // Mostrar mensaje de éxito
            alert('Decisión guardada correctamente');
        } else {
            console.error('Error al guardar la decisión');
            alert('Error al guardar la decisión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al comunicarse con el servidor');
    }
}

// Mostrar un banner de error
function mostrarError(mensaje) {
    statusBanner.textContent = mensaje;
    statusBanner.className = 'caso-status-banner error';
}

// Mostrar banner con información de la decisión
function mostrarBannerDecision() {
    const esAceptado = casoData.decision === 'aceptado';
    
    statusBanner.innerHTML = `
        <i class="fas ${esAceptado ? 'fa-check-circle' : 'fa-times-circle'}"></i>
        Caso <strong>${esAceptado ? 'ACEPTADO' : 'RECHAZADO'}</strong> 
        con prioridad <strong>${casoData.prioridad.toUpperCase()}</strong> 
        el ${new Date(casoData.fecha_decision).toLocaleDateString()}
    `;
    
    statusBanner.className = `caso-status-banner decidido ${esAceptado ? 'aceptado' : 'rechazado'}`;
} 