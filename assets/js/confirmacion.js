document.addEventListener('DOMContentLoaded', () => {
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');
    const viewReceiptBtn = document.getElementById('view-receipt-btn');
    const orderDetails = JSON.parse(localStorage.getItem('lastOrder'));

    // 1. Rellenar la página con los datos del pedido guardado
    if (orderDetails && summaryItems && summaryTotal) {
        summaryItems.innerHTML = orderDetails.items.map(item => `
            <div class="item">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toLocaleString('es-CL')}</span>
            </div>
        `).join('');
        summaryTotal.innerHTML = `<strong>Total Pagado: ${orderDetails.total}</strong>`;
    } else {
        if(summaryItems) summaryItems.innerHTML = "<p>No se encontraron detalles del pedido.</p>";
    }

    // 2. Lógica para el botón "Ver Boleta"
    if (viewReceiptBtn) {
        viewReceiptBtn.addEventListener('click', () => {
            if (!orderDetails) {
                alert("No hay detalles del pedido para mostrar en la boleta.");
                return;
            }
            
            const receiptWindow = window.open('', 'Boleta');
            receiptWindow.document.write(`
                <html>
                    <head><title>Boleta - Pastelería Mil Sabores</title></head>
                    <body style="font-family: sans-serif; padding: 20px;">
                        <h2>Boleta Electrónica</h2>
                        <p><strong>Pastelería Mil Sabores</strong></p>
                        <p>Fecha: ${new Date().toLocaleDateString('es-CL')}</p>
                        <hr>
                        <h3>Detalle</h3>
                        ${summaryItems.innerHTML.replace(/<span/g, '<p').replace(/<\/span>/g, '</p>')}
                        <hr>
                        <h3>${summaryTotal.innerHTML}</h3>
                        <p>¡Gracias por tu preferencia!</p>
                        <script>setTimeout(() => window.print(), 500);<\/script>
                    </body>
                </html>
            `);
        });
    }

    // 3. Limpiar el carrito después de que la compra fue confirmada
    localStorage.removeItem('cart');
});