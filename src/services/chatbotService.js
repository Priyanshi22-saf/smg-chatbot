/**
 * Chatbot Intent Service with NLP
 * Hybrid approach: Rule-based + NLP (Tokenization, Stemming, Keyword Matching)
 * Knowledge-driven responses loaded from data/smgKnowledge.json
 * Returns bot response, intent name, and confidence score
 */

const natural = require('natural');
const stemmer = natural.PorterStemmer;
const knowledge = require('../data/smgKnowledge.json');

class ChatbotService {
    constructor() {
        // Initialize NLP components
        this.stemmer = stemmer;
        this.tokenizer = new natural.WordTokenizer();
        
        // Pre-process keywords for faster matching
        this.intentPatterns = this.initializeIntentPatterns();
    }

    /**
     * Initialize and pre-process intent patterns with stemming
     */
    initializeIntentPatterns() {
        const patterns = {
            greeting: {
                keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'namaskar', 'hii', 'hiii', 'greetings', 'greet'],
                stems: [],
                confidence: 0.95,
            },
            about_smg: {
                keywords: ['who are you', 'what is smg', 'tell me about smg', 'about smg', 'smg electric', 'smg company', 'smg electric scooters', 'what is smg electric', 'tell me about smg electric'],
                stems: [],
                confidence: 0.90,
            },
            leadership: {
                keywords: ['founder', 'ceo', 'managing director', 'executive director', 'director', 'leadership', 'who founded', 'who started', 'owner', 'neeraj', 'saurav', 'kamni', 'cheshta', 'gupta', 'tell me about the ceo', 'who is the ceo', 'founder of smg'],
                stems: [],
                confidence: 0.90,
            },
            products: {
                keywords: ['product', 'products', 'scooter', 'electric scooter', 'model', 'price', 'cost', 'buy', 'purchase', 'vehicle', 'bike', 'what products', 'what do you offer', 'offer', 'scooters', 'ev', 'sell', 'what do you sell', 'electric vehicles', 'electric vehicle'],
                stems: [],
                confidence: 0.90,
            },
            services: {
                keywords: ['service', 'services', 'maintenance', 'repair', 'support', 'help', 'assistance', 'warranty', 'after sales', 'what services', 'servicing', 'tracking', 'roadside'],
                stems: [],
                confidence: 0.90,
            },
            internships: {
                keywords: ['internship', 'nirmaan', 'training', 'learn', 'work', 'job', 'career', 'opportunity', 'program', 'internship details', 'nirmaan programme', 'engineering', 'intern', 'internships', 'intern opportunities', 'intern program', 'training program'],
                stems: [],
                confidence: 0.90,
            },
            scholarships: {
                keywords: ['scholarship', 'scholarships', 'financial aid', 'funding', 'education', 'study', 'student', 'grant', 'scholarship details', 'financial assistance', 'student funding', 'student aid'],
                stems: [],
                confidence: 0.90,
            },
            industrial_visit: {
                keywords: ['visit', 'bhraman', 'industrial', 'tour', 'factory', 'manufacturing', 'facility', 'see', 'industrial visit', 'smg bhraman', 'factory visit'],
                stems: [],
                confidence: 0.90,
            },
            financing_insurance: {
                keywords: ['finance', 'financing', 'loan', 'emi', 'installment', 'insurance', 'coverage', 'policy', 'payment', 'do you provide financing', 'bajaj', 'muthoot', 'shriram', 'tata', 'financing options', 'payment options', 'what about insurance', 'do you have insurance'],
                stems: [],
                confidence: 0.90,
            },
            challenges_startup: {
                keywords: ['startup', 'challenge', 'challenges', 'mobility challenge', 'seed funding', 'entrepreneur', 'iit', 'iim', 'niit', 'funding', 'support', 'startups'],
                stems: [],
                confidence: 0.85,
            },
            partnerships: {
                keywords: ['partner', 'partners', 'partnership', 'university', 'universities', 'partner universities', 'iit delhi', 'chandigarh university', 'lpu', 'rayat', 'ct group', 'iiit', 'gulzar'],
                stems: [],
                confidence: 0.85,
            },
            jobs: {
                keywords: ['job', 'jobs', 'career', 'careers', 'hiring', 'vacancy', 'vacancies', 'work with smg', 'resume', 'cv', 'hr', 'non technical', 'technical role', 'salary', 'lpa', 'apply for job'],
                stems: [],
                confidence: 0.90,
            },
            dealerships: {
                keywords: ['dealership', 'dealer', 'dealers', 'become a dealer', 'open showroom', 'franchise', 'network', 'premium dealership', 'open dealership', 'investment', 'msme', 'llp', 'private limited', 'public limited'],
                stems: [],
                confidence: 0.90,
            },
            contact_social: {
                keywords: ['contact', 'phone', 'email', 'address', 'location', 'social media', 'facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp', 'contact details', 'youtube', 'reach', 'contact information', 'how to contact', 'where are you', 'where are you located', 'get in touch'],
                stems: [],
                confidence: 0.90,
            },
            closing: {
                keywords: ['menu', 'options', 'show menu', 'main menu', 'what can you help with', 'help', 'what can you do'],
                stems: [],
                confidence: 0.80,
            },
        };

        // Pre-stem all keywords for faster matching
        for (const [intentName, pattern] of Object.entries(patterns)) {
            pattern.stems = pattern.keywords.map(kw => {
                // Handle multi-word keywords
                if (kw.includes(' ')) {
                    return kw.split(' ').map(w => this.stemmer.stem(w.toLowerCase())).join(' ');
                }
                return this.stemmer.stem(kw.toLowerCase());
            });
        }

        return patterns;
    }

    /**
     * Tokenize and stem a message
     * @param {string} message - User message
     * @returns {Array} Array of stemmed tokens
     */
    tokenizeAndStem(message) {
        const tokens = this.tokenizer.tokenize(message.toLowerCase());
        return tokens.map(token => this.stemmer.stem(token));
    }

    /**
     * Calculate similarity score between message and keywords
     * @param {Array} messageStems - Stemmed tokens from message
     * @param {Array} keywordStems - Stemmed keywords
     * @returns {number} Similarity score (0-1)
     */
    calculateSimilarity(messageStems, keywordStems) {
        if (!messageStems || messageStems.length === 0) return 0;
        if (!keywordStems || keywordStems.length === 0) return 0;

        let matches = 0;
        const messageStemSet = new Set(messageStems);

        // Check for exact stem matches
        keywordStems.forEach(kwStem => {
            if (kwStem.includes(' ')) {
                // Multi-word keyword - check if all words match
                const kwWords = kwStem.split(' ');
                let allMatch = true;
                for (let i = 0; i < kwWords.length - 1; i++) {
                    const word1 = kwWords[i];
                    const word2 = kwWords[i + 1];
                    // Check if consecutive words exist in message
                    const idx1 = messageStems.indexOf(word1);
                    if (idx1 !== -1 && idx1 < messageStems.length - 1 && messageStems[idx1 + 1] === word2) {
                        matches += 2; // Bonus for multi-word match
                        break;
                    }
                }
            } else {
                // Single word keyword
                if (messageStemSet.has(kwStem)) {
                    matches += 1;
                }
            }
        });

        // Calculate similarity ratio
        const maxPossible = keywordStems.length;
        return Math.min(matches / maxPossible, 1.0);
    }
    /**
     * Process user message and return bot response with intent
     * @param {string} message - User message
     * @returns {Object} { reply, intentName, confidenceScore }
     */
    processMessage(message) {
        const normalizedMessage = message.toLowerCase().trim();
        
        // Tokenize and stem the message for NLP processing
        const messageStems = this.tokenizeAndStem(normalizedMessage);
        
        // Intent detection with NLP-enhanced confidence scores
        const intentResult = this.detectIntent(normalizedMessage, messageStems);
        
        // Generate response based on intent
        const reply = this.generateResponse(intentResult.intentName, normalizedMessage);
        
        return {
            reply,
            intentName: intentResult.intentName,
            confidenceScore: intentResult.confidenceScore,
        };
    }

    /**
     * Detect intent from user message using NLP
     * @param {string} message - Normalized user message
     * @param {Array} messageStems - Pre-stemmed tokens from message
     * @returns {Object} { intentName, confidenceScore }
     */
    detectIntent(message, messageStems) {
        const intentPatterns = this.intentPatterns;
        
        // Check for matches using NLP-enhanced similarity
        let bestMatch = { intentName: 'unknown', confidenceScore: 0.3 };
        let bestSimilarity = 0;

        // First pass: Traditional keyword matching (for exact matches)
        for (const [intentName, pattern] of Object.entries(intentPatterns)) {
            const keywordMatches = pattern.keywords.filter(keyword => 
                message.includes(keyword.toLowerCase())
            ).length;

            if (keywordMatches > 0) {
                // Base confidence from keyword matches
                let confidence = pattern.confidence;
                
                // Boost confidence based on number of matches
                confidence += Math.min(keywordMatches * 0.05, 0.08);
                
                // Calculate NLP similarity score
                const similarity = this.calculateSimilarity(messageStems, pattern.stems);
                
                // Combine keyword matching with NLP similarity
                const combinedScore = (confidence * 0.7) + (similarity * pattern.confidence * 0.3);
                
                if (combinedScore > bestMatch.confidenceScore) {
                    bestMatch = {
                        intentName,
                        confidenceScore: Math.min(combinedScore, 0.98),
                    };
                    bestSimilarity = similarity;
                }
            }
        }

        // Second pass: Pure NLP matching (for variations and synonyms)
        // This catches cases where keywords don't match exactly but stems do
        if (bestMatch.confidenceScore < 0.6) {
            for (const [intentName, pattern] of Object.entries(intentPatterns)) {
                const similarity = this.calculateSimilarity(messageStems, pattern.stems);
                
                if (similarity > 0.3 && similarity > bestSimilarity) {
                    const nlpConfidence = similarity * pattern.confidence;
                    
                    if (nlpConfidence > bestMatch.confidenceScore) {
                        bestMatch = {
                            intentName,
                            confidenceScore: Math.min(nlpConfidence, 0.95),
                        };
                        bestSimilarity = similarity;
                    }
                }
            }
        }

        // Special handling for greetings (high priority, but only if clearly a greeting)
        // Check if message starts with or contains clear greeting patterns
        const isGreeting = intentPatterns.greeting.keywords.some(kw => {
            const lowerKw = kw.toLowerCase();
            // Check if greeting is at the start of message or standalone
            return message === lowerKw || 
                   message.startsWith(lowerKw + ' ') || 
                   message.startsWith(lowerKw + ',') ||
                   message.startsWith(lowerKw + '.') ||
                   (message.includes(lowerKw) && message.length < 30); // Short messages with greetings
        });
        
        const greetingSimilarity = this.calculateSimilarity(
            messageStems, 
            intentPatterns.greeting.stems
        );
        
        // Only override if it's clearly a greeting AND no other intent scored higher
        if (isGreeting && (greetingSimilarity > 0.5 || bestMatch.confidenceScore < 0.6)) {
            return {
                intentName: 'greeting',
                confidenceScore: 0.95,
            };
        }

        // Minimum confidence threshold
        if (bestMatch.confidenceScore < 0.4) {
            return { intentName: 'unknown', confidenceScore: 0.3 };
        }

        return bestMatch;
    }

    /**
     * Generate response based on intent using knowledge base
     * @param {string} intentName - Detected intent
     * @param {string} message - Original message
     * @returns {string} Bot response
     */
    generateResponse(intentName, message) {
        const intents = (knowledge && knowledge.intents) || {};
        const intentData = intents[intentName] || intents.unknown;

        if (!intentData || !Array.isArray(intentData.responses) || intentData.responses.length === 0) {
            // Safe fallback if knowledge is missing or misconfigured
            return "I’m not fully sure I understood that. You can ask me about SMG Electric Scooters, our products, services, internships, scholarships, industrial visits, finance/insurance or contact information.";
        }

        // Pick a slight variation to keep responses human-like
        const variants = intentData.responses;
        const index = Math.floor(Math.random() * variants.length);

        return variants[index];
    }
}

module.exports = new ChatbotService();

