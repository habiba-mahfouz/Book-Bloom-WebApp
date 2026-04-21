document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        window.location.href = '../login/login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);
    
    // Update Header Profile Icon
    const headerProfileBtn = document.getElementById('headerProfileBtn');
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

    // 2. Fetch Orders for Current User
    const allOrders = JSON.parse(localStorage.getItem('bookbloom_orders')) || [];
    const userOrders = allOrders.filter(order => order.username === currentUser.username);

    // 3. Render Orders
    const tableBody = document.getElementById('tableBody');

    if (userOrders.length > 0) {
        tableBody.innerHTML = ''; // Clear empty state
        
        userOrders.forEach(order => {
            const tr = document.createElement('tr');
            
            // Status styling
            let statusBadge = '';
            if (order.status.toLowerCase() === 'pending') {
                statusBadge = `<span style="background:#fff3cd; color:#856404; padding:5px 10px; border-radius:4px; font-weight:bold;">${order.status}</span>`;
            } else if (order.status.toLowerCase() === 'confirmed') {
                statusBadge = `<span style="background:#d4edda; color:#155724; padding:5px 10px; border-radius:4px; font-weight:bold;">${order.status}</span>`;
            } else if (order.status.toLowerCase() === 'rejected') {
                statusBadge = `<span style="background:#f8d7da; color:#721c24; padding:5px 10px; border-radius:4px; font-weight:bold;">${order.status}</span>`;
            } else {
                statusBadge = `<span>${order.status}</span>`; // Fallback
            }

            tr.innerHTML = `
                <td><strong>${order.orderId}</strong></td>
                <td>${statusBadge}</td>
                <td>$${order.totalPrice.toFixed(2)}</td>
                <td>${order.date}</td>
                <td>${order.address}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Optional Search Logic
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr:not(.empty-state)');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
