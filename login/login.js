// Initialize admin employee if it doesn't exist
function initMockEmployee() {
    let users = JSON.parse(localStorage.getItem('bookbloom_users')) || [];
    const adminIndex = users.findIndex(u => u.username === 'admin');
    if (adminIndex === -1) {
        users.push({
            username: "admin",
            email: "admin@bookbloom.com",
            password: "2026",
            role: "employee",
            gender: "male",
            avatarColor: "#add8e6",
            avatarLetter: "A",
            dateJoined: "2026-03-01"
        });
        localStorage.setItem('bookbloom_users', JSON.stringify(users));
    } else if (users[adminIndex].password === "password123") {
        // Automatically update existing admin if it's the old default
        users[adminIndex].password = "2026";
        localStorage.setItem('bookbloom_users', JSON.stringify(users));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMockEmployee();

    const loginBtn = document.querySelector('.submit-btn');
    if (!loginBtn) return;

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const identifier = document.getElementById('identifier').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!identifier || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Get users from LocalStorage
        const users = JSON.parse(localStorage.getItem('bookbloom_users')) || [];

        const lowerIdentifier = identifier.toLowerCase();

        // Check if user exists (case-insensitive for username and email)
        const user = users.find(u => 
            (u.username.toLowerCase() === lowerIdentifier || u.email.toLowerCase() === lowerIdentifier || u.phone === identifier) && 
            u.password === password
        );

        if (user) {
            // Save current logged in user
            localStorage.setItem('bookbloom_currentUser', JSON.stringify(user));
            
            if (user.role === 'employee') {
                alert('Welcome Employee!');
                window.location.href = '../EmployeeMainMenu/EmployeeMainMenu.html';
            } else {
                alert('Login successful!');
                window.location.href = '../MainMenu/MainMenu.html';
            }
        } else {
            alert('Account not found or incorrect credentials! Please register first.');
            window.location.href = '../signup/signup.html';
        }
    });

    // Toggle password visibility
    const toggleBtn = document.querySelector('.toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const passInput = document.getElementById('password');
            if (passInput.type === 'password') {
                passInput.type = 'text';
            } else {
                passInput.type = 'password';
            }
        });
    }
});
