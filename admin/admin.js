document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE DATOS Y AUTENTICACIÓN ---
    const isUserLoggedIn = () => sessionStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isUserLoggedIn() && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
    }
    const getAllProducts = () => JSON.parse(localStorage.getItem('products')) || [];
    const saveAllProducts = (products) => localStorage.setItem('products', JSON.stringify(products));
    const getAllUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveAllUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    // Inicializar datos de usuarios si no existen (solo para demostración)
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { run: '11111111-1', nombre: 'Admin', apellidos: 'Principal', email: 'admin@duoc.cl', fechaNacimiento: '1990-01-01', tipoUsuario: 'Administrador', region: 'Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Av. Siempre Viva 123' },
            { run: '22222222-2', nombre: 'Cliente', apellidos: 'Ejemplo', email: 'cliente@gmail.com', fechaNacimiento: '1995-05-10', tipoUsuario: 'Cliente', region: 'Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Calle Falsa 456' }
        ];
        saveAllUsers(defaultUsers);
    }
    
    // Función para validar el RUN (la misma del registro de clientes)
    const validarRun = (run) => {
        const Fn = {
            validaRut: function (rutCompleto) {
                rutCompleto = rutCompleto.replace("‐", "-");
                if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
                var tmp = rutCompleto.split('-');
                var digv = tmp[1]; var rut = tmp[0];
                if (digv == 'K') digv = 'k';
                return (Fn.dv(rut) == digv);
            },
            dv: function (T) {
                var M = 0, S = 1;
                for (; T; T = Math.floor(T / 10)) S = (S + T % 10 * (9 - M++ % 6)) % 11;
                return S ? S - 1 : 'k';
            }
        };
        let runSinFormato = run.replace(/\./g, '').replace('-', '');
        let cuerpo = runSinFormato.slice(0, -1);
        let dv = runSinFormato.slice(-1).toLowerCase();
        return Fn.validaRut(cuerpo + '-' + dv);
    };

    // --- LOGIN Y LOGOUT ---
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const pass = document.getElementById('admin-pass').value;
            if (email === 'admin@duoc.cl' && pass === '1234') {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                document.getElementById('admin-login-error').textContent = 'Email o contraseña incorrectos.';
                document.getElementById('admin-login-error').style.display = 'block';
            }
        });
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) { logoutBtn.addEventListener('click', () => { sessionStorage.removeItem('isAdminLoggedIn'); window.location.href = 'login.html'; }); }

    // --- DASHBOARD ---
    const totalProductsEl = document.getElementById('total-products');
    if (totalProductsEl) { totalProductsEl.textContent = getAllProducts().length; }
    const totalUsersEl = document.getElementById('total-users');
    if (totalUsersEl) { totalUsersEl.textContent = getAllUsers().length; }

    // --- LÓGICA DEL MANTENEDOR DE USUARIOS (usuarios.html) ---
    const usersTableBody = document.getElementById('users-table-body');
    if (usersTableBody) {
        const users = getAllUsers();
        usersTableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
        users.forEach(u => {
            usersTableBody.innerHTML += `
                <tr>
                    <td>${u.run}</td>
                    <td>${u.nombre} ${u.apellidos}</td>
                    <td>${u.email}</td>
                    <td>${u.tipoUsuario}</td>
                    <td class="actions-cell">
                        <a href="usuario-form.html?run=${u.run}" class="edit-btn">Editar</a>
                        <button class="delete-user-btn" data-run="${u.run}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    // --- LÓGICA DEL FORMULARIO DE USUARIO (usuario-form.html) ---
    const userForm = document.getElementById('user-form');
    if (userForm) {
        const formTitle = document.getElementById('form-title');
        const urlParams = new URLSearchParams(window.location.search);
        const userRunParam = urlParams.get('run'); // El RUN que viene de la URL para editar

        // Cargar regiones y comunas dinámicamente
        const regionSelect = document.getElementById('region');
        const comunaSelect = document.getElementById('comuna');
        regionesComunas.regiones.forEach(region => {
            regionSelect.innerHTML += `<option value="${region.nombre}">${region.nombre}</option>`;
        });
        const cargarComunas = (regionNombre) => {
            comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
            const region = regionesComunas.regiones.find(r => r.nombre === regionNombre);
            if (region) {
                region.comunas.forEach(comuna => {
                    comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
                });
            }
        };
        regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value));

        // --- MODO EDICIÓN ---
        if (userRunParam) {
            formTitle.textContent = 'Editar Usuario';
            const user = getAllUsers().find(u => u.run === userRunParam);
            if (user) {
                document.getElementById('run').value = user.run;
                document.getElementById('run').readOnly = true; // El RUN no se puede editar
                document.getElementById('nombre').value = user.nombre;
                document.getElementById('apellidos').value = user.apellidos;
                document.getElementById('email').value = user.email;
                document.getElementById('fecha-nacimiento').value = user.fechaNacimiento;
                document.getElementById('tipo-usuario').value = user.tipoUsuario;
                document.getElementById('direccion').value = user.direccion;
                
                regionSelect.value = user.region;
                cargarComunas(user.region);
                comunaSelect.value = user.comuna;
            }
        } else {
            // --- MODO CREACIÓN ---
            formTitle.textContent = 'Agregar Nuevo Usuario';
            cargarComunas(regionSelect.value); // Cargar comunas de la primera región
        }

        // --- LÓGICA AL GUARDAR (TANTO PARA CREAR COMO PARA EDITAR) ---
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Recoger todos los datos del formulario
            const runInput = document.getElementById('run');
            const userData = {
                run: runInput.value,
                nombre: document.getElementById('nombre').value,
                apellidos: document.getElementById('apellidos').value,
                email: document.getElementById('email').value,
                fechaNacimiento: document.getElementById('fecha-nacimiento').value,
                tipoUsuario: document.getElementById('tipo-usuario').value,
                region: document.getElementById('region').value,
                comuna: document.getElementById('comuna').value,
                direccion: document.getElementById('direccion').value,
            };

            // Validaciones antes de guardar
            if (!validarRun(userData.run)) { alert('Error: El RUN ingresado no es válido.'); return; }
            if (userData.nombre.trim() === '' || userData.nombre.length > 50) { alert('Error: El nombre es requerido (máx 50 caracteres).'); return; }
            if (userData.apellidos.trim() === '' || userData.apellidos.length > 100) { alert('Error: Los apellidos son requeridos (máx 100 caracteres).'); return; }
            if (userData.direccion.trim() === '' || userData.direccion.length > 300) { alert('Error: La dirección es requerida (máx 300 caracteres).'); return; }
            
            let users = getAllUsers();
            
            if (userRunParam) {
                // --- Lógica de Edición ---
                const userIndex = users.findIndex(u => u.run === userRunParam);
                if (userIndex !== -1) {
                    users[userIndex] = userData;
                }
            } else {
                // --- Lógica de Creación ---
                if (users.some(u => u.run === userData.run)) {
                    alert('Error: Ya existe un usuario con este RUN.'); return;
                }
                users.push(userData);
            }
            
            saveAllUsers(users);
            alert('¡Usuario guardado con éxito!');
            window.location.href = 'usuarios.html';
        });
    }

    // --- LÓGICA DEL MANTENEDOR DE PRODUCTOS (productos.html) ---
    const productsTableBody = document.getElementById('products-table-body');
    if (productsTableBody) {
        const products = getAllProducts();
        productsTableBody.innerHTML = '';
        products.forEach(p => {
            productsTableBody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>$${p.price.toLocaleString('es-CL')}</td>
                    <td>${p.stock || 0}</td>
                    <td class="actions-cell">
                        <a href="producto-form.html?id=${p.id}" class="edit-btn">Editar</a>
                        <button class="delete-btn" data-id="${p.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    // --- LÓGICA DEL FORMULARIO DE PRODUCTO (producto-form.html) ---
    const productForm = document.getElementById('product-form');
    if (productForm) {
        const formTitle = document.getElementById('form-title');
        const urlParams = new URLSearchParams(window.location.search);
        const productIdParam = urlParams.get('id');
        let products = getAllProducts();
        
        const categories = [...new Set(products.map(p => p.category))];
        const categoriaSelect = document.getElementById('categoria');
        categoriaSelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

        if (productIdParam) { // MODO EDICIÓN
            formTitle.textContent = 'Editar Producto';
            const product = products.find(p => p.id === productIdParam);
            if (product) {
                document.getElementById('product-id').value = product.id;
                document.getElementById('codigo').value = product.id;
                document.getElementById('codigo').readOnly = true;
                document.getElementById('nombre').value = product.name;
                document.getElementById('categoria').value = product.category;
                document.getElementById('precio').value = product.price;
                document.getElementById('stock').value = product.stock || 0;
                document.getElementById('descripcion').value = product.description;
                document.getElementById('imagen').value = product.image;
            }
        } else { // MODO CREACIÓN
            formTitle.textContent = 'Agregar Producto';
        }

        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const existingId = document.getElementById('product-id').value;
            const productData = {
                id: document.getElementById('codigo').value,
                name: document.getElementById('nombre').value,
                category: document.getElementById('categoria').value,
                price: parseFloat(document.getElementById('precio').value),
                stock: parseInt(document.getElementById('stock').value, 10),
                description: document.getElementById('descripcion').value,
                image: document.getElementById('imagen').value || 'assets/images/default.jpg',
            };

            // Validaciones de Producto
            if (productData.id.trim().length < 3) { alert('Error: El código debe tener al menos 3 caracteres.'); return; }
            if (productData.name.trim() === '' || productData.name.length > 100) { alert('Error: El nombre es requerido (máx 100 caracteres).'); return; }
            if (isNaN(productData.price) || productData.price < 0) { alert('Error: El precio es requerido y debe ser mayor o igual a 0.'); return; }
            if (isNaN(productData.stock) || productData.stock < 0) { alert('Error: El stock es requerido y debe ser un número entero mayor o igual a 0.'); return; }

            if (existingId) { // Actualizar
                products = products.map(p => p.id === existingId ? productData : p);
            } else { // Crear
                if (products.some(p => p.id === productData.id)) {
                    alert('Error: Ya existe un producto con este código.'); return;
                }
                products.push(productData);
            }
            saveAllProducts(products);
            alert('¡Producto guardado!');
            window.location.href = 'productos.html';
        });
    }

    // --- EVENT LISTENER GLOBAL PARA BOTONES DE ELIMINAR ---
    document.body.addEventListener('click', (e) => {
        // Eliminar producto
        if (e.target.classList.contains('delete-btn')) {
            const productId = e.target.dataset.id;
            if (confirm(`¿Seguro que quieres eliminar el producto ${productId}?`)) {
                let products = getAllProducts();
                products = products.filter(p => p.id !== productId);
                saveAllProducts(products);
                window.location.reload();
            }
        }
        // Eliminar usuario
        if (e.target.classList.contains('delete-user-btn')) {
            const userRun = e.target.dataset.run;
            if (confirm(`¿Seguro que quieres eliminar al usuario con RUN ${userRun}?`)) {
                let users = getAllUsers();
                users = users.filter(u => u.run !== userRun);
                saveAllUsers(users);
                window.location.reload();
            }
        }
    });

    // --- 🔹 FUNCIÓN DE DESCUENTOS ---
    function aplicarDescuentos(order, cliente) {
        let total = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        let descuento = 0;

        // Descuento por edad (< 18 años: 10%)
        const nacimiento = new Date(cliente.fechaNacimiento);
        const edad = new Date().getFullYear() - nacimiento.getFullYear();
        if (edad < 18) {
            descuento += total * 0.1;
        }

        // Descuento por código promocional
        if (cliente.codigoPromo && cliente.codigoPromo.toUpperCase() === "DESC20") {
            descuento += total * 0.2;
        }

        // Descuento por monto alto (> $100.000: 5%)
        if (total > 100000) {
            descuento += total * 0.05;
        }

        order.descuentoAplicado = descuento;
        order.total = total - descuento;

        return order;
    }

    // --- LÓGICA PARA LA PÁGINA DE VENTAS (ventas.html) ---
    const salesTableBody = document.getElementById('sales-table-body');
    if (salesTableBody) {
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        if (allOrders.length > 0) {
            salesTableBody.innerHTML = '';
            allOrders.reverse().forEach(order => {
                salesTableBody.innerHTML += `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.customer}</td>
                        <td>${order.total}</td>
                        <td>${order.status ? order.status : 'Pendiente'}</td>
                        <td class="actions-cell">
                            <a href="venta-detalle.html?id=${order.id}" class="edit-btn">Ver Detalle</a>
                        </td>
                    </tr>
                `;
            });
        } else {
            salesTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No se han registrado ventas.</td></tr>';
        }
    }

    // --- LÓGICA PARA LA PÁGINA DE DETALLE DE VENTA (venta-detalle.html) ---
    const orderDetailContainer = document.querySelector('.order-detail-container');
    if (orderDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        if (orderId) {
            let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            let order = allOrders.find(o => o.id === orderId);
            if (order) {
                document.getElementById('order-id-title').textContent = `Detalle del Pedido ${order.id}`;
                document.getElementById('order-id').textContent = order.id;
                document.getElementById('order-date').textContent = order.date;
                document.getElementById('order-customer').textContent = order.customer;
                document.getElementById('order-total').textContent = order.total;
                // Mostrar estado actual y permitir actualizarlo
                const statusContainer = document.getElementById('order-status-container');
                if (statusContainer) {
                    statusContainer.innerHTML = `
                        <label for="order-status-select">Estado del pedido:</label>
                        <select id="order-status-select">
                            <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                            <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
                        </select>
                        <button id="update-status-btn">Actualizar Estado</button>
                    `;
                    const updateStatusBtn = document.getElementById('update-status-btn');
                    updateStatusBtn.addEventListener('click', () => {
                        const newStatus = document.getElementById('order-status-select').value;
                        order.status = newStatus;
                        const orderIndex = allOrders.findIndex(o => o.id === order.id);
                        if (orderIndex !== -1) {
                            allOrders[orderIndex] = order;
                            localStorage.setItem('orders', JSON.stringify(allOrders));
                            alert('Estado del pedido actualizado.');
                            window.location.reload();
                        }
                    });
                }
            } else {
                orderDetailContainer.innerHTML = '<p>Pedido no encontrado.</p>';
            }
        }
    }

    // --- 🔹 NUEVO: BOTÓN FINALIZAR COMPRA (checkout.html) ---
    const checkoutBtn = document.getElementById('finalizar-compra-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('cart')) || [];
            const cliente = JSON.parse(localStorage.getItem('currentCustomer')) || null;

            if (!cliente) { alert('Debe iniciar sesión para finalizar la compra.'); return; }
            if (carrito.length === 0) { alert('El carrito está vacío.'); return; }

            let order = {
                id: `ORD-${Date.now()}`,
                date: new Date().toLocaleString(),
                customer: cliente.nombre + ' ' + cliente.apellidos,
                items: carrito,
                status: 'Pendiente'
            };

            order = aplicarDescuentos(order, cliente);

            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            localStorage.removeItem('cart'); // Vaciar carrito
            window.location.href = 'confirmacion.html';
        });
    }

});
