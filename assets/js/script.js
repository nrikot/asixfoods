const mainColor = [
  '#4fb856',
  '#def5d8',
  '#fbf3ea',
  '#21c063',
  '#1da855',
  '#f9c017',
];
const products = [
  {
    id: 1,
    name: 'Cookies Kastengel',
    desc: 'Renyah gurih keju premium, lumer di mulut.',
    price: 38000,
    priceFormatted: 'Rp 75.000',
    categories: ['cookies', 'gurih'],
    icon: '🧀',
    alergen: 'Mengandung susu, telur',
  },
  {
    id: 2,
    name: 'Cookies Nastar',
    desc: 'Selai nanas homemade, manis asam seimbang.',
    price: 42000,
    priceFormatted: 'Rp 75.000',
    categories: ['cookies'],
    icon: '🍍',
    alergen: 'Telur, susu',
  },
  {
    id: 3,
    name: 'Cookies Kacang Caramel',
    desc: 'Crunchy kacang tanah dengan lapisan caramel.',
    price: 45000,
    priceFormatted: 'Rp 75.000',
    categories: ['cookies'],
    icon: '🥜',
    alergen: 'Kacang tanah, susu',
  },
  {
    id: 4,
    name: 'Cookies Pistachios',
    desc: 'Pistachio asli, tekstur buttery & mewah.',
    price: 68000,
    priceFormatted: 'Rp 75.000',
    categories: ['cookies'],
    icon: '🌰',
    alergen: 'Kacang pistachio, susu',
  },
  {
    id: 5,
    name: 'Tempe Kering + Teri + Kacang Tanah',
    desc: 'Pedas manis, renyah gurih campuran tempe & ikan teri.',
    price: 32000,
    priceFormatted: 'Rp 32.000',
    categories: ['gurih', 'kering'],
    icon: '🫘',
    alergen: 'Mengandung kacang tanah, ikan',
  },
  {
    id: 6,
    name: 'Kentang Mustofa',
    desc: 'Kentang kering pedas manis khas Sunda, super renyah.',
    price: 28000,
    priceFormatted: 'Rp 28.000',
    categories: ['kering', 'gurih'],
    icon: '🥔',
    alergen: 'Bebas gluten',
  },
  {
    id: 7,
    name: 'Kacang Bawang',
    desc: 'Kacang tanah goreng dengan bawang putih asli.',
    price: 22000,
    priceFormatted: 'Rp 22.000',
    categories: ['gurih', 'camilan'],
    icon: '🧄',
    alergen: 'Kacang tanah',
  },
  {
    id: 8,
    name: 'Rempeyek Kacang Tanah',
    desc: 'Kerupuk renyah dengan taburan kacang tanah utuh.',
    price: 27000,
    priceFormatted: 'Rp 27.000',
    categories: ['camilan', 'rempeyek'],
    icon: '🍘',
    alergen: 'Kacang tanah',
  },
  {
    id: 9,
    name: 'Rempeyek Kedelai',
    desc: 'Gurih kedelai hitam/putih, kriuk tahan lama.',
    price: 25000,
    priceFormatted: 'Rp 25.000',
    categories: ['camilan', 'rempeyek'],
    icon: '🫛',
    alergen: 'Kedelai',
  },
  {
    id: 10,
    name: 'Rempeyek Kacang Ijo',
    desc: 'Renyah kacang hijau, rasa gurih tradisional.',
    price: 25000,
    priceFormatted: 'Rp 25.000',
    categories: ['camilan', 'rempeyek'],
    icon: '🟢',
    alergen: 'Kacang hijau',
  },
];

let currentFilter = 'all';
let cart = [];

// Fungsi untuk menyimpan cart ke localStorage
function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  updateCartCount();
}

// Fungsi untuk memuat cart dari localStorage
function loadCart() {
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount();
}

// Fungsi untuk update jumlah item di cart icon
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Fungsi untuk menambah produk ke cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      priceFormatted: product.priceFormatted,
      quantity: 1,
    });
  }

  saveCart();
  showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// Fungsi untuk menghapus item dari cart
function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    const productName = cart[index].name;
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    saveCart();
    showNotification(`${productName} dihapus dari keranjang`);
    renderCartModal(); // Refresh cart modal jika terbuka
  }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #4CAF50;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          animation: slideIn 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Fungsi untuk render modal keranjang
function renderCartModal() {
  let modal = document.getElementById('cartModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            justify-content: center;
            align-items: center;
          `;
    document.body.appendChild(modal);
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  modal.innerHTML = `
          <div style="background: white; border-radius: 16px; max-width: 500px; width: 90%; max-height: 80%; overflow: auto; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h2 style="margin: 0;">🛒 Keranjang Belanja</h2>
              <button id="closeCartModal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            ${
              cart.length === 0
                ? `
              <div style="text-align: center; padding: 40px;">
                <p>Keranjang masih kosong</p>
                <button id="continueShoppingBtn" style="background: ${mainColor[0]}; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Mulai Belanja</button>
              </div>
            `
                : `
              <div style="margin-bottom: 20px;">
                ${cart
                  .map(
                    (item) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <div style="flex: 2;">
                      <strong>${item.name}</strong>
                      <div>${item.priceFormatted}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <button class="cart-qty-btn" data-id="${item.id}" data-action="decrease" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer;">-</button>
                      <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                      <button class="cart-qty-btn" data-id="${item.id}" data-action="increase" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer;">+</button>
                      <button class="cart-remove-btn" data-id="${item.id}" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer;">Hapus</button>
                    </div>
                  </div>
                `,
                  )
                  .join('')}
              </div>
              <div style="border-top: 2px solid #333; padding-top: 15px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                  <span>Total:</span>
                  <span>Rp ${totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <button id="checkoutWA" style="width: 100%; background: ${mainColor[3]}; color: white; padding: 12px; border: none; border-radius: 12px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                <i class="fab fa-whatsapp"></i> Checkout via WhatsApp
              </button>
            `
            }
          </div>
        `;

  modal.style.display = 'flex';

  // Event listeners untuk modal
  document.getElementById('closeCartModal')?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document
    .getElementById('continueShoppingBtn')
    ?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

  document.querySelectorAll('.cart-qty-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === 'increase') {
        addToCart(productId);
      } else if (action === 'decrease') {
        removeFromCart(productId);
      }
      renderCartModal();
    });
  });

  document.querySelectorAll('.cart-remove-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(btn.dataset.id);
      const item = cart.find((i) => i.id === productId);
      if (item) {
        cart = cart.filter((i) => i.id !== productId);
        saveCart();
        renderCartModal();
      }
    });
  });

  document.getElementById('checkoutWA')?.addEventListener('click', () => {
    checkoutToWhatsApp();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Fungsi checkout ke WhatsApp
function checkoutToWhatsApp() {
  if (cart.length === 0) {
    showNotification('Keranjang masih kosong!');
    return;
  }

  let message =
    'Halo ASix Foods,%0A%0A*Saya ingin memesan produk berikut:*%0A%0A';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    message += `${index + 1}. ${item.name} - ${item.quantity} x ${item.priceFormatted} = Rp ${subtotal.toLocaleString('id-ID')}%0A`;
  });

  message += `%0A*Total: Rp ${total.toLocaleString('id-ID')}*%0A%0A`;
  message += `Mohon konfirmasi ketersediaan dan total biaya pengiriman. Terima kasih!`;

  window.open(`https://wa.me/628138131950?text=${message}`, '_blank');
}

// Fungsi untuk render produk
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const filtered =
    currentFilter === 'all'
      ? products
      : products.filter((p) => p.categories.includes(currentFilter));
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center;">Tidak ada produk untuk kategori ini</div>`;
    return;
  }
  grid.innerHTML = filtered
    .map(
      (prod) => `
            <div class="product-card">
                <div class="product-img">${prod.icon}</div>
                <div class="product-info">
                    <div class="product-title">${prod.name}</div>
                    <div class="product-desc">${prod.desc} <span style="font-size:0.7rem; display:block;">⚠️ ${prod.alergen}</span></div>
                    <div class="price">${prod.priceFormatted}</div>
                    <div style="margin: 5px 0; font-size:0.7rem; color:#b8860b;">🏷️ ${prod.categories.join(' • ')}</div>
                    <button class="btn-add-to-cart" data-id="${prod.id}">
                        🛒 Tambah ke Keranjang
                    </button>
                </div>
            </div>
        `,
    )
    .join('');

  // attach event listeners ke semua tombol add to cart
  document.querySelectorAll('.btn-add-to-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(btn.getAttribute('data-id'));
      addToCart(productId);
    });
  });
}

// setup filter
function setupFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderProducts();
    });
  });
}

// Setup cart icon di navbar
function setupCartIcon() {
  const navbar = document.querySelector('nav') || document.body;
  let cartIcon = document.getElementById('cartIcon');
  let cartIconUpper = document.getElementById('whatsappCartBtn');

  if (!cartIcon) {
    cartIcon = document.createElement('div');
    cartIcon.id = 'cartIcon';
    cartIcon.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: ${mainColor[0]};
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: transform 0.2s;
          `;
    cartIcon.innerHTML = `
            <span style="font-size: 24px;">🛒</span>
            <span id="cartCount" style="
              position: absolute;
              top: -5px;
              right: -5px;
              background: #ff4444;
              color: white;
              border-radius: 50%;
              width: 22px;
              height: 22px;
              display: none;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
            ">0</span>
          `;
    document.body.appendChild(cartIcon);

    cartIcon.addEventListener('mouseenter', () => {
      cartIcon.style.transform = 'scale(1.1)';
    });
    cartIcon.addEventListener('mouseleave', () => {
      cartIcon.style.transform = 'scale(1)';
    });
    cartIcon.addEventListener('click', () => {
      renderCartModal();
    });
    cartIconUpper.addEventListener('click', () => {
      renderCartModal();
    });
  }
}

// Fungsi lainnya (initWhatsAppButtons, setupFaq, dll)
function initWhatsAppButtons() {
  // const waCartBtn = document.getElementById('whatsappCartBtn');
  // if (waCartBtn) {
  //   waCartBtn.addEventListener('click', () => {
  //     window.open(
  //       'https://wa.me/628138131950?text=Halo%20ASix%20Foods%2C%20saya%20ingin%20order%20produk%20ASix%20Foods.%20Mohon%20infonya.',
  //       '_blank',
  //     );
  //   });
  // }
  const customBtn = document.getElementById('customOrderBtn');
  if (customBtn) {
    customBtn.addEventListener('click', () => {
      window.open(
        'https://wa.me/628138131950?text=Halo%20ASix%20Foods%2C%20saya%20tertarik%20untuk%20Custom%20Order%20%2F%20hampers%20dalam%20jumlah%20besar.%20Mohon%20informasi%20lebih%20lanjut.',
        '_blank',
      );
    });
  }
}

function setupFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionDiv = item.querySelector('.faq-question');
    const answer = document.createElement('div');
    answer.style.display = 'none';
    answer.style.paddingTop = '8px';
    answer.style.fontSize = '0.85rem';
    answer.style.color = '#6b4c33';
    const answerText =
      item.innerText.split('+')[1]?.trim() || 'Klik untuk detail';
    answer.innerText = answerText;
    item.innerHTML = '';
    item.appendChild(questionDiv);
    item.appendChild(answer);
    questionDiv.style.cursor = 'pointer';
    questionDiv.addEventListener('click', () => {
      const isVisible = answer.style.display === 'block';
      answer.style.display = isVisible ? 'none' : 'block';
    });
  });
}

// Tambahkan CSS untuk animasi
function addAnimations() {
  const style = document.createElement('style');
  style.textContent = `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          .btn-add-to-cart {
            background: ${mainColor[5]};
            color: black;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
            width: 100%;
            margin-top: 8px;
          }
          .btn-add-to-cart:hover {
            background: ${mainColor[4]};
            color: white;
          }
        `;
  document.head.appendChild(style);
}

// Initialize semua fungsi
window.addEventListener('DOMContentLoaded', () => {
  addAnimations();
  loadCart();
  renderProducts();
  setupFilters();
  initWhatsAppButtons();
  setupFaq();
  setupCartIcon();

  // Search functionality
  const searchInput = document.createElement('input');
  searchInput.placeholder = '🔍 Cari produk... (nastar, rempeyek, dll)';
  searchInput.style.padding = '10px 18px';
  searchInput.style.borderRadius = '40px';
  searchInput.style.border = '1px solid #e2cfbe';
  searchInput.style.width = '100%';
  searchInput.style.marginBottom = '20px';
  const produkSection = document.getElementById('produk');
  const filterDiv = document.querySelector('.filter-buttons');
  produkSection.insertBefore(searchInput, filterDiv);

  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredManual = products.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.desc.toLowerCase().includes(keyword),
    );
    const grid = document.getElementById('productsGrid');
    if (keyword === '') {
      renderProducts();
      return;
    }
    if (filteredManual.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center;">Tidak ada produk dengan kata "${keyword}"</div>`;
      return;
    }
    grid.innerHTML = filteredManual
      .map(
        (prod) => `
                <div class="product-card">
                    <div class="product-img">${prod.icon}</div>
                    <div class="product-info">
                        <div class="product-title">${prod.name}</div>
                        <div class="product-desc">${prod.desc} <span style="font-size:0.7rem;">⚠️ ${prod.alergen}</span></div>
                        <div class="price">${prod.priceFormatted}</div>
                        <div style="margin: 5px 0; font-size:0.7rem; color:#b8860b;">🏷️ ${prod.categories.join(' • ')}</div>
                        <button class="btn-add-to-cart" data-id="${prod.id}">
                            🛒 Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            `,
      )
      .join('');
    document.querySelectorAll('.btn-add-to-cart').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(btn.getAttribute('data-id'));
        addToCart(productId);
      });
    });
  });
});
