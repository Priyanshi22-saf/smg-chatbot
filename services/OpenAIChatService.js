const ChatService = require('./ChatService');

/**
 * OpenAI GPT chat service implementation
 * Requires OPENAI_API_KEY environment variable
 */
class OpenAIChatService extends ChatService {
    constructor() {
        super();
        this.apiKey = process.env.OPENAI_API_KEY;
        this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    getName() {
        return 'openai';
    }

    async isReady() {
        return !!this.apiKey;
    }

    async getReply(message, context = {}) {
        if (!this.apiKey) {
            throw new Error('OPENAI_API_KEY is not configured');
        }

        try {
            const messages = this.buildMessages(message, context);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error(`Failed to get response from OpenAI: ${error.message}`);
        }
    }

    /**
     * Build messages array for OpenAI API
     * @param {string} message - Current user message
     * @param {Object} context - Context with conversation history
     * @returns {Array} Array of message objects
     */
    buildMessages(message, context) {
        const systemPrompt = `You are a helpful assistant for SMG (SMG Electric Scooters Ltd). 
You provide friendly and professional support. Keep responses concise and helpful.
Company email: smgelectricscootersltd@gmail.com
Working hours: Monday to Friday, 9 AM to 5 PM.`;

        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Add conversation history if available
        if (context.history && Array.isArray(context.history)) {
            context.history.forEach(msg => {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        return messages;
    }
}

module.exports = OpenAIChatService;

