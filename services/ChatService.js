/**
 * Abstract base class for Chat Services
 * All chat service implementations must extend this class
 */
class ChatService {
    /**
     * Process a user message and return a bot response
     * @param {string} message - The user's message
     * @param {Object} context - Optional context (conversation history, user info, etc.)
     * @returns {Promise<string>} - The bot's response
     */
    async getReply(message, context = {}) {
        throw new Error('getReply() must be implemented by subclass');
    }

    /**
     * Get the name/type of this chat service
     * @returns {string}
     */
    getName() {
        throw new Error('getName() must be implemented by subclass');
    }

    /**
     * Check if the service is ready/configured
     * @returns {Promise<boolean>}
     */
    async isReady() {
        return true;
    }
}

module.exports = ChatService;

