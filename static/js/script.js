// Theme toggle button functionality
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '🌙';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = '🌞';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeToggleBtn.textContent = isDarkMode ? '🌙' : '🌞';
    });
}

// Redirect to profile.html (optional profile-btn)
const profileBtn = document.getElementById('profile-btn');
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// Chat button functionality (main.html)
const generateBtn = document.getElementById('generate-btn');
if (generateBtn) {
    generateBtn.addEventListener('click', function () {
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim() === "") {
            alert("Please enter a prompt.");
            return;
        }

        const chatContainer = document.getElementById('chat-container');
        const userBubble = document.createElement('div');
        userBubble.classList.add('chat-bubble', 'user-bubble');
        userBubble.textContent = userInput;
        chatContainer.appendChild(userBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        document.getElementById('user-input').value = "";

        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_input: userInput })
        })
        .then(response => response.json())
        .then(data => {
            const botBubble = document.createElement('div');
            botBubble.classList.add('chat-bubble', 'bot-bubble');
            botBubble.textContent = data.response || "Sorry, I couldn't generate notes.";
            chatContainer.appendChild(botBubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(() => {
            const botBubble = document.createElement('div');
            botBubble.classList.add('chat-bubble', 'bot-bubble');
            botBubble.textContent = "Error: Unable to generate notes.";
            chatContainer.appendChild(botBubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    });
}

// Password Match Check for Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        const pwd = document.getElementById('password').value;
        const confirmPwd = document.getElementById('confirm-password').value;
        if (pwd !== confirmPwd) {
            e.preventDefault();
            alert("Passwords do not match!");
        }
    });
}
