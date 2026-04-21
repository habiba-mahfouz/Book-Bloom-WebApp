document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check & Setup
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        window.location.href = '../login/login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);
    
    // 2. Profile Icon rendering
    const profileBtnContainer = document.getElementById('headerProfileBtn');
    if (profileBtnContainer && currentUser) {
        if (currentUser.profileImage) {
            profileBtnContainer.innerHTML = `<img src="${currentUser.profileImage}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
        } else if (currentUser.avatarLetter) {
            profileBtnContainer.innerHTML = `
                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background-color:${currentUser.avatarColor || '#F0DFC8'}; color:#001356; font-weight:bold; font-size:18px; border-radius:12px;">
                    ${currentUser.avatarLetter}
                </div>
            `;
        }
    }

    // 3. Load Cart Data & Calculate Total
    let allCarts = JSON.parse(localStorage.getItem('bookbloom_cart')) || [];
    const userCart = allCarts.filter(item => item.user === currentUser.username);

    if (userCart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        window.location.href = '../MainMenu/MainMenu.html';
        return;
    }

    const totalAmount = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. UI Elements
    const fNameInput = document.querySelector('input[aria-label="First Name"]');
    const lNameInput = document.querySelector('input[aria-label="Last Name"]');
    const addressInput = document.querySelector('input[aria-label="Address"]');
    const cardNumberInput = document.getElementById('card-number');
    const paymentRadios = document.querySelectorAll('.payment-radio');
    const confirmBtn = document.querySelector('.confirm-button');

    // 4. Toggle Card Input Visibility
    function toggleCardInput() {
        const selectedMethod = document.querySelector('.payment-radio:checked').value;
        if (selectedMethod === 'credit-card') {
            cardNumberInput.style.display = 'block';
        } else {
            cardNumberInput.style.display = 'none';
        }
    }
    
    // Initial toggle
    toggleCardInput();
    
    // Listen to changes
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', toggleCardInput);
    });

    // 5. Modal Elements
    const orderModal = document.getElementById('orderModal');
    const modalOrderNumber = document.getElementById('modalOrderNumber');
    const modalDetails = document.getElementById('modalDetails');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    function closeOrderModal() {
        orderModal.style.display = 'none';
    }

    // 6. Handle Confirm
    if (confirmBtn) {
        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const fName = fNameInput.value.trim();
            const lName = lNameInput.value.trim();
            const address = addressInput.value.trim();
            const paymentMethod = document.querySelector('.payment-radio:checked').value;
            const cardNumber = cardNumberInput.value.trim();

            // Validations
            if (!fName || !lName || !address) {
                alert("Please fill in your name and location/address.");
                return;
            }

            if (paymentMethod === 'credit-card' && (!cardNumber || cardNumber.length < 12)) {
                alert("Please enter a valid Credit Card number (at least 12 digits).");
                return;
            }

            const fullName = `${fName} ${lName}`;
            let paymentText = "Cash on Delivery";
            let maskedCard = "";

            if (paymentMethod === 'credit-card') {
                const last4 = cardNumber.slice(-4);
                maskedCard = `**** **** **** ${last4}`;
                paymentText = `Credit Card (${maskedCard})`;
            }

            // Calculate User Order #
            const orders = JSON.parse(localStorage.getItem('bookbloom_orders')) || [];
            const userOrdersCount = orders.filter(o => o.username === currentUser.username).length;
            const currentOrderNum = userOrdersCount + 1;

            // Reset Modal to Default
            modalOrderNumber.textContent = `Order: #${currentOrderNum}`;
            modalConfirmBtn.textContent = "Confirm";
            modalCancelBtn.style.display = 'block';
            modalConfirmBtn.onclick = null; // Clear any previous success override

            modalDetails.innerHTML = `
                <strong>Name:</strong> ${fullName}<br>
                <strong>Location:</strong> ${address}<br>
                <strong>Payment:</strong> ${paymentText}<br>
                <strong>Total Amount:</strong> $${totalAmount.toFixed(2)}
            `;

            // Show Modal
            orderModal.style.display = 'flex';

            // Wait for Modal Actions
            modalConfirmBtn.onclick = () => {
                // Success - Process Order
                const orders = JSON.parse(localStorage.getItem('bookbloom_orders')) || [];
                const newOrder = {
                    orderId: 'ORD-' + Date.now(),
                    username: currentUser.username,
                    orderNumber: currentOrderNum,
                    items: userCart,
                    totalPrice: totalAmount,
                    date: new Date().toLocaleDateString(),
                    address: address,
                    paymentMethod: paymentMethod,
                    status: 'Pending'
                };
                
                orders.push(newOrder);
                localStorage.setItem('bookbloom_orders', JSON.stringify(orders));

                // Clear User's Cart
                allCarts = allCarts.filter(item => item.user !== currentUser.username);
                localStorage.setItem('bookbloom_cart', JSON.stringify(allCarts));

                // Show Success in Modal
                modalOrderNumber.textContent = "Success!";
                modalDetails.innerHTML = `
                    <div style="text-align:center; padding: 10px 0;">
                        <h3 style="font-size: 22px; color: #001356; margin-bottom: 5px;">Your purchase is complete!</h3>
                        <p style="color: #666; font-size: 14px;">Thank you for shopping with Book Bloom.</p>
                    </div>
                `;
                
                modalConfirmBtn.textContent = "Great!";
                modalCancelBtn.style.display = 'none';

                // Final redirect
                modalConfirmBtn.onclick = () => {
                    window.location.href = '../MainMenu/MainMenu.html';
                };
            };

            modalCancelBtn.onclick = () => {
                closeOrderModal();
            };
        });
    }
});
