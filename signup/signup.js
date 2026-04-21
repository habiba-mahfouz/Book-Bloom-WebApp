document.addEventListener('DOMContentLoaded', () => {
    let profilePhotoDataUrl = null;

    // Profile photo preview logic
    const photoInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview');
    if (photoInput && photoPreview) {
        photoPreview.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePhotoDataUrl = event.target.result;
                    photoPreview.innerHTML = `<img src="${profilePhotoDataUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const gender = document.getElementById('gender').value.toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // 1. Validate required fields
        if (!username || !gender || !phone || !email || !password || !confirmPassword) {
            alert('Please fill in all the required fields.');
            return;
        }

        // 2. Validate email (@ and .com)
        if (!email.includes('@') || !email.includes('.com')) {
            alert('Please enter a valid email containing "@" and ".com".');
            return;
        }

        // 3. Validate password length
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        // 4. Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('bookbloom_users')) || [];

        // 5. Check for duplicates (username or email)
        const isDuplicate = users.some(u => u.username === username || u.email === email);
        if (isDuplicate) {
            alert("Username or Email already exists!");
            return;
        }

        // 6. Avatar Logic
        let avatarColor = "#ffffff"; // Default white (prefer not to say)
        if (gender === "female") {
            avatarColor = "#ffb6c1"; // Rose/Pink
        } else if (gender === "male") {
            avatarColor = "#add8e6"; // Light Blue
        }
        
        const avatarLetter = username.charAt(0).toUpperCase();

        // Create new user object
        const newUser = {
            username,
            email,
            phone,
            password,
            gender,
            role: "user",
            avatarColor,
            avatarLetter,
            profileImage: profilePhotoDataUrl,
            dateJoined: new Date().toLocaleDateString()
        };

        // Save to LocalStorage
        users.push(newUser);
        localStorage.setItem('bookbloom_users', JSON.stringify(users));

        alert('Account created successfully! Redirecting to login...');
        window.location.href = '../login/login.html';
    });
});
