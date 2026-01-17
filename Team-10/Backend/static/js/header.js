// Funcionalidad del header
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const loginButton = document.getElementById('login-button');
    const profileButton = document.getElementById('profile-button');
    const logoutButton = document.getElementById('logout-button');
    const sessionButtons = document.getElementById('session-buttons');
    const noSessionButton = document.getElementById('no-session-button');
    
    // Estado de sesión (simulado)
    let isLoggedIn = false;
    
    // Función para actualizar la UI según el estado de sesión
    function updateSessionUI() {
        if (isLoggedIn) {
            sessionButtons.classList.remove('hidden');
            noSessionButton.classList.add('hidden');
        } else {
            sessionButtons.classList.add('hidden');
            noSessionButton.classList.remove('hidden');
        }
    }
    
    // Event listeners
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            isLoggedIn = true;
            updateSessionUI();
        });
    }
    
    if (profileButton) {
        profileButton.addEventListener('click', function() {
            // Simulación de navegación al perfil
            alert('Navegando al perfil de usuario');
        });
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            isLoggedIn = false;
            updateSessionUI();
            // Simulación de navegación a la página principal
            window.location.href = '/';
        });
    }
    
    // Inicializar UI
    updateSessionUI();
}); 