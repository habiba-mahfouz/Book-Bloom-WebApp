document.addEventListener('DOMContentLoaded', () => {
    // 1. Employee Auth Check
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        window.location.href = '../login/login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);
    if (currentUser.role !== 'employee') {
        alert('Access Denied!');
        window.location.href = '../MainMenu/MainMenu.html';
        return;
    }

    const usersListContainer = document.getElementById('usersListContainer');
    const usersCount = document.getElementById('usersCount');
    const searchInput = document.querySelector('.search-input');

    // 2. Render Users
    function renderUsers(users) {
        usersListContainer.innerHTML = '';
        usersCount.textContent = users.length;

        users.forEach(user => {
            // Skip showing the current admin in the list if desired, but user said "all users"
            // Let's format date (if available, else N/A)
            // Safely parse the date, falling back to current date if missing or invalid
            const rawDate = user.joinDate || user.dateJoined || new Date().toISOString();
            const joinDateObj = new Date(rawDate);
            
            let dateJoined = 'N/A';
            if (!isNaN(joinDateObj.getTime())) {
                const day = String(joinDateObj.getDate()).padStart(2, '0');
                const month = String(joinDateObj.getMonth() + 1).padStart(2, '0');
                const year = joinDateObj.getFullYear();
                dateJoined = `${day}-${month}-${year}`;
            }

            const userRow = document.createElement('div');
            userRow.className = 'user-row';

            // Avatar Logic
            let avatarHtml = '';
            if (user.profileImage) {
                avatarHtml = `<img src="${user.profileImage}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">`;
            } else {
                avatarHtml = `<div style="width:50px; height:50px; border-radius:50%; background-color:${user.avatarColor || '#001356'}; color:#001356; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:20px;">${user.avatarLetter || user.username.charAt(0).toUpperCase()}</div>`;
            }

            userRow.innerHTML = `
                <div style="flex: 2; display: flex; align-items: center; gap: 15px;">
                    ${avatarHtml}
                    <div style="display: flex; flex-direction: column;">
                        <strong style="color: #001356; font-size: 18px;">${user.username}</strong>
                        <span style="color: #666; font-size: 14px;">${user.email}</span>
                    </div>
                </div>
                <div style="flex: 1; text-align: center; display: flex; justify-content: center; align-items: center;">
                    <div style="font-weight: 500;">${user.phone || 'N/A'}</div>
                </div>
                <div style="flex: 1; text-align: center; display: flex; justify-content: center; align-items: center;">
                    <span style="color: #444; font-size: 15px; font-weight: 500;">${dateJoined}</span>
                </div>
                <div style="flex: 1; text-align: right;">
                    <button class="show-order-btn" data-username="${user.username}" style="background: #001356; color: #F0DFC8; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 14px;">Show Order</button>
                </div>
            `;
            usersListContainer.appendChild(userRow);
        });

        // Attach buttons
        document.querySelectorAll('.show-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetUsername = e.target.getAttribute('data-username');
                const allOrders = JSON.parse(localStorage.getItem('bookbloom_orders')) || [];
                const userOrders = allOrders.filter(o => o.username.toLowerCase() === targetUsername.toLowerCase());

                if (userOrders.length === 0) {
                    alert(`No orders found for user: ${targetUsername}`);
                    return;
                }

                showOrdersModal(targetUsername, userOrders);
            });
        });
    }

    // 3. Custom Modal for User Orders
    function showOrdersModal(username, orders) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '9999'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            backgroundColor: '#fff', width: '700px', maxWidth: '95%', maxHeight: '80vh',
            borderRadius: '12px', overflowY: 'auto', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            fontFamily: 'Inter, sans-serif'
        });

        let rowsHtml = orders.map(order => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold; color: #001356;">${order.orderId}</td>
                <td style="padding: 12px;">${order.date}</td>
                <td style="padding: 12px;">$${order.totalPrice.toFixed(2)}</td>
                <td style="padding: 12px;">
                    <span style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                        ${order.status === 'Pending' ? 'background: #fff3cd; color: #856404;' : 
                          order.status === 'Confirmed' ? 'background: #d4edda; color: #155724;' : 
                          'background: #f8d7da; color: #721c24;'}">
                        ${order.status}
                    </span>
                </td>
                <td style="padding: 12px;">${order.items.length} items</td>
            </tr>
        `).join('');

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #001356; padding-bottom: 10px;">
                <h2 style="margin: 0; color: #001356;">Orders for ${username}</h2>
                <button id="closeOrdersModal" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #999;">&times;</button>
            </div>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #eee;">
                        <th style="padding: 12px;">Order ID</th>
                        <th style="padding: 12px;">Date</th>
                        <th style="padding: 12px;">Total</th>
                        <th style="padding: 12px;">Status</th>
                        <th style="padding: 12px;">Items</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        modal.querySelector('#closeOrdersModal').onclick = () => overlay.remove();
    }

    // 4. Load Data
    const allUsers = JSON.parse(localStorage.getItem('bookbloom_users')) || [];
    const regularUsers = allUsers.filter(u => u.role === 'user');
    renderUsers(regularUsers);

    // 5. Search Filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = regularUsers.filter(u => 
                u.username.toLowerCase().includes(query) || 
                u.email.toLowerCase().includes(query) ||
                (u.phone && u.phone.includes(query))
            );
            renderUsers(filtered);
        });
    }
});
