const ChatService = require('./ChatService');

/**
 * Google Gemini chat service implementation
 * Requires GEMINI_API_KEY environment variable
 */
class GeminiChatService extends ChatService {
    constructor() {
        super();
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = process.env.GEMINI_MODEL || 'gemini-pro';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
    }

    getName() {
        return 'gemini';
    }

    async isReady() {
        return !!this.apiKey;
    }

    async getReply(message, context = {}) {
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        try {
            const prompt = this.buildPrompt(message, context);
            
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error(`Failed to get response from Gemini: ${error.message}`);
        }
    }

    /**
     * Build prompt for Gemini API
     * @param {string} message - Current user message
     * @param {Object} context - Context with conversation history
     * @returns {string} Formatted prompt
     */
    buildPrompt(message, context) {
        let prompt = `You are a helpful assistant for SMG (SMG Electric Scooters Ltd). 
You provide friendly and professional support. Keep responses concise and helpful.
Company email: smgelectricscootersltd@gmail.com
Working hours: Monday to Friday, 9 AM to 5 PM.

`;

        // Add conversation history if available
        if (context.history && Array.isArray(context.history)) {
            prompt += "Conversation history:\n";
            context.history.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                prompt += `${role}: ${msg.content}\n`;
            });
            prompt += "\n";
        }

        prompt += `User: ${message}\nAssistant:`;
        return prompt;
    }
}

module.exports = GeminiChatService;

