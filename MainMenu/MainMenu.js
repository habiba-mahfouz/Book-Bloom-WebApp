document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Protection
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        // Redirect to login if no user is found
        window.location.href = '../login/login.html';
        return;
    }

    const currentUser = JSON.parse(currentUserStr);


    // 3. Add to Cart Logic
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-img');

            const cartItem = {
                title,
                price,
                image,
                quantity: 1,
                user: currentUser.username // Tie cart item to this specific user
            };

            // Get existing cart
            let cart = JSON.parse(localStorage.getItem('bookbloom_cart')) || [];
            
            // Check if item already exists in cart for THIS user
            const existingItemIndex = cart.findIndex(item => item.title === title && item.user === currentUser.username);
            
            if (existingItemIndex > -1) {
                // Increment quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item
                cart.push(cartItem);
            }

            // Save back to LocalStorage
            localStorage.setItem('bookbloom_cart', JSON.stringify(cart));

            // Custom Alert Message
            showTemporaryAlert(`"${title}" has been added to your cart!`);
        });
    });

    // 4. Logout Logic
    const logoutBtn = document.querySelector('.logOut-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop normal a-tag navigation if present on wrapper
            localStorage.removeItem('bookbloom_currentUser');
            window.location.href = '../login/login.html';
        });
    }

    // Helper: Temporary Alert
    function showTemporaryAlert(message) {
        // Create an alert element dynamically
        const alertBox = document.createElement('div');
        alertBox.textContent = message;
        
        // Basic styling to make it visible, floating at the top
        Object.assign(alertBox.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: '9999',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            transition: 'opacity 0.5s ease',
            opacity: '1'
        });

        document.body.appendChild(alertBox);

        // Remove after 5 seconds
        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => {
                alertBox.remove();
            }, 500); // wait for fade out
        }, 5000);
    }
});
