const API_URL = 'http://127.0.0.1:5000';

function toggleForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const profileForm = document.getElementById('profileForm');

    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
        profileForm.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
        profileForm.style.display = 'none';
    }
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        toggleForms();
    });
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            loadProfile();
        } else {
            alert(data.message);
        }
    });
}

function loadProfile() {
    const token = localStorage.getItem('token');

    if (!token) {
        toggleForms();
        return;
    }

    fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('profileUsername').value = data.username;
        document.getElementById('profileEmail').value = data.email;

        const registerForm = document.getElementById('registerForm');
        const loginForm = document.getElementById('loginForm');
        const profileForm = document.getElementById('profileForm');
        
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
        profileForm.style.display = 'flex';
    });
}

function updateProfile() {
    const email = document.getElementById('profileEmail').value;
    const password = document.getElementById('profilePassword').value;
    const token = localStorage.getItem('token');

    const data = { email };
    if (password) {
        data.password = password;
    }

    fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadProfile();
    });
}

function logout() {
    localStorage.removeItem('token');
    toggleForms();
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        loadProfile();
    }
});
