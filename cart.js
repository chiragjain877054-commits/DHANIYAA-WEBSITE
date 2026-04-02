// ===== CART MODULE =====
const Cart = (() => {
  const STORAGE_KEY = 'bantyTraders_cart';

  let items = [];

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      items = saved ? JSON.parse(saved) : [];
    } catch (e) {
      items = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getItems() { return items; }

  function addItem(id, name, price, size) {
    const existing = items.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id, name, price, size, qty: 1 });
    }
    save();
    render();
    updateCount();
    return existing ? 'increased' : 'added';
  }

  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    save();
    render();
    updateCount();
  }

  function changeQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeItem(id);
      return;
    }
    save();
    render();
    updateCount();
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getTotalCount() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function updateCount() {
    const countEl = document.getElementById('cart-count');
    const n = getTotalCount();
    countEl.textContent = n;

    // bump animation
    countEl.classList.remove('bump');
    void countEl.offsetWidth;
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 400);
  }

  function render() {
    const container = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total');

    if (items.length === 0) {
      empty.style.display = 'block';
      footer.style.display = 'none';
      container.innerHTML = '';
      container.appendChild(empty);
      return;
    }

    empty.style.display = 'none';
    footer.style.display = 'block';

    const html = items.map(item => `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-icon">🌿</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">${item.size} pack</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="Cart.changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          <button class="cart-item-remove" onclick="Cart.removeItem(${item.id})" title="Remove">✕</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
    totalEl.textContent = '₹' + getTotal().toLocaleString('en-IN');
  }

  function init() {
    load();
    render();
    updateCount();
  }

  return { init, addItem, removeItem, changeQty, getItems, getTotal };
})();

// Global functions for onclick handlers
function addToCart(id, name, price, size) {
  const status = Cart.addItem(id, name, price, size);
  showToast(status === 'added' ? `✓ ${name} added to cart!` : `✓ Quantity updated!`);
  openCart();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
