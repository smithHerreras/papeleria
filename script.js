  function searchProducts() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".product").forEach(product => {
      let name = product.getAttribute("data-name").toLowerCase();
      if (name.includes(searchTerm)) {
        product.style.display = "flex";
      } else {
        product.style.display = "none";
      }
    });
  }

  let cart = [];
  function addToCart(id, name, price, quantity) {
    quantity = parseInt(quantity);
    let item = cart.find(p => p.id === id);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.push({ id, name, price, quantity });
    }
    renderCart();
  }
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
  function updateQuantity(id, quantity) {
    let item = cart.find(p => p.id === id);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    renderCart();
  }
  function renderCart() {
    const cartContainer = document.getElementById('cart');
    const cartDetails = document.getElementById('cart-details');
    cartContainer.innerHTML = '';
    cartDetails.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      cartContainer.innerHTML += `
        <div class="cart-item">
          <h4>${item.name}</h4>
          <p>Precio: S/${item.price}</p>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
          <button onclick="removeFromCart(${item.id})" title="Eliminar">🗑️</button>
          <button onclick="applyProductDiscount(${item.id})" title="Descuento">🏷️</button>
        </div>`;
      cartDetails.innerHTML += `<p class="parrafo">${item.quantity} x ${item.name} - S/${(item.price * item.quantity).toFixed(2)}</p>`;
    });
    document.getElementById('total').innerText = total.toFixed(2);
  }
  function getNumericInput(message) {
    return new Promise((resolve, reject) => {
      const modal = document.getElementById("numeric-modal");
      const modalMessage = document.getElementById("modal-message");
      const modalInput = document.getElementById("modal-input");
      const modalAccept = document.getElementById("modal-accept");
      
      modalMessage.textContent = message;
      modalInput.value = "";
      modal.style.display = "flex";
      modalInput.focus();
      
      modalAccept.onclick = function() {
        let value = parseFloat(modalInput.value);
        modal.style.display = "none";
        resolve(value);
      };
    });
  }
  async function applyProductDiscount(id) {
    let discount = await getNumericInput('Ingrese el descuento en soles para este producto:');
    let item = cart.find(p => p.id === id);
    if (item && !isNaN(discount) && discount >= 0) {
      // Se asume que el descuento se aplica al precio unitario
      item.price = Math.max(0, item.price - discount);
      renderCart();
    }
  }
  function toggleCart() {
    let cartContainer = document.getElementById("cart-container");
    cartContainer.classList.toggle("open");
  }
  function sendCartAsImage() {
    let number = document.getElementById("whatsapp-number").value.trim();
    if (!number) {
      alert("Por favor, ingrese un número de WhatsApp.");
      return;
    }
    const cartSummary = document.getElementById("cart-summary");
    html2canvas(cartSummary).then(canvas => {
      let image = canvas.toDataURL("image/png");
      // Genera un nombre único usando la marca de tiempo
      let filename = "pedido_" + new Date().getTime() + ".png";
      let link = document.createElement("a");
      link.href = image;
      link.download = filename;
      link.click();
      setTimeout(() => {
        let whatsappUrl = `https://wa.me/${number}?text=Pedido adjunto en imagen.`;
        window.open(whatsappUrl, '_blank');
      }, 1000);
    });
  }