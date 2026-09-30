// ==========================================
// THE CORNER PANTRY - REGISTER & INVENTORY
// ==========================================

// PRODUCT DATA
const products = [
    {
        id: 1,
        name: "Basmati Rice",
        category: "Grains",
        price: 60,
        stock: 20,
        iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M12 11v6"/></svg>`
    },
    {
        id: 2,
        name: "Fresh Milk",
        category: "Dairy",
        price: 30,
        stock: 15,
        iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6v3H9z"/><path d="M8 5v2l-2 3v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10l-2-3V5"/><line x1="6" y1="14" x2="18" y2="14"/></svg>`
    },
    {
        id: 3,
        name: "Bread",
        category: "Bakery",
        price: 40,
        stock: 10,
        iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9c0-3.3 2.7-6 7-6s7 2.7 7 6v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9z"/><line x1="9" y1="9" x2="9" y2="13"/><line x1="15" y1="9" x2="15" y2="13"/></svg>`
    },
    {
        id: 4,
        name: "Maggi",
        category: "Snacks",
        price: 25,
        stock: 12,
        iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11c0 4.97 4.03 9 9 9s9-4.03 9-9H3z"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/><line x1="6" y1="6" x2="18" y2="2"/></svg>`
    },
    {
        id: 5,
        name: "Cold Drink",
        category: "Beverages",
        price: 35,
        stock: 8,
        iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6l1 14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-14H7z"/><line x1="5" y1="6" x2="19" y2="6"/><line x1="14" y1="2" x2="11" y2="10"/></svg>`
    },
    {
        id: 6,
        name: "Eggs",
        category: "Dairy",
        price: 60,
        stock: 6,
        iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3C8 3 5 8 5 14a7 7 0 0 0 14 0c0-6-3-11-7-11z"/></svg>`
    }
];

let cart = [];
let currentCategory = "All";
let receiptOrderNumber = 1042;

// CATEGORY FILTER HELPER
function getCategoryClass(cat) {
    switch (cat.toLowerCase()) {
        case "grains": return "cat-grains";
        case "dairy": return "cat-dairy";
        case "bakery": return "cat-bakery";
        case "snacks": return "cat-snacks";
        case "beverages": return "cat-beverages";
        default: return "";
    }
}

// ==========================================
// DISPLAY PRODUCTS
// ==========================================
function displayProducts(productList = null) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;
    productGrid.innerHTML = "";

    const list = productList !== null ? productList : getFilteredList();

    if (list.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 40px 20px; color: #7f8883;">
                <p style="font-weight: 500;">No items found matching your selection.</p>
            </div>
        `;
        return;
    }

    list.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        const outOfStock = product.stock <= 0;
        const catClass = getCategoryClass(product.category);

        card.innerHTML = `
            <div class="product-top">
                <div class="product-icon-box ${catClass}">
                    ${product.iconSvg}
                </div>
                <span class="category">${product.category}</span>
            </div>

            <h4>${product.name}</h4>
            <p class="product-price">₹${product.price.toFixed(2)}</p>
            <p class="stock">${product.stock > 0 ? product.stock + " units in stock" : "Currently out of stock"}</p>

            <button
                class="add-btn"
                onclick="addToCart(${product.id})"
                ${outOfStock ? "disabled" : ""}
            >
                ${outOfStock ? "Out of Stock" : "+ Add to Bill"}
            </button>
        `;

        productGrid.appendChild(card);
    });
}

// ==========================================
// FILTERING & SEARCH
// ==========================================
function filterCategory(category) {
    currentCategory = category;

    // Update active filter chip
    document.querySelectorAll(".filter-chip").forEach(chip => {
        const text = chip.innerText.trim();
        if (category === "All" && text.includes("All")) {
            chip.classList.add("active");
        } else if (text.toLowerCase() === category.toLowerCase()) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });

    displayProducts();
}

function searchProducts() {
    displayProducts();
}

function getFilteredList() {
    const searchInput = document.getElementById("searchInput");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    return products.filter(product => {
        const matchCategory = currentCategory === "All" || product.category.toLowerCase() === currentCategory.toLowerCase();
        const matchSearch = product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
        return matchCategory && matchSearch;
    });
}

// ==========================================
// CART OPERATIONS
// ==========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        showToast("Product is out of stock!", "warning");
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        if (existingProduct.quantity < product.stock) {
            existingProduct.quantity++;
            showToast(`Added another ${product.name} to order`, "info");
        } else {
            showToast(`Stock limit reached for ${product.name} (${product.stock} available)`, "warning");
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        showToast(`Added ${product.name} to order`, "info");
    }

    renderCart();
    calculateBill();
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (!product || !cartItem) return;

    if (cartItem.quantity < product.stock) {
        cartItem.quantity++;
        renderCart();
        calculateBill();
    } else {
        showToast(`Maximum available stock reached for ${product.name}`, "warning");
    }
}

function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    if (cartItem.quantity > 1) {
        cartItem.quantity--;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }

    renderCart();
    calculateBill();
}

function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(item => item.id !== productId);
    if (item) {
        showToast(`Removed ${item.name} from order`, "info");
    }
    renderCart();
    calculateBill();
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    renderCart();
    calculateBill();
    showToast("Order cleared", "info");
}

// ==========================================
// RENDER CART
// ==========================================
function renderCart() {
    const cartElement = document.getElementById("cart");
    const clearBtn = document.getElementById("clearCartBtn");

    if (!cartElement) return;

    if (cart.length === 0) {
        if (clearBtn) clearBtn.style.display = "none";
        cartElement.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                </div>
                <h4>Your order is empty</h4>
                <p>Add provisions from the shelves to start billing.</p>
            </div>
        `;
        return;
    }

    if (clearBtn) clearBtn.style.display = "block";
    cartElement.innerHTML = "";

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const maxStock = product ? product.stock : item.quantity;
        const subtotal = item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p class="item-unit-price">₹${item.price.toFixed(2)} each</p>
                <div class="cart-qty-ctrl">
                    <button class="qty-btn" onclick="decreaseQuantity(${item.id})" title="Decrease quantity">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${item.id})" ${item.quantity >= maxStock ? "disabled" : ""} title="Increase quantity">+</button>
                </div>
            </div>

            <div class="cart-right">
                <strong>₹${subtotal.toFixed(2)}</strong>
                <br>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;

        cartElement.appendChild(cartItem);
    });
}

// ==========================================
// CALCULATE BILL
// ==========================================
function calculateBill() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const discountSelect = document.getElementById("discount");
    const discountRate = discountSelect ? Number(discountSelect.value) : 0;
    const discountAmount = (subtotal * discountRate) / 100;
    const total = subtotal - discountAmount;

    const subtotalEl = document.getElementById("subtotal");
    const discountAmountEl = document.getElementById("discountAmount");
    const totalEl = document.getElementById("total");
    const billAmountEl = document.getElementById("billAmount");

    if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
    if (discountAmountEl) discountAmountEl.innerText = `₹${discountAmount.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `₹${total.toFixed(2)}`;
    if (billAmountEl) billAmountEl.innerText = `₹${total.toFixed(2)}`;
}

// ==========================================
// GENERATE BILL / COMPLETE SALE
// ==========================================
function generateBill() {
    if (cart.length === 0) {
        showToast("Please add at least one provision to the bill.", "warning");
        return;
    }

    // Verify stock
    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product && item.quantity > product.stock) {
            showToast(`Not enough stock available for ${product.name}!`, "warning");
            return;
        }
    }

    // Deduct stock
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    // Populate paper receipt modal
    receiptOrderNumber++;
    const receiptIdEl = document.getElementById("modalReceiptId");
    const receiptDateEl = document.getElementById("modalReceiptDate");
    const receiptItemsEl = document.getElementById("modalReceiptItems");
    const modalSubtotal = document.getElementById("modalSubtotal");
    const modalDiscount = document.getElementById("modalDiscount");
    const modalDiscountRow = document.getElementById("modalDiscountRow");
    const modalTotal = document.getElementById("modalTotal");

    if (receiptIdEl) receiptIdEl.innerText = `#CP-${receiptOrderNumber}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }) + " • " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (receiptDateEl) receiptDateEl.innerText = formattedDate;

    if (receiptItemsEl) {
        receiptItemsEl.innerHTML = "";
        cart.forEach(item => {
            const row = document.createElement("div");
            row.className = "receipt-item-row";
            const lineTotal = (item.price * item.quantity).toFixed(2);
            row.innerHTML = `
                <span class="receipt-item-name">${item.name}</span>
                <span>×${item.quantity}</span>
                <span>₹${item.price.toFixed(2)}</span>
                <span style="text-align: right; font-weight: 600;">₹${lineTotal}</span>
            `;
            receiptItemsEl.appendChild(row);
        });
    }

    const subtotalText = document.getElementById("subtotal").innerText;
    const discountText = document.getElementById("discountAmount").innerText;
    const totalText = document.getElementById("total").innerText;
    const discountRate = Number(document.getElementById("discount").value);

    if (modalSubtotal) modalSubtotal.innerText = subtotalText;
    if (modalDiscountRow && modalDiscount) {
        if (discountRate > 0) {
            modalDiscountRow.style.display = "flex";
            modalDiscount.innerText = `- ${discountText}`;
        } else {
            modalDiscountRow.style.display = "none";
        }
    }
    if (modalTotal) modalTotal.innerText = totalText;

    // Show Receipt Modal
    const modal = document.getElementById("receiptModal");
    if (modal) modal.style.display = "flex";

    // Refresh inventory and shelves
    displayProducts();
    displayInventory();
    updateLowStock();
}

function closeReceiptModal() {
    const modal = document.getElementById("receiptModal");
    if (modal) modal.style.display = "none";

    cart = [];
    renderCart();
    calculateBill();
    showToast("Sale completed. Register ready for next customer.", "success");
}

function printReceipt() {
    window.print();
}

// ==========================================
// DISPLAY INVENTORY
// ==========================================
function displayInventory() {
    const inventoryList = document.getElementById("inventoryList");
    if (!inventoryList) return;

    inventoryList.innerHTML = "";

    products.forEach(product => {
        let status;
        let statusClass;

        if (product.stock <= 0) {
            status = "Out of Stock";
            statusClass = "status-low";
        } else if (product.stock <= 5) {
            status = "Low Stock";
            statusClass = "status-low";
        } else {
            status = "Good Stock";
            statusClass = "status-good";
        }

        const row = document.createElement("div");
        row.className = "inventory-row";

        row.innerHTML = `
            <span>
                <strong>${product.name}</strong>
            </span>
            <span>
                ${product.category}
            </span>
            <span>
                ₹${product.price.toFixed(2)}
            </span>
            <span>
                ${product.stock} units
            </span>
            <span>
                <span class="inventory-status ${statusClass}">
                    ${status}
                </span>
            </span>
        `;

        inventoryList.appendChild(row);
    });
}

// ==========================================
// LOW STOCK COUNT & PRODUCT COUNT
// ==========================================
function updateLowStock() {
    const count = products.filter(product => product.stock <= 5).length;
    const el = document.getElementById("lowStock");
    if (el) el.innerText = count;
}

function updateProductCount() {
    const el = document.getElementById("productCount");
    if (el) el.innerText = products.length;
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px) scale(0.95)";
        toast.style.transition = "all 0.25s ease";
        setTimeout(() => toast.remove(), 260);
    }, 2800);
}

// ==========================================
// CURRENT DATE
// ==========================================
function displayDate() {
    const date = new Date();
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const el = document.getElementById("currentDate");
    if (el) el.innerText = date.toLocaleDateString("en-IN", options);
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================
displayProducts();
displayInventory();
updateLowStock();
updateProductCount();
displayDate();
calculateBill();