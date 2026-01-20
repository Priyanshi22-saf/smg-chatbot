const inputField = document.querySelector(".chat-input input");
const sendButton = document.querySelector(".chat-input button:last-child");
const voiceBtn = document.getElementById("voiceBtn");
const speakerBtn = document.getElementById("speakerBtn");
const chatMessages = document.querySelector(".chat-messages");
const body = document.body;

// Session management
let sessionId = localStorage.getItem('chatSessionId') || `session_${Date.now()}`;
localStorage.setItem('chatSessionId', sessionId);

const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000' 
    : window.location.origin;

sendButton.addEventListener("click", sendMessage);

inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const userText = inputField.value.trim();
    if (userText === "") return;

    addMessage("user", userText);
    inputField.value = "";
    inputField.disabled = true;
    sendButton.disabled = true;

    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userMessage: userText,
                sessionId: sessionId
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator(typingIndicator);
        
        // Update session ID if provided
        if (data.data && data.data.sessionId) {
            sessionId = data.data.sessionId;
            localStorage.setItem('chatSessionId', sessionId);
        }
        
        // Add bot response
        setTimeout(() => {
            const botReply = data.data?.botReply || data.reply || "I'm sorry, I didn't understand that.";
            addMessage("bot", botReply);
            
            if (window.speakBotResponse) {
                window.speakBotResponse(botReply);
            }
            
            inputField.disabled = false;
            sendButton.disabled = false;
            if (voiceBtn) voiceBtn.disabled = false;
            inputField.focus();
        }, 300);
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator(typingIndicator);
        addMessage("bot", `❌ Sorry, I'm having trouble connecting to the server. ${error.message || 'Please try again later.'}`);
        inputField.disabled = false;
        sendButton.disabled = false;
        if (voiceBtn) voiceBtn.disabled = false;
        inputField.focus();
    }
}

function addMessage(sender, text, scroll = true) {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-msg" : "bot-msg";

    const msgText = document.createElement("div");
    // Preserve line breaks and format text
    msgText.innerHTML = text.replace(/\n/g, '<br>');

    const time = document.createElement("small");
    time.textContent = getCurrentTime();
    time.style.display = "block";
    time.style.fontSize = "10px";
    time.style.opacity = "0.6";
    time.style.marginTop = "4px";

    msgDiv.appendChild(msgText);
    msgDiv.appendChild(time);
    chatMessages.appendChild(msgDiv);

    if (scroll) {
        scrollChat();
    }
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Typing indicator functions
function addTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-msg typing-indicator";
    typingDiv.id = "typing-indicator";
    typingDiv.innerHTML = "<span>.</span><span>.</span><span>.</span>";
    chatMessages.appendChild(typingDiv);
    scrollChat();
    return typingDiv;
}

function removeTypingIndicator(typingIndicator) {
    if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
}

function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    if (confirm("Are you sure you want to clear the chat?")) {
        chatMessages.innerHTML = "";
        sessionId = `session_${Date.now()}`;
        localStorage.setItem('chatSessionId', sessionId);
        addMessage("bot", "Chat cleared 🧹. How can I help you?");
    }
}

// Quick action buttons
function addQuickActions() {
    const quickActions = [
        { text: "About SMG", query: "Tell me about SMG" },
        { text: "Products", query: "What products do you offer?" },
        { text: "Services", query: "What services are available?" },
        { text: "Internships", query: "Internship details" },
        { text: "Contact", query: "Contact details" }
    ];

    const quickActionsDiv = document.createElement("div");
    quickActionsDiv.className = "quick-actions";
    quickActionsDiv.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; border-bottom: 1px solid #ddd; background: #f8f9fa;";

    quickActions.forEach(action => {
        const btn = document.createElement("button");
        btn.textContent = action.text;
        btn.style.cssText = "padding: 6px 12px; border: 1px solid #1f3b63; background: white; color: #1f3b63; border-radius: 15px; cursor: pointer; font-size: 12px; transition: all 0.3s;";
        btn.onmouseover = () => { btn.style.background = "#1f3b63"; btn.style.color = "white"; };
        btn.onmouseout = () => { btn.style.background = "white"; btn.style.color = "#1f3b63"; };
        btn.onclick = () => {
            inputField.value = action.query;
            sendMessage();
        };
        quickActionsDiv.appendChild(btn);
    });

    const chatbotCard = document.querySelector(".chatbot-card");
    if (chatbotCard) {
        chatbotCard.insertBefore(quickActionsDiv, chatMessages);
    }
}

// Load conversation history
async function loadChatHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}?limit=20`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.length > 0) {
                // Clear initial message
                chatMessages.innerHTML = "";
                // Load history
                data.data.forEach(conv => {
                    addMessage("user", conv.message, false);
                    addMessage("bot", conv.response, false);
                });
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function toggleDarkMode() {
    body.classList.toggle("dark-mode");
}

function showPage(pageId, element) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    element.classList.add("active");
}

function logout() {
    alert("You have logged out!");
}

// Voice chat integration callbacks
window.onVoiceTranscript = (transcript) => {
    if (transcript && transcript.trim()) {
        inputField.value = transcript;
        sendMessage();
    }
};

window.onVoiceListeningChange = (isListening) => {
    if (voiceBtn) {
        voiceBtn.classList.toggle('listening', isListening);
        voiceBtn.disabled = false;
    }
    
    if (inputField) {
        inputField.disabled = isListening;
    }
    if (sendButton) {
        sendButton.disabled = isListening;
    }
    
    if (isListening) {
        const indicator = document.createElement("div");
        indicator.className = "bot-msg listening-indicator";
        indicator.id = "listening-indicator";
        indicator.innerHTML = "🎤 Listening...";
        chatMessages.appendChild(indicator);
        scrollChat();
    } else {
        const indicator = document.getElementById("listening-indicator");
        if (indicator) indicator.remove();
    }
};

window.onVoiceSpeakingChange = (speaking) => {
    if (voiceBtn) {
        voiceBtn.disabled = speaking;
    }
    if (inputField) {
        inputField.disabled = speaking;
    }
    if (sendButton) {
        sendButton.disabled = speaking;
    }
    
    if (speaking) {
        const scrollInterval = setInterval(() => {
            scrollChat();
        }, 100);
        
        // Stop scrolling after 30 seconds or when speaking ends
        setTimeout(() => {
            clearInterval(scrollInterval);
        }, 30000);
        
        // Also check periodically if speaking stopped
        const checkSpeaking = setInterval(() => {
            if (!speaking && window.isVoiceSupported) {
                // Check if synthesis is still speaking
                if (window.speechSynthesis && !window.speechSynthesis.speaking) {
                    clearInterval(scrollInterval);
                    clearInterval(checkSpeaking);
                }
            }
        }, 500);
    }
};

window.showVoiceError = (message) => {
    addMessage("bot", `🎤 ${message}`);
};

// Initialize voice controls
function initVoiceControls() {
    if (!voiceBtn || !speakerBtn) {
        console.warn('Voice controls not found in DOM');
        return;
    }
    
    // Wait for voiceChat to be ready
    const checkVoiceChat = () => {
        if (!window.isVoiceSupported) {
            setTimeout(checkVoiceChat, 100);
            return;
        }
        
        const support = window.isVoiceSupported();
        
        if (!support.recognition && !support.synthesis) {
            voiceBtn.style.display = 'none';
            speakerBtn.style.display = 'none';
            return;
        }
        
        if (!support.recognition) {
            voiceBtn.style.display = 'none';
        } else {
            voiceBtn.addEventListener('click', () => {
                if (window.startVoiceInput) {
                    window.startVoiceInput();
                }
            });
        }
        
        if (!support.synthesis) {
            speakerBtn.style.display = 'none';
        } else {
            speakerBtn.addEventListener('click', () => {
                const enabled = window.toggleSpeaker ? window.toggleSpeaker() : false;
                speakerBtn.classList.toggle('disabled', !enabled);
            });
            
            const speakerEnabled = localStorage.getItem('voiceChat_speakerEnabled') !== 'false';
            speakerBtn.classList.toggle('disabled', !speakerEnabled);
        }
    };
    
    checkVoiceChat();
}

window.onload = () => {
    // Initialize voice controls (will wait for voiceChat to be ready)
    initVoiceControls();
    
    // Add quick actions
    addQuickActions();
    
    // Load chat history if available
    loadChatHistory().then(() => {
        // Only show welcome message if no history
        if (chatMessages.children.length === 0) {
            const welcomeMsg = "Hello 👋\nWelcome to SMG Electric Scooters 🚲⚡\nHow can I assist you today?";
            addMessage("bot", welcomeMsg);
            
            // Wait for voiceChat to be ready before speaking
            const trySpeak = () => {
                if (window.speakBotResponse) {
                    setTimeout(() => window.speakBotResponse(welcomeMsg), 500);
                } else {
                    setTimeout(trySpeak, 100);
                }
            };
            trySpeak();
        }
    });
};
