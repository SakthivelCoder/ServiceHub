// Tab switching functionality
function showForm(type) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (type === "login") {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        loginBtn.classList.add("bg-yellow-400", "text-white");
        registerBtn.classList.remove("bg-yellow-400", "text-white");
    } else {
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        registerBtn.classList.add("bg-yellow-400", "text-white");
        loginBtn.classList.remove("bg-yellow-400", "text-white");
    }
}
// Default active tab
showForm("login");


// Password validation
const passwordInput = document.getElementById("password");
const rules = {
    length: document.getElementById("length"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    number: document.getElementById("number"),
    special: document.getElementById("special"),
};

passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    rules.length.classList.toggle("text-green-600", val.length >= 8);
    rules.length.classList.toggle("text-red-500", val.length < 8);

    rules.uppercase.classList.toggle("text-green-600", /[A-Z]/.test(val));
    rules.uppercase.classList.toggle("text-red-500", !/[A-Z]/.test(val));

    rules.lowercase.classList.toggle("text-green-600", /[a-z]/.test(val));
    rules.lowercase.classList.toggle("text-red-500", !/[a-z]/.test(val));

    rules.number.classList.toggle("text-green-600", /[0-9]/.test(val));
    rules.number.classList.toggle("text-red-500", !/[0-9]/.test(val));

    rules.special.classList.toggle("text-green-600", /[!@#$%^&*]/.test(val));
    rules.special.classList.toggle("text-red-500", !/[!@#$%^&*]/.test(val));
});


// Form submission handling

const regForm = document.getElementById('registerForm');
regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Please check your email to verify your account.");
            window.location.href = 'http://127.0.0.1:5500/userform.html';  // Redirect to login or show a message
        } else {
            console.log(data); // Show any error or handle the failure
            alert('Error: ' + data.message); // Display the error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

const logForm = document.getElementById('loginForm');
logForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        email: document.getElementById('lemail').value,
        password: document.getElementById('lpassword').value,
    };
    console.log(formData); // Debugging line to check form data
    try {
        const response = await fetch('http://127.0.0.1:5000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            // Redirect to login page or home page
            window.location.href = 'http://127.0.0.1:5500/index.html';  // Adjust this URL based on your app routing
        } else {
            console.log(data); // Show any error or handle the failure
            alert('Error: ' + data.message); // Display the error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

