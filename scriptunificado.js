// URL de la API (Fake Store API)
const apiURL = 'https://fakestoreapi.com/products';

// Función para obtener los datos de la API
async function fetchData() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para generar el HTML de una card
function createCard(product) {
    return `
    <div class="product-card">
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}">Agregar al carrito</button>
    </div>`;
}

// Función para mostrar los datos en el HTML y añadir eventos de clic
async function displayData() {
    const main = document.querySelector('.product-container');
    const data = await fetchData();

    if (data && Array.isArray(data)) {
        main.innerHTML += data.map(createCard).join('');
    }

    // Añadir eventos de clic a los nuevos botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(button.getAttribute('data-id'));
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            const productTalle = ''; // o cualquier otro valor predeterminado
            const productQuantity = 1; // o cualquier otro valor predeterminado
            addToCart(productId, productName, productPrice, productTalle, productQuantity);
        });
    });
}

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', displayData);

// Aquí va el resto de tu scriptunificado.js
// Función para mostrar notificación de producto agregado
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

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
    
    // Mostrar notificación
    showNotification('Producto agregado al carrito');
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

// Función para mostrar las imágenes adicionales al hacer clic en "Ver más"
function addViewMoreButton() {
    document.querySelectorAll('.ver-mas').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const extraImages = document.getElementById(`extra-images-${productId}`);
            if (extraImages.style.display === 'none' || extraImages.style.display === '') {
                extraImages.style.display = 'block';
                button.textContent = "Ver menos";
            } else {
                extraImages.style.display = 'none';
                button.textContent = "Ver más";
            }
        });
    });
}

// Función para inicializar la página
function initPage() {
    displayCart();
    addViewMoreButton();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(button.getAttribute('data-id'));
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            const productTalle = document.querySelector(`#talle-${productId}`).value;
            const productQuantity = parseInt(document.querySelector(`#cantidad-${productId}`).value);
            if (productTalle && productQuantity > 0) {
                addToCart(productId, productName, productPrice, productTalle, productQuantity);
            } else {
                alert("Por favor, selecciona un talle y una cantidad válida.");
            }
        });
    });

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
}

// Ejecutar la función initPage cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initPage);
