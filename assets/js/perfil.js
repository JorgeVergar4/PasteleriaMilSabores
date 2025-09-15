document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // --- Mostrar Mis Pedidos ---
    const misPedidosList = document.getElementById('mis-pedidos-list');
    function renderMisPedidos() {
        if (misPedidosList && currentUser) {
            const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            // Buscar pedidos por nombre de usuario (puedes cambiar a run/email si lo prefieres)
            const userOrders = allOrders.filter(o => o.customer === currentUser.nombre);
            if (userOrders.length === 0) {
                misPedidosList.innerHTML = '<p>No tienes pedidos registrados.</p>';
            } else {
                let html = `<table class="mis-pedidos-table"><thead><tr><th>ID</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>`;
                userOrders.reverse().forEach(order => {
                    html += `<tr>
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.total}</td>
                        <td>${order.status ? order.status : 'Pendiente'}</td>
                        <td><button class="ver-detalle-btn" data-id="${order.id}">Ver Detalle</button></td>
                    </tr>`;
                });
                html += '</tbody></table>';
                misPedidosList.innerHTML = html;
            }
        }
    }
    if (misPedidosList) {
        misPedidosList.addEventListener('click', function(e) {
            if (e.target.classList.contains('ver-detalle-btn')) {
                const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
                const orderId = e.target.dataset.id;
                const order = allOrders.find(o => o.id === orderId);
                if (order) {
                    let detalle = `<h3>Detalle del Pedido ${order.id}</h3><ul>`;
                    order.items.forEach(item => {
                        detalle += `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CL')}`;
                        if (item.message) detalle += ` <em>Mensaje: "${item.message}"</em>`;
                        detalle += `</li>`;
                    });
                    detalle += `</ul><p><strong>Total:</strong> ${order.total}</p><p><strong>Estado:</strong> ${order.status ? order.status : 'Pendiente'}</p>`;
                    alert(detalle.replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n'));
                }
            }
        });
    }
    const profileForm = document.getElementById('profile-form');

    // Si no hay usuario logueado, redirigir al login
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // --- Elementos del Formulario ---
    const runInput = document.getElementById('run');
    const emailInput = document.getElementById('email');
    const nombreInput = document.getElementById('nombre');
    const apellidosInput = document.getElementById('apellidos');
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const direccionInput = document.getElementById('direccion');
    const fechaNacimientoInput = document.getElementById('fecha-nacimiento');

    // --- Lógica de Regiones y Comunas ---
    regionesComunas.regiones.forEach(region => {
        regionSelect.innerHTML += `<option value="${region.nombre}">${region.nombre}</option>`;
    });
    const cargarComunas = (regionNombre) => {
        comunaSelect.innerHTML = '<option value="">Seleccione</option>';
        const region = regionesComunas.regiones.find(r => r.nombre === regionNombre);
        if (region) {
            region.comunas.forEach(comuna => {
                comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
            });
        }
    };
    regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value));

    // --- Rellenar el Formulario con los Datos del Usuario ---
    const loadUserProfile = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userData = users.find(u => u.run === currentUser.run);
        if (userData) {
            runInput.value = userData.run || '';
            emailInput.value = userData.email || '';
            nombreInput.value = userData.nombre || '';
            apellidosInput.value = userData.apellidos || '';
            direccionInput.value = userData.direccion || '';
            if (fechaNacimientoInput) fechaNacimientoInput.value = userData.fechaNacimiento || '';
            regionSelect.value = userData.region || '';
            cargarComunas(userData.region);
            comunaSelect.value = userData.comuna || '';
        }
    };

    // --- Guardar Cambios ---
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.run === currentUser.run);
        if (userIndex !== -1) {
            // Solo se actualizan los campos editables
            users[userIndex].nombre = nombreInput.value;
            users[userIndex].apellidos = apellidosInput.value;
            users[userIndex].direccion = direccionInput.value;
            if (fechaNacimientoInput) users[userIndex].fechaNacimiento = fechaNacimientoInput.value;
            users[userIndex].region = regionSelect.value;
            users[userIndex].comuna = comunaSelect.value;
            // Guardar en localStorage y actualizar sesión
            localStorage.setItem('users', JSON.stringify(users));
            sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            // Mensaje de éxito
            const successMsg = document.getElementById('success-update-message');
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
            }
        }
    });

    // Cargar los datos del perfil al iniciar la página
    loadUserProfile();
    renderMisPedidos();
});