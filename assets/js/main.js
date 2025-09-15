document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LISTA DE PRODUCTOS INICIAL ---
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
    // Guardar en localStorage si no existen para persistencia de datos
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    // Cargar productos desde localStorage
    const products = JSON.parse(localStorage.getItem('products'));

    // --- 2. FUNCIÓN PARA "DIBUJAR" PRODUCTOS ---
    const renderProducts = (container, productList) => {
        if (!container) return; // Si no encuentra el contenedor, no hace nada
        container.innerHTML = ''; // Limpiar el contenedor
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

    // --- LÓGICA PARA MOSTRAR PRODUCTOS EN CADA PÁGINA ---

    // A. En la página de inicio (index.html), mostrando 4 productos destacados al azar los que tu quieras .
    const homeProductList = document.getElementById('product-list');
    if (homeProductList) {
        const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0,4);
        renderProducts(homeProductList, featuredProducts);
    }

    // B. En la página de productos (productos.html), muestra el catálogo completo.
    const allProductsList = document.getElementById('all-products-list');
    if (allProductsList) {
        renderProducts(allProductsList, products);
        // Nota: La lógica de los filtros se añadirá en una tarea futura.
    }

});