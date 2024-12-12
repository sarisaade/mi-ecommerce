// script.js

// Función para generar los productos en formato JSON
function generateProducts() {
    return [
      { id: 1, name: "Camisa Clásica", description: "Descripción de la camisa clásica.", price: 30 },
      { id: 2, name: "Pantalón Moderno", description: "Descripción del pantalón moderno.", price: 45 },
      { id: 3, name: "Pantalón Clásico", description: "Descripción del pantalón clásico.", price: 45 },
      { id: 4, name: "Pantalón con Costura Gruesa", description: "Descripción del pantalón con costura gruesa.", price: 45 },
      { id: 5, name: "Pantalón de Gabardina", description: "Descripción del pantalón de gabardina.", price: 45 },
      { id: 6, name: "Chombas", description: "Descripción de la chomba.", price: 45 }
    ];
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
  

document.getElementById('cantidad-mas').addEventListener('click', function() {
    var cantidad = document.getElementById('cantidad-1');
    cantidad.value++;
});

  
  // Nueva función para eliminar una unidad del producto del carrito
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
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        ${product.quantity}   ${product.name} (Talle: ${product.talle}) - Precio: $${(product.price * product.quantity).toFixed(2)}
        <button class="remove-from-cart" data-id="${product.id}" data-talle="${product.talle}"><img src="./icono quitar carrito.png" alt=""></button>
      `;
      cartContainer.appendChild(listItem);
    });
  
    updateCartTotal();
  
    // Añadir funcionalidad a los botones de eliminación
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const productTalle = button.getAttribute('data-talle');
        removeFromCart(productId, productTalle);
      });
    });
  }
  
  // Función para actualizar el total del carrito
  function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    document.querySelector('.cart-total').textContent = cartTotal.toFixed(2);
  }
  // Nueva función para navegar a la página del carrito 
  function goToCartPage() { window.location.href = 'carrito1.html'; }
  
  // Ejecutar la función cuando el DOM esté cargado
  document.addEventListener('DOMContentLoaded', () => {
    addViewMoreButton();
    displayCart();
  
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
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
  
    document.querySelector('.clear-cart').addEventListener('click', () => {
      localStorage.removeItem('cart');
      displayCart();
    });
  });
  // validateForm.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formErrors = document.getElementById('form-errors');
  
    form.addEventListener('submit', (event) => {
      let errors = [];
  
      // Validación de nombre
      if (nameInput.value.trim() === '') {
        errors.push('El nombre es obligatorio.');
      }
  
      // Validación de correo electrónico
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value)) {
        errors.push('El correo electrónico no es válido.');
      }
  
      // Validación de mensaje
      if (messageInput.value.trim() === '') {
        errors.push('Debe escribir un mensaje.');
      }
  
      // Mostrar errores si hay
      if (errors.length > 0) {
        event.preventDefault();
        formErrors.classList.add('error-message');
        formErrors.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
      } else {
        formErrors.innerHTML = '';
        formErrors.classList.remove('error-message');
      }
    });
  });
  
// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const confirmarCarritoBtn = document.getElementById('confirmar-carrito-btn');
  const dialog = document.getElementById('dialog');
  const confirmationForm = document.getElementById('confirmation-form');
  const confirmationMessage = document.createElement('div');

  // Crear mensaje de confirmación estilizado
  confirmationMessage.id = 'confirmation-message';
  confirmationMessage.style.display = 'none';
  confirmationMessage.style.position = 'fixed';
  confirmationMessage.style.top = '50%';
  confirmationMessage.style.left = '50%';
  confirmationMessage.style.transform = 'translate(-50%, -50%)';
  confirmationMessage.style.padding = '20px';
  confirmationMessage.style.backgroundColor = '#f9f9f9';
  confirmationMessage.style.border = '1px solid #ccc';
  confirmationMessage.style.borderRadius = '10px';
  confirmationMessage.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  document.body.appendChild(confirmationMessage);

  confirmarCarritoBtn.addEventListener('click', () => {
    dialog.style.display = 'block';
  });

  confirmationForm.addEventListener('submit', (event) => {
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
    confirmationMessage.innerHTML = `
      <h2>Compra Confirmada</h2>
      <p>¡Gracias por su compra, ${document.getElementById('buyer-name').value}!
      Pronto nos pondremos en contacto con Ud!</p>
      <button onclick="document.getElementById('confirmation-message').style.display='none'">Cerrar</button>
    `;
    confirmationMessage.style.display = 'block';
    dialog.style.display = 'none';
  });
});

  