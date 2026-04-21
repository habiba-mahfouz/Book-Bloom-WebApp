document.addEventListener('DOMContentLoaded', () => {
    // 1. Employee Auth Check
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        window.location.href = '../login/login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);
    
    // Profile Icon rendering
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

    if (currentUser.role !== 'employee') {
        alert('Access Denied: Admins Only!');
        window.location.href = '../MainMenu/MainMenu.html';
        return;
    }

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');

    // 2. Fetch and Render Orders
    function renderOrders() {
        const urlParams = new URLSearchParams(window.location.search);
        const userFilter = urlParams.get('user');

        let allOrders = JSON.parse(localStorage.getItem('bookbloom_orders')) || [];
        
        // Filter by user if parameter exists
        if (userFilter) {
            allOrders = allOrders.filter(o => o.username.toLowerCase() === userFilter.toLowerCase());
            // Update UI to show filter status
            if (searchInput) searchInput.value = userFilter;
        }

        tableBody.innerHTML = '';

        if (allOrders.length === 0) {
            tableBody.innerHTML = '<div style="text-align:center; padding: 20px;">No orders found on the system.</div>';
            return;
        }

        // Sort descending by putting newest (last pushed) first
        const sortedOrders = [...allOrders].reverse();

        sortedOrders.forEach((order, index) => {
            // Calculate total items quantity
            const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

            // Determine select styling based on status
            const currentStatus = order.status.toLowerCase();
            let selectClass = '';
            if (currentStatus === 'pending') selectClass = 'pending';
            else if (currentStatus === 'confirm' || currentStatus === 'confirmed') selectClass = 'confirmed';
            else if (currentStatus === 'reject' || currentStatus === 'rejected') selectClass = 'rejected';

            // Original absolute index for updating the exact object in LocalStorage
            const actualIndex = allOrders.findIndex(o => o.orderId === order.orderId);

            const rowStr = `
                <div class="table-row">
                    <div><strong>${order.orderId}</strong></div>
                    <div>$${order.totalPrice.toFixed(2)}</div>
                    <div>${order.username}</div>
                    <div>${totalQty}</div>
                    <div>${order.date}</div>
                    <div>
                        <select class="status-select ${selectClass}" data-index="${actualIndex}">
                            <option value="Pending" ${currentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="Confirmed" ${currentStatus === 'confirmed' || currentStatus === 'confirm' ? 'selected' : ''}>Confirmed</option>
                            <option value="Rejected" ${currentStatus === 'rejected' || currentStatus === 'reject' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    <div>
                        <button class="show-details-btn" data-index="${actualIndex}" style="background:#001356; color:#F0DFC8; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Show Details</button>
                    </div>
                </div>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowStr);
        });

        attachEventListeners(allOrders);
    }

    // 3. Attach Listeners for Select and Details Button
    function attachEventListeners(allOrders) {
        // Status Changes
        document.querySelectorAll('.status-select').forEach(selectElem => {
            selectElem.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                const newStatus = e.target.value;
                
                // Update CSS locally based on value
                let newClass = '';
                if (newStatus === 'Pending') newClass = 'pending';
                else if (newStatus === 'Confirmed') newClass = 'confirmed';
                else if (newStatus === 'Rejected') newClass = 'rejected';
                
                e.target.className = 'status-select ' + newClass;

                // Save to localStorage
                allOrders[idx].status = newStatus;
                localStorage.setItem('bookbloom_orders', JSON.stringify(allOrders));
            });
        });

        // Show Details Modal
        document.querySelectorAll('.show-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                const order = allOrders[idx];
                showModal(order);
            });
        });
    }

    // 4. Custom Modal for Order Details
    function showModal(order) {
        // Create an overlay
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '9999'
        });

        // Create modal container
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            backgroundColor: '#F0DFC8', width: '500px', maxWidth: '90%', maxHeight: '80vh',
            borderRadius: '8px', overflowY: 'auto', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            fontFamily: 'Inter, sans-serif'
        });

        let itemsHtml = order.items.map(item => `
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <img src="${item.image}" alt="${item.title}" style="width:50px; height:70px; object-fit:cover; border-radius:4px;">
                <div style="flex:1;">
                    <h4 style="margin:0 0 5px 0;">${item.title}</h4>
                    <p style="margin:0; font-size:14px; color:#555;">Qty: ${item.quantity} x $${item.price.toFixed(2)}</p>
                </div>
                <div style="font-weight:bold;">$${(item.quantity * item.price).toFixed(2)}</div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #001356; padding-bottom:10px; margin-bottom:20px;">
                <h2 style="margin:0; color:#001356;">Order: ${order.orderId}</h2>
                <button id="closeModalBtn" style="background:none; border:none; font-size:24px; cursor:pointer; color:#999;">&times;</button>
            </div>
            <div>
                <p><strong>Customer:</strong> ${order.username}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                <h3 style="margin-top:20px; border-bottom:1px solid #ccc; padding-bottom:5px;">Items</h3>
                ${itemsHtml}
                <div style="text-align:right; font-size:18px; font-weight:bold; margin-top:15px;">
                    Total: $${order.totalPrice.toFixed(2)}
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close logic
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        modal.querySelector('#closeModalBtn').addEventListener('click', () => {
            overlay.remove();
        });
    }

    // 5. Basic Search logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = tableBody.querySelectorAll('.table-row');
            rows.forEach(row => {
                if (row.textContent.toLowerCase().includes(query)) {
                    row.style.display = 'grid';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Init
    renderOrders();
});
