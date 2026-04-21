document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Protection & Data Retrieval
    const currentUserStr = localStorage.getItem('bookbloom_currentUser');
    if (!currentUserStr) return; // Silent return for unauthenticated pages if needed

    const currentUser = JSON.parse(currentUserStr);

    // 2. Identify all profile icon buttons
    // Target both .profile-btn and general icon-btns that might be profile links
    const profileBtns = document.querySelectorAll('.profile-btn, .icon-btn.profile-btn, #headerProfileBtn');

    profileBtns.forEach(btn => {
        // Apply dynamic avatar logic
        if (currentUser.profileImage) {
            // Option 1: User uploaded photo (Handle relative path if needed)
            // If the path starts with './img/', we might need to adjust based on folder depth
            // However, most modern apps use base64 or absolute URLs.
            // For this project's structure, we check if we need to prefix '../'
            let imagePath = currentUser.profileImage;
            
            // Check if we are in a subfolder (most book pages are)
            const isSubfolder = window.location.pathname.includes('/LostInSpace/') || 
                               window.location.pathname.includes('/Space/') ||
                               window.location.pathname.includes('/TalesOfSpace/') ||
                               window.location.pathname.includes('/WorldHistory/') ||
                               window.location.pathname.includes('/ValleyOfKings/') ||
                               window.location.pathname.includes('/Time/') ||
                               window.location.pathname.includes('/PythonProgramming/') ||
                               window.location.pathname.includes('/ComputerScience/') ||
                               window.location.pathname.includes('/SoftwareEngineer/') ||
                               window.location.pathname.includes('/MainMenu/') ||
                               window.location.pathname.includes('/shoppingcart/') ||
                               window.location.pathname.includes('/OrderList/') ||
                               window.location.pathname.includes('/checkout/') ||
                               window.location.pathname.includes('/paymentdetails/') ||
                               window.location.pathname.includes('/UserManagementTable/');

            if (isSubfolder && imagePath.startsWith('./')) {
                imagePath = '.' + imagePath; // becomes '../img/...'
            }

            btn.innerHTML = `<img src="${imagePath}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
        } else if (currentUser.avatarLetter) {
            // Option 2: Generated initial with color
            btn.innerHTML = `
                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background-color:${currentUser.avatarColor || '#F0DFC8'}; color:#001356; font-weight:bold; font-size:16px; border-radius:12px;">
                    ${currentUser.avatarLetter}
                </div>
            `;
        }
        
        // Ensure the button style is standardized (Beige background, no padding)
        btn.style.padding = '0';
        btn.style.overflow = 'hidden';
        btn.style.backgroundColor = '#F0DFC8';
        btn.style.border = 'none';
        btn.style.borderRadius = '12px';
        btn.style.width = '45px';
        btn.style.height = '45px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
    });
});
