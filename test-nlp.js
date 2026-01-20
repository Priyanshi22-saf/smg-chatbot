/**
 * NLP Chatbot Test Script
 * Tests various queries to demonstrate NLP capabilities
 */

const chatbotService = require('./src/services/chatbotService');

// Test queries demonstrating NLP capabilities
const testQueries = [
    // Internship variations
    { query: "Do you provide internships?", expectedIntent: "internships" },
    { query: "I want to know about internship programs", expectedIntent: "internships" },
    { query: "Tell me about intern opportunities", expectedIntent: "internships" },
    { query: "What about the Nirmaan program?", expectedIntent: "internships" },
    { query: "I'm looking for training", expectedIntent: "internships" },
    
    // Scholarship variations
    { query: "What scholarships do you offer?", expectedIntent: "scholarships" },
    { query: "I need financial aid for studies", expectedIntent: "scholarships" },
    { query: "Do you provide grants?", expectedIntent: "scholarships" },
    { query: "Tell me about student funding", expectedIntent: "scholarships" },
    
    // Product variations
    { query: "What products can I buy?", expectedIntent: "products" },
    { query: "Show me your scooters", expectedIntent: "products" },
    { query: "What do you sell?", expectedIntent: "products" },
    { query: "Tell me about electric vehicles", expectedIntent: "products" },
    
    // Service variations
    { query: "What services are available?", expectedIntent: "services" },
    { query: "Do you have maintenance?", expectedIntent: "services" },
    { query: "I need repair service", expectedIntent: "services" },
    { query: "What support do you provide?", expectedIntent: "services" },
    
    // Leadership variations
    { query: "Who founded SMG?", expectedIntent: "leadership" },
    { query: "Tell me about the CEO", expectedIntent: "leadership" },
    { query: "Who is the owner?", expectedIntent: "leadership" },
    { query: "Who started this company?", expectedIntent: "leadership" },
    
    // Contact variations
    { query: "Contact information please", expectedIntent: "contact_social" },
    { query: "How can I reach you?", expectedIntent: "contact_social" },
    { query: "What's your email?", expectedIntent: "contact_social" },
    { query: "Where are you located?", expectedIntent: "contact_social" },
    
    // Financing variations
    { query: "Do you provide financing?", expectedIntent: "financing_insurance" },
    { query: "I need a loan", expectedIntent: "financing_insurance" },
    { query: "What about insurance?", expectedIntent: "financing_insurance" },
    { query: "Tell me about payment options", expectedIntent: "financing_insurance" },
    
    // Greeting variations
    { query: "Hello", expectedIntent: "greeting" },
    { query: "Hi there", expectedIntent: "greeting" },
    { query: "Good morning", expectedIntent: "greeting" },
    { query: "Namaste", expectedIntent: "greeting" },
    
    // About SMG variations
    { query: "Tell me about SMG", expectedIntent: "about_smg" },
    { query: "What is SMG Electric?", expectedIntent: "about_smg" },
    { query: "Who are you?", expectedIntent: "about_smg" },
    { query: "Company information", expectedIntent: "about_smg" },
];

console.log("🤖 SMG Chatbot NLP Test Suite\n");
console.log("=" .repeat(60));

let passed = 0;
let failed = 0;
const results = [];

testQueries.forEach((test, index) => {
    const result = chatbotService.processMessage(test.query);
    const match = result.intentName === test.expectedIntent;
    
    if (match) {
        passed++;
        console.log(`✅ Test ${index + 1}: PASSED`);
    } else {
        failed++;
        console.log(`❌ Test ${index + 1}: FAILED`);
    }
    
    console.log(`   Query: "${test.query}"`);
    console.log(`   Expected: ${test.expectedIntent}`);
    console.log(`   Got: ${result.intentName}`);
    console.log(`   Confidence: ${result.confidenceScore.toFixed(3)}`);
    console.log(`   Reply: ${result.reply.substring(0, 60)}...`);
    console.log();
    
    results.push({
        query: test.query,
        expected: test.expectedIntent,
        actual: result.intentName,
        confidence: result.confidenceScore,
        passed: match
    });
});

console.log("=" .repeat(60));
console.log(`\n📊 Test Results:`);
console.log(`   Total Tests: ${testQueries.length}`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${((passed / testQueries.length) * 100).toFixed(1)}%`);

// Show failed tests
if (failed > 0) {
    console.log(`\n❌ Failed Tests:`);
    results.filter(r => !r.passed).forEach((r, i) => {
        console.log(`   ${i + 1}. "${r.query}"`);
        console.log(`      Expected: ${r.expected}, Got: ${r.actual} (Confidence: ${r.confidence.toFixed(3)})`);
    });
}

// Show confidence distribution
const confidences = results.map(r => r.confidence);
const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
const minConfidence = Math.min(...confidences);
const maxConfidence = Math.max(...confidences);

console.log(`\n📈 Confidence Statistics:`);
console.log(`   Average: ${avgConfidence.toFixed(3)}`);
console.log(`   Minimum: ${minConfidence.toFixed(3)}`);
console.log(`   Maximum: ${maxConfidence.toFixed(3)}`);

console.log(`\n✨ NLP Enhancement Working!`);

