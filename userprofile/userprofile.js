document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Protection & Data Retrieval
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) {
        // Redirect to login if a user wanders here unauthenticated
        window.location.href = '../login/login.html';
        return;
    }

    const currentUser = JSON.parse(currentUserStr);

    // 2. Populate User Data in UI
    const nameOutput = document.getElementById('displayName');
    const emailOutput = document.getElementById('displayEmail');
    const phoneOutput = document.getElementById('displayPhone');
    const profileImageWrapper = document.querySelector('.profile-image-wrapper');

    if (nameOutput) nameOutput.textContent = currentUser.username;
    if (emailOutput) emailOutput.textContent = 'Email: ' + currentUser.email;
    if (phoneOutput) phoneOutput.textContent = 'Phone: ' + (currentUser.phone || 'Not provided');

    // Set up avatar
    if (profileImageWrapper) {
        if (currentUser.profileImage) {
            // Priority 1: Uploaded photo
            profileImageWrapper.innerHTML = `<img class="profile-image" src="${currentUser.profileImage}" alt="User profile photo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
            profileImageWrapper.style.backgroundColor = 'transparent'; // clear any css colors
        } else {
            // Priority 2: Generated initial
            profileImageWrapper.innerHTML = `
                <div style="width:100%; height:100%; border-radius:50%; background-color:${currentUser.avatarColor}; display:flex; align-items:center; justify-content:center; color:#001356; font-weight:bold; font-size:3rem;">
                    ${currentUser.avatarLetter}
                </div>
            `;
        }
    }
});
