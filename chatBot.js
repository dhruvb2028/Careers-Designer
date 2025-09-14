// Gemini API Configuration
const API_KEY = window.CONFIG?.GEMINI_API_KEY || '';
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// Chatbot UI Elements
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChatbot = document.getElementById('close-chatbot');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const sendMessageBtn = document.getElementById('send-message');

// Toggle Chatbot Window
chatbotIcon.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
});

closeChatbot.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
});

// Add Message to Chat
function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Send Message to Gemini
async function sendMessageToGemini(message) {
    try {
        const response = await fetch(MODEL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;
        return botReply;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Handle Message Sending
async function handleMessageSend() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatbotInput.value = '';

    const botReply = await sendMessageToGemini(message);
    addMessage(botReply, 'bot');
}

// Event Listeners
sendMessageBtn.addEventListener('click', handleMessageSend);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleMessageSend();
    }
});