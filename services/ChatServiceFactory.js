const RuleBasedChatService = require('./RuleBasedChatService');
const OpenAIChatService = require('./OpenAIChatService');
const GeminiChatService = require('./GeminiChatService');

/**
 * Factory class to create and manage chat service instances
 */
class ChatServiceFactory {
    /**
     * Create a chat service based on configuration
     * @param {string} serviceType - Type of service: 'rule-based', 'openai', or 'gemini'
     * @returns {ChatService} Instance of the requested chat service
     */
    static create(serviceType = null) {
        // Determine service type from environment or parameter
        const type = serviceType || process.env.CHAT_SERVICE_TYPE || 'rule-based';

        switch (type.toLowerCase()) {
            case 'openai':
                return new OpenAIChatService();
            
            case 'gemini':
                return new GeminiChatService();
            
            case 'rule-based':
            case 'rulebased':
            default:
                return new RuleBasedChatService();
        }
    }

    /**
     * Get available chat service types
     * @returns {Array<string>} List of available service types
     */
    static getAvailableTypes() {
        return ['rule-based', 'openai', 'gemini'];
    }

    /**
     * Validate if a service type is supported
     * @param {string} serviceType - Service type to validate
     * @returns {boolean}
     */
    static isValidType(serviceType) {
        return this.getAvailableTypes().includes(serviceType.toLowerCase());
    }
}

module.exports = ChatServiceFactory;

