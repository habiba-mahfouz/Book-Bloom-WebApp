document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Check
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        window.location.href = '../login/login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);

    // DOM Elements
    const cartList = document.getElementById('cartList');
    const subtotalValue = document.getElementById('subtotalValue');
    const headerProfileBtn = document.getElementById('headerProfileBtn');

    // Update Header Profile Icon
    if (headerProfileBtn && currentUser) {
        if (currentUser.profileImage) {
            headerProfileBtn.innerHTML = `<img src="${currentUser.profileImage}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
        } else if (currentUser.avatarLetter) {
            headerProfileBtn.innerHTML = `
                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background-color:${currentUser.avatarColor || '#F0DFC8'}; color:#001356; font-weight:bold; font-size:18px; border-radius:12px;">
                    ${currentUser.avatarLetter}
                </div>
            `;
        }
    }

    // 2. Load Cart Data
    function getCart() {
        const allCarts = JSON.parse(localStorage.getItem('bookbloom_cart')) || [];
        // Filter items only belonging to current user
        return allCarts.filter(item => item.user === currentUser.username);
    }

    function saveCart(userCart) {
        // Read the global cart
        let allCarts = JSON.parse(localStorage.getItem('bookbloom_cart')) || [];
        // Remove old items for this user
        allCarts = allCarts.filter(item => item.user !== currentUser.username);
        // Add updated items back to global cart
        allCarts = [...allCarts, ...userCart];
        localStorage.setItem('bookbloom_cart', JSON.stringify(allCarts));
    }

    // 3. Render Cart
    function renderCart() {
        const cart = getCart();
        cartList.innerHTML = ''; // Clear current

        let subtotal = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty.</p>';
            subtotalValue.textContent = '$0.00';
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            // Create cart item HTML structure
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.justifyContent = 'space-between';
            itemDiv.style.padding = '15px 0';
            itemDiv.style.borderBottom = '1px solid #eee';

            // We mimic the layout requirement (Image, Title, Quantity controls, Delete, Price)
            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap: 15px; flex: 2;">
                    <img src="${item.image}" alt="${item.title}" style="width:60px; height:80px; object-fit:cover; border-radius:4px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #001356;">${item.title}</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">$${item.price.toFixed(2)}</p>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap: 10px; flex: 1; justify-content: center;">
                    <button class="qty-btn decrement" data-index="${index}" style="width: 30px; height: 30px; background: #eee; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                    <span style="font-weight: 500;">${item.quantity}</span>
                    <button class="qty-btn increment" data-index="${index}" style="width: 30px; height: 30px; background: #001356; color: #F0DFC8; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                </div>

                <div style="display:flex; align-items:center; gap: 20px; flex: 1; justify-content: flex-end;">
                    <span style="font-weight: 600; font-size: 16px;">$${itemTotal.toFixed(2)}</span>
                    <button class="delete-btn" data-index="${index}" style="background: none; border: none; color: #ff4d4d; cursor: pointer;" title="Remove item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            `;
            cartList.appendChild(itemDiv);
        });

        // Update subtotal
        subtotalValue.textContent = '$' + subtotal.toFixed(2);

        // Attach event listeners to newly created buttons
        attachEventListeners();
    }

    // 4. Handle Cart Actions
    function attachEventListeners() {
        const cart = getCart();

        // Increment
        document.querySelectorAll('.increment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                cart[idx].quantity += 1;
                saveCart(cart);
                renderCart();
            });
        });

        // Decrement
        document.querySelectorAll('.decrement').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity -= 1;
                    saveCart(cart);
                    renderCart();
                } else {
                    // If quantity becomes 0, ask to delete
                    if(confirm(`Remove "${cart[idx].title}" from your cart?`)) {
                        cart.splice(idx, 1);
                        saveCart(cart);
                        renderCart();
                    }
                }
            });
        });

        // Delete
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if(confirm(`Are you sure you want to remove "${cart[idx].title}"?`)) {
                    cart.splice(idx, 1);
                    saveCart(cart);
                    renderCart();
                }
            });
        });
    }

    // Initial render
    renderCart();

    // 5. Checkout button action
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            const cart = getCart();
            if (cart.length === 0) {
                e.preventDefault(); // Stop navigation to checkout
                alert('Your cart is empty. Please add some books first!');
            }
        });
    }
});
