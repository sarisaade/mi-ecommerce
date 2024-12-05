// script.js

// Función para generar los productos en formato JSON
function generateProducts() {
    return [
      { id: 1, name: "Camisa Clásica", description: "Descripción de la camisa clásica.", price: 30 },
      { id: 2, name: "Pantalón Moderno", description: "Descripción del pantalón moderno.", price: 45 },
      { id: 3, name: "Pantalón Clásico", description: "Descripción del pantalón clásico.", price: 50 },
      { id: 4, name: "Pantalón con Costura Gruesa", description: "Descripción del pantalón con costura gruesa.", price: 45 },
      { id: 5, name: "Pantalón de Gabardina", description: "Descripción del pantalón de gabardina.", price: 45 },
      { id: 6, name: "Chombas", description: "Descripción de la chomba.", price: 45 }
    ];
  }
  
  // Función para agregar la descripción del producto al hacer clic en el botón
  function addDescriptionButton() {
    const products = generateProducts();
  
    products.forEach(product => {
      const button = document.createElement('button');
      button.textContent = "Mostrar Descripción";
      button.classList.add('description-button');
  
      button.addEventListener('click', () => {
        const productCard = document.querySelector(`.product-card[data-id='${product.id}']`);
        if (productCard) {
          const descriptionParagraph = document.createElement('p');
          descriptionParagraph.textContent = product.description;
          productCard.appendChild(descriptionParagraph);
          button.disabled = true; // Desactiva el botón después de agregar la descripción
        }
      });
 
  
      const productCard = document.querySelector(`.product-card[data-id='${product.id}']`);
      if (productCard) {
        productCard.appendChild(button);
      }
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
  
  // Función para mostrar los productos en el carrito
  function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = '';
  
    cart.forEach(product => {
      const listItem = document.createElement('li');
      listItem.textContent = `${product.name} (Talle: ${product.talle}) - Cantidad: ${product.quantity} - Precio: $${(product.price * product.quantity).toFixed(2)}`;
      cartContainer.appendChild(listItem);
    });
  
    updateCartTotal();
  }
  
  // Función para actualizar el total del carrito
  function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    document.querySelector('.cart-total').textContent = cartTotal.toFixed(2);
  }
  
  // Ejecutar la función cuando el DOM esté cargado
  document.addEventListener('DOMContentLoaded', () => {
    addDescriptionButton();
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
  
