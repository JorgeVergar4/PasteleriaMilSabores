document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE DATOS E INICIALIZACIÓN ---
    const initialProducts = [
        { id: 'TC001', category: 'Tortas Cuadradas', name: 'Torta Cuadrada de Chocolate', price: 45000, image: 'assets/images/TC001.jpg', description: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.', stock: 15, size: 'Familiar', personalizable: true },
        { id: 'TC002', category: 'Tortas Cuadradas', name: 'Torta Cuadrada de Frutas', price: 50000, image: 'assets/images/TC002.jpg', description: 'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.', stock: 12, size: 'Familiar', personalizable: true },
        { id: 'TT001', category: 'Tortas Circulares', name: 'Torta Circular de Vainilla', price: 40000, image: 'assets/images/TT001.jpg', description: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.', stock: 20, size: 'Familiar', personalizable: true },
        { id: 'TT002', category: 'Tortas Circulares', name: 'Torta Circular de Manjar', price: 42000, image: 'assets/images/TT002.jpg', description: 'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.', stock: 18, size: 'Familiar', personalizable: true },
        { id: 'PI001', category: 'Postres Individuales', name: 'Mousse de Chocolate', price: 5000, image: 'assets/images/PI001.jpg', description: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.', stock: 30, size: 'Individual', personalizable: false },
        { id: 'PI002', category: 'Postres Individuales', name: 'Tiramisú Clásico', price: 5500, image: 'assets/images/PI002.jpg', description: 'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.', stock: 25, size: 'Individual', personalizable: false },
        { id: 'PSA001', category: 'Productos Sin Azúcar', name: 'Torta Sin Azúcar de Naranja', price: 48000, image: 'assets/images/PSA001.jpg', description: 'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.', stock: 10, size: 'Familiar', personalizable: true },
        { id: 'PSA002', category: 'Productos Sin Azúcar', name: 'Cheesecake Sin Azúcar', price: 47000, image: 'assets/images/PSA002.jpg', description: 'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.', stock: 8, size: 'Familiar', personalizable: false },
        { id: 'PT001', category: 'Pastelería Tradicional', name: 'Empanada de Manzana', price: 3000, image: 'assets/images/PT001.jpg', description: 'Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.', stock: 40, size: 'Individual', personalizable: false },
        { id: 'PT002', category: 'Pastelería Tradicional', name: 'Tarta de Santiago', price: 6000, image: 'assets/images/PT002.jpg', description: 'Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.', stock: 20, size: 'Familiar', personalizable: false },
        { id: 'PG001', category: 'Productos Sin Gluten', name: 'Brownie Sin Gluten', price: 4000, image: 'assets/images/PG001.jpg', description: 'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.', stock: 25, size: 'Individual', personalizable: false },
        { id: 'PG002', category: 'Productos Sin Gluten', name: 'Pan Sin Gluten', price: 3500, image: 'assets/images/PG002.jpg', description: 'Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.', stock: 30, size: 'Individual', personalizable: false },
        { id: 'PV001', category: 'Productos Vegana', name: 'Torta Vegana de Chocolate', price: 50000, image: 'assets/images/PV001.jpg', description: 'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.', stock: 10, size: 'Familiar', personalizable: true },
        { id: 'PV002', category: 'Productos Vegana', name: 'Galletas Veganas de Avena', price: 4500, image: 'assets/images/PV002.jpg', description: 'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.', stock: 25, size: 'Individual', personalizable: false },
        { id: 'TE001', category: 'Tortas Especiales', name: 'Torta Especial de Cumpleaños', price: 55000, image: 'assets/images/TE001.jpg', description: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.', stock: 10, size: 'Familiar', personalizable: true },
        { id: 'TE002', category: 'Tortas Especiales', name: 'Torta Especial de Boda', price: 60000, image: 'assets/images/TE002.jpg', description: 'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.', stock: 5, size: 'Familiar', personalizable: true }
    ];

    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }
    const products = JSON.parse(localStorage.getItem('products'));

    // --- FUNCIONES GLOBALES ---
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
    const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
    
    const updateCartCounter = () => {
        const cart = getCart();
        const cartCounter = document.getElementById('cart-counter');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCounter) cartCounter.textContent = totalItems;
    }

    // Nueva función addToCart mejorada
    const addToCart = (productId, quantity = 1, message = null) => {
        const cart = getCart();
        quantity = parseInt(quantity) || 1;
        if (message) {
            const uniqueItemId = `${productId}-${Date.now()}`;
            cart.push({ id: productId, quantity, message, uniqueId: uniqueItemId });
        } else {
            const productInCart = cart.find(item => item.id === productId && !item.message);
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.push({ id: productId, quantity });
            }
        }
        saveCart(cart);
        updateCartCounter();
        alert('¡Producto añadido al carrito!');
    };

    const renderProducts = (container, productList) => {
        if (!container) return;
        container.innerHTML = '';
        productList.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-info">
                        <h3>${product.name}</h3>
                        <p class="price">$${product.price.toLocaleString('es-CL')}</p>
                        <a href="producto-detalle.html?id=${product.id}" class="btn btn-secondary">Ver Detalle</a>
                        <button class="btn add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
                    </div>
                </div>`;
            container.innerHTML += productCard;
        });
    };

    // --- HEADER DINÁMICO ---
    const updateUserHeader = () => {
        const userOptionsDiv = document.querySelector('.user-options');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && userOptionsDiv) {
            userOptionsDiv.innerHTML = `
                <a href="perfil.html" class="btn btn-secondary">Mi Perfil</a>
                <a href="#" id="logout-link" class="btn">Cerrar Sesión</a>
                <a href="carrito.html" class="cart-icon">
                    <img src="assets/images/carrito.svg" alt="Carrito de Compras">
                    <span id="cart-counter">0</span>
                </a>
            `;
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('currentUser');
                    localStorage.removeItem('cart');
                    window.location.href = 'index.html';
                });
            }
        }
    };

    // --- LÓGICA POR PÁGINA ---
    // Home
    const homeProductList = document.getElementById('product-list');
    if (homeProductList) {
        const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 6);
        renderProducts(homeProductList, featuredProducts);
    }

    // Productos (filtros)
    const allProductsList = document.getElementById('all-products-list');
    if (allProductsList) {
        const categoryFiltersContainer = document.getElementById('category-filters');
        const sizeFiltersContainer = document.getElementById('size-filters');
        let activeCategory = 'Todas';
        let activeSize = 'Todos';

        const applyFilters = () => {
            let filteredProducts = products;
            if (activeCategory !== 'Todas') { filteredProducts = filteredProducts.filter(p => p.category === activeCategory); }
            if (activeSize !== 'Todos') { filteredProducts = filteredProducts.filter(p => p.size === activeSize); }
            renderProducts(allProductsList, filteredProducts);
        };
        const categories = ['Todas', ...new Set(products.map(p => p.category))];
        categoryFiltersContainer.innerHTML = categories.map(c => `<button class="filter-btn ${c === 'Todas' ? 'active' : ''}" data-filter-type="category" data-value="${c}">${c}</button>`).join('');
    // Filtrar y mostrar solo tamaños válidos (no undefined, no vacíos, no repetidos)
    const uniqueSizes = Array.from(new Set(products.map(p => p.size).filter(s => s && typeof s === 'string')));
    const sizes = ['Todos', ...uniqueSizes];
    sizeFiltersContainer.innerHTML = sizes.map(s => `<button class="filter-btn ${s === 'Todos' ? 'active' : ''}" data-filter-type="size" data-value="${s}">${s}</button>`).join('');
        document.querySelector('.filters-sidebar').addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('filter-btn')) {
                const filterType = target.dataset.filterType;
                const value = target.dataset.value;
                if (filterType === 'category') {
                    activeCategory = value;
                    document.querySelectorAll('[data-filter-type="category"]').forEach(btn => btn.classList.remove('active'));
                }
                if (filterType === 'size') {
                    activeSize = value;
                    document.querySelectorAll('[data-filter-type="size"]').forEach(btn => btn.classList.remove('active'));
                }
                target.classList.add('active');
                applyFilters();
            }
        });
        applyFilters();
    }

    // Detalle
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.id === productId);

        if (product) {
            productDetailContainer.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-detail-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-detail-info">
                        <h1>${product.name}</h1>
                        <p class="category">Categoría: ${product.category}</p>
                        <p class="description">${product.description}</p>
                        <p class="price-detail">$${product.price.toLocaleString('es-CL')}</p>
                        <form id="add-to-cart-form" autocomplete="off">
                            <div class="form-group">
                                <label for="quantity">Cantidad:</label>
                                <input type="number" id="quantity" name="quantity" min="1" max="${product.stock}" value="1" required style="width: 60px;">
                            </div>
                            <div class="form-group" id="personalization-area" style="display: ${product.personalizable ? 'block' : 'none'};">
                                <label for="custom-message">Mensaje Especial (opcional):</label>
                                <input type="text" id="custom-message" name="custom-message" placeholder="¡Feliz Cumpleaños!" maxlength="50">
                            </div>
                            <button type="submit" class="btn add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
                        </form>
                    </div>
                </div>
            `;

            // --- Productos relacionados ---
            const relatedGrid = document.getElementById('related-products-grid');
            if (relatedGrid) {
                // Filtrar productos de la misma categoría, excluyendo el actual
                let related = products.filter(p => p.category === product.category && p.id !== product.id);
                // Si hay menos de 3, rellenar con otros productos aleatorios
                if (related.length < 3) {
                    const others = products.filter(p => p.id !== product.id && p.category !== product.category);
                    while (related.length < 3 && others.length > 0) {
                        const idx = Math.floor(Math.random() * others.length);
                        related.push(others.splice(idx, 1)[0]);
                    }
                }
                // Limitar a 3 productos
                related = related.slice(0, 3);
                relatedGrid.innerHTML = related.map(p => `
                    <div class="product-card">
                        <img src="${p.image}" alt="${p.name}">
                        <div class="product-card-info">
                            <h3>${p.name}</h3>
                            <p class="price">$${p.price.toLocaleString('es-CL')}</p>
                            <a href="producto-detalle.html?id=${p.id}" class="btn btn-secondary">Ver Detalle</a>
                            <button class="btn add-to-cart-btn" data-id="${p.id}">Añadir al Carrito</button>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            productDetailContainer.innerHTML = '<p>Producto no encontrado.</p>';
        }
    }

    // --- Página del Carrito (carrito.html) ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    let shippingCost = 0;
    let couponCode = "";

    // --- INICIO DE LA NUEVA LÓGICA PARA ENVÍO ---
    const shippingRegionSelect = document.getElementById('shipping-region');
    const shippingComunaSelect = document.getElementById('shipping-comuna');

    if (shippingRegionSelect && shippingComunaSelect && typeof regionesComunas !== 'undefined') {
        // Cargar regiones en el select
        shippingRegionSelect.innerHTML = '';
        regionesComunas.regiones.forEach((region, idx) => {
            shippingRegionSelect.innerHTML += `<option value="${region.nombre}"${idx === 0 ? ' selected' : ''}>${region.nombre}</option>`;
        });

        // Función para cargar las comunas correspondientes
        const cargarComunas = (regionNombre) => {
            shippingComunaSelect.innerHTML = '';
            const region = regionesComunas.regiones.find(r => r.nombre === regionNombre);
            if (region) {
                region.comunas.forEach(comuna => {
                    shippingComunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
                });
            }
        };

        // Seleccionar la primera región si no hay valor
        if (!shippingRegionSelect.value && regionesComunas.regiones.length > 0) {
            shippingRegionSelect.value = regionesComunas.regiones[0].nombre;
        }

        // Event listener para que las comunas cambien cuando se selecciona una región
        shippingRegionSelect.addEventListener('change', () => {
            cargarComunas(shippingRegionSelect.value);
        });

        // Cargar las comunas de la región seleccionada al iniciar
        cargarComunas(shippingRegionSelect.value);
    }
    // --- FIN DE LA NUEVA LÓGICA PARA ENVÍO ---

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return 0;
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function updateCartSummary() {
        const cart = getCart();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        let subtotal = 0;
        let discountAmount = 0;
        let total = 0;
        let discountLabel = '';
        let cartWithDetails = [];

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                subtotal += product.price * item.quantity;
                cartWithDetails.push({ ...item, ...product });
            }
        });

        // Descuentos
        let edad = 0;
        let promoCode = '';
        let isBirthday = false;
        if (currentUser) {
            edad = calcularEdad(currentUser.fechaNacimiento);
            promoCode = currentUser.promoCode || '';
            const today = new Date();
            const birthday = currentUser.fechaNacimiento ? new Date(currentUser.fechaNacimiento) : null;
            isBirthday = birthday && today.getDate() === birthday.getDate() && today.getMonth() === birthday.getMonth();
        }
        if (currentUser && currentUser.email && currentUser.email.endsWith('@duoc.cl') && isBirthday) {
            // Torta gratis: el producto más caro gratis
            const mostExpensiveItem = cartWithDetails.sort((a, b) => b.price - a.price)[0];
            if (mostExpensiveItem) {
                discountAmount = mostExpensiveItem.price;
                discountLabel = '¡Torta gratis por tu cumpleaños!';
            }
        } else if (edad >= 50) {
            discountAmount = subtotal * 0.5;
            discountLabel = 'Descuento (50% por edad)';
        } else if (couponCode === 'FELICES50' || promoCode === 'FELICES50') {
            discountAmount = subtotal * 0.1;
            discountLabel = 'Descuento (Código FELICES50)';
        }

        total = subtotal - discountAmount + shippingCost;

        // Actualizar DOM
        if (document.getElementById('cart-subtotal'))
            document.getElementById('cart-subtotal').textContent = `$${subtotal.toLocaleString('es-CL')}`;
        if (document.getElementById('cart-discount-row'))
            document.getElementById('cart-discount-row').style.display = discountAmount > 0 ? 'flex' : 'none';
        if (document.getElementById('cart-discount-label'))
            document.getElementById('cart-discount-label').textContent = discountLabel;
        if (document.getElementById('cart-discount-amount'))
            document.getElementById('cart-discount-amount').textContent = `-$${Math.round(discountAmount).toLocaleString('es-CL')}`;
        if (document.getElementById('cart-shipping-cost'))
            document.getElementById('cart-shipping-cost').textContent = `$${shippingCost.toLocaleString('es-CL')}`;
        if (document.getElementById('cart-total'))
            document.getElementById('cart-total').textContent = `$${Math.max(0, Math.round(total)).toLocaleString('es-CL')}`;
        if (cartSummaryContainer) cartSummaryContainer.style.display = cart.length > 0 ? 'block' : 'none';
    }

    function renderCartItems() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
            return;
        }
        let cartWithDetails = [];
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                cartWithDetails.push({ ...item, ...product, itemTotal });
            }
        });
        cartWithDetails.forEach(item => {
            const messageHTML = item.message ? `<p class="cart-item-message"><em>Mensaje: "${item.message}"</em></p>` : '';
            const descriptionHTML = item.description ? `<p class="cart-item-description">${item.description}</p>` : '';
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.uniqueId || item.id}">
                    <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        ${descriptionHTML}
                        ${messageHTML}
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-qty" ${item.message ? 'disabled' : ''}>-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-qty" ${item.message ? 'disabled' : ''}>+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-CL')}</div>
                    <div class="cart-item-total">$${item.itemTotal.toLocaleString('es-CL')}</div>
                    <button class="remove-item-btn">✖</button>
                </div>`;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
        if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
    }

    // --- FUNCIONES DE CARRITO ---
    function updateCartPage() { window.location.reload(); }
    function changeQuantity(productId, change) {
        const cart = getCart();
        const item = cart.find(i => i.id === productId && !i.message);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                const index = cart.indexOf(item);
                cart.splice(index, 1);
            }
            saveCart(cart);
            updateCartPage();
        }
    };

    const removeCartItem = (uniqueId) => {
        let cart = getCart();
        cart = cart.filter(item => (item.uniqueId || item.id) !== uniqueId);
        saveCart(cart);
        updateCartPage();
    };

    // Listeners para carrito
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;

            const productId = cartItem.dataset.id;

            if (target.classList.contains('increase-qty')) {
                changeQuantity(productId, 1);
            }
            if (target.classList.contains('decrease-qty')) {
                changeQuantity(productId, -1);
            }
            if (target.classList.contains('remove-item-btn')) {
                removeCartItem(productId);
            }
        });
    }


    // --- EVENT LISTENERS GLOBALES ---
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // Añadir al carrito (nuevo: soporta cantidad y mensaje desde el formulario)
        if (target.classList.contains('add-to-cart-btn')) {
            const form = target.closest('form');
            if (form && form.id === 'add-to-cart-form') {
                e.preventDefault();
                const productId = target.dataset.id;
                const quantityInput = form.querySelector('#quantity');
                const messageInput = form.querySelector('#custom-message');
                const quantity = quantityInput ? quantityInput.value : 1;
                const message = messageInput ? messageInput.value.trim() : null;
                addToCart(productId, quantity, message || null);
            } else {
                // Fallback para otros botones fuera del detalle
                const productId = target.dataset.id;
                addToCart(productId, 1, null);
            }
        }

        // Modificar cantidad y eliminar en el carrito
        if (target.closest('.cart-item')) {
            // (Aquí va la lógica para +/-/x que recarga la página)
            window.location.reload();
        }

        // Lógica de checkout
        if (target.classList.contains('btn-checkout')) {
            e.preventDefault();
            const cart = getCart();
            if (cart.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || { nombre: 'Invitado', email: '' };

            // 1. Crear un objeto de pedido completo con estado inicial 'Pendiente'
            const newOrder = {
                id: `ORD-${Date.now()}`,
                date: new Date().toLocaleDateString('es-CL'),
                customer: currentUser.nombre,
                total: document.getElementById('cart-total').textContent,
                items: [],
                status: 'Pendiente'
            };

            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    newOrder.items.push({
                        id: product.id,
                        name: product.name,
                        quantity: item.quantity,
                        price: product.price,
                        message: item.message || null
                    });
                }
            });
            // 2. Guardar el pedido en la lista general de órdenes
            const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            allOrders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(allOrders));
            // 3. Guardar solo este pedido para la página de confirmación
            localStorage.setItem('lastOrder', JSON.stringify(newOrder));
            // 4. Redirigir
            window.location.href = 'confirmacion.html';
        }
    });


    // Inicializar header y contador carrito
    updateUserHeader();
    updateCartCounter();

    // Lógica para los nuevos botones (envío y cupón)
    // (La lógica de shippingRegionSelect y comunas ya está arriba, no se repite aquí)

    const updateShippingBtn = document.getElementById('update-shipping-btn');
    if (updateShippingBtn) {
        updateShippingBtn.addEventListener('click', () => {
            // Simulación: genera un costo de envío aleatorio
            shippingCost = Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
            alert(`Costo de envío actualizado: $${shippingCost.toLocaleString('es-CL')}`);
            if (typeof updateCartSummary === 'function') updateCartSummary(); // Recalcular totales
        });
    }

    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
            const couponInput = document.getElementById('coupon-code');
            if (couponInput && couponInput.value.trim().toUpperCase() === 'FELICES50') {
                couponCode = 'FELICES50';
                alert('¡Cupón de descuento aplicado!');
                if (typeof updateCartSummary === 'function') updateCartSummary();
            } else {
                alert('El código del cupón no es válido.');
            }
        });
    }

    // Llamadas iniciales al cargar la página del carrito (si existen estas funciones)

    if (typeof renderCartItems === 'function') renderCartItems();
    if (typeof updateCartSummary === 'function') updateCartSummary();

});

