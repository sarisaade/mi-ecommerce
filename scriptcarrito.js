// Función para agregar producto al carrito
function addToCart(productId, productName, productPrice, productTalle, productQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        talle: productTalle,
        quantity: productQuantity
    };

    const existingProduct = cart.find(item => item.id === productId && item.talle === productTalle);

    if (existingProduct) {
        existingProduct.quantity += productQuantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Función para eliminar una unidad del producto del carrito
function removeFromCart(productId, productTalle) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === productId && item.talle === productTalle);

    if (existingProduct) {
        existingProduct.quantity -= 1;
        if (existingProduct.quantity <= 0) {
            cart = cart.filter(item => !(item.id === productId && item.talle === productTalle));
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Función para mostrar los productos en el carrito
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = '';

    cart.forEach(product => {
        const listItem = document.createElement('div');
        listItem.classList.add('cart-item');
        listItem.innerHTML = `
            <button class="decrease-quantity" data-id="${product.id}" data-talle="${product.talle}">-</button>
            <p>${product.quantity} x ${product.name} (Talle: ${product.talle}) - Precio: $${(product.price * product.quantity).toFixed(2)}</p>
            <button class="increase-quantity" data-id="${product.id}" data-talle="${product.talle}">+</button>
        `;
        cartContainer.appendChild(listItem);
    });

    updateCartTotal();

    // Añadir funcionalidad a los botones de eliminación y aumento de cantidad
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(button.getAttribute('data-id'));
            const productTalle = button.getAttribute('data-talle');
            removeFromCart(productId, productTalle);
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(button.getAttribute('data-id'));
            const productTalle = button.getAttribute('data-talle');
            addToCart(productId, null, null, productTalle, 1); // Incrementar la cantidad en 1
        });
    });
}

// Función para actualizar el total del carrito
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    document.querySelector('.cart-total').textContent = cartTotal.toFixed(2);
}

// Inicializar la página del carrito
document.addEventListener('DOMContentLoaded', function() {
    displayCart();

    document.querySelector('.clear-cart').addEventListener('click', function() {
        localStorage.removeItem('cart');
        displayCart();
    });

    document.getElementById('confirmar-carrito-btn').addEventListener('click', function() {
        document.getElementById('dialog').style.display = 'block';
    });

    document.getElementById('confirmation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validar número de teléfono
        const phoneInput = document.getElementById('buyer-phone');
        const phonePattern = /^[0-9]{10,15}$/; // Permitir solo números de 10 a 15 dígitos
        if (!phonePattern.test(phoneInput.value)) {
            alert('Por favor, ingrese un número de teléfono válido.');
            return;
        }

        // Validar correo electrónico
        const emailInput = document.getElementById('buyer-email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        // Mostrar mensaje de confirmación estilizado
        const confirmationMessage = document.getElementById('confirmation-message');
        confirmationMessage.innerHTML = `
          <h2>Compra Confirmada</h2>
          <p>¡Gracias por su compra, ${document.getElementById('buyer-name').value}!
          Pronto nos pondremos en contacto con Ud!</p>
          <button onclick="document.getElementById('confirmation-message').style.display='none'">Cerrar</button>
        `;
        confirmationMessage.style.display = 'block';
        document.getElementById('dialog').style.display = 'none';

        // Vaciar el carrito después de la confirmación
        localStorage.removeItem('cart');
        displayCart();
    });
});


