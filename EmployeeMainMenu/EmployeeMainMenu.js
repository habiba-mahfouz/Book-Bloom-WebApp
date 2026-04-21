document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-container button');
    if (logoutBtn) {
        logoutBtn.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('bookbloom_currentUser');
            window.location.href = '../login/login.html';
        });
    }
});
