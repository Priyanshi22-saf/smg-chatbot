const ChatService = require('./ChatService');

/**
 * Rule-based chat service implementation
 * Uses pattern matching and predefined responses
 */
class RuleBasedChatService extends ChatService {
    getName() {
        return 'rule-based';
    }

    async getReply(message, context = {}) {
        const msg = message.toLowerCase();

        // Greetings
        if (msg.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
            return "Hello! 👋 How can I assist you today?";
        }

        // Date queries
        if (msg.includes("date")) {
            return "📅 Today's date is " + new Date().toLocaleDateString();
        }

        // Time queries
        if (msg.includes("time")) {
            return "⏰ Current time is " + new Date().toLocaleTimeString();
        }

        // Service queries
        if (msg.includes("service")) {
            return "💼 We provide IT solutions, software development, and support.";
        }

        // Contact information
        if (msg.includes("contact")) {
            return `📧 Email: <a href="mailto:smgelectricscootersltd@gmail.com" target="_blank">smgelectricscootersltd@gmail.com</a><br>`;
        }

        // Working hours
        if (msg.includes("working hours")) {
            return "📞 Our working hours are Monday to Friday, 9 AM to 5 PM.";
        }

        // Farewells
        if (msg.includes("bye")) {
            return "😊 Thank you for contacting us. Have a great day!";
        }

        // Thanks
        if (msg.includes("thank")) {
            return "You're welcome! 😊";
        }

        // Default fallback
        return "❓ I didn't understand that. Could you please rephrase?";
    }
}

module.exports = RuleBasedChatService;

