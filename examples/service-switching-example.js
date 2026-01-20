/**
 * Example demonstrating how to switch between different chat services
 * This shows how the API contract remains unchanged regardless of service
 */

const ChatServiceFactory = require('../services/ChatServiceFactory');

async function demonstrateServiceSwitching() {
    console.log('=== Chat Service Switching Demo ===\n');

    const services = ['rule-based', 'openai', 'gemini'];
    const testMessage = "Hello, what services do you provide?";

    for (const serviceType of services) {
        console.log(`\n--- Testing ${serviceType} service ---`);
        
        try {
            const service = ChatServiceFactory.create(serviceType);
            console.log(`Service name: ${service.getName()}`);
            console.log(`Service ready: ${await service.isReady()}`);

            if (await service.isReady()) {
                const reply = await service.getReply(testMessage, {});
                console.log(`User: ${testMessage}`);
                console.log(`Bot: ${reply}`);
            } else {
                console.log(`⚠️  Service not configured (missing API key)`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }

    console.log('\n=== Demo Complete ===');
    console.log('\nNote: To use OpenAI or Gemini, set the appropriate API keys:');
    console.log('  - OPENAI_API_KEY for OpenAI');
    console.log('  - GEMINI_API_KEY for Gemini');
}

// Run demo if executed directly
if (require.main === module) {
    demonstrateServiceSwitching().catch(console.error);
}

module.exports = { demonstrateServiceSwitching };

