document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById('add-product-form');
  const productList = document.getElementById('product-list');
  const shoppingCart = document.getElementById('shopping-cart');
  let currentUser = 'User1032';

  const loadProducts = async () => {
      const response = await fetch('/api/products');
      const products = await response.json();
      productList.innerHTML = products.map(product => `
          <div class="product-item">
              <h3>${product.name}</h3>
              <p>$${product.price}</p>
              ${currentUser === 'Admin' ? `<button onclick="editProduct('${product.name}')">Edit</button>` : ''}
              <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
          </div>
      `).join('');
  };

  const loadCart = async () => {
      const response = await fetch('/api/cart');
      const cart = await response.json();
      shoppingCart.innerHTML = cart.map(product => `
          <p>${product.name} - $${product.price}</p>
      `).join('');
  };

  addProductForm && addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (currentUser === 'Admin') {
          const productName = document.getElementById('product-name').value;
          const productPrice = document.getElementById('product-price').value;
          const response = await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: productName, price: Number(productPrice) }),
          });
          const result = await response.json();
          alert(result.message);
          loadProducts();
          addProductForm.reset();
      } else {
          alert('Only Admin can add products.');
      }
  });

  window.addToCart = async (name, price) => {
      const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price }),
      });
      const result = await response.json();
      alert(result.message);
      loadCart();
  };

  loadProducts();
  loadCart();
});
