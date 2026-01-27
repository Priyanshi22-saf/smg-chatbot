require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Handle uncaught exceptions **before anything else**
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1); // Exit immediately for uncaught exceptions
});

// Connect to MongoDB
connectDB()
    .then(() => {
        // Start server only after DB is connected
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error(`❌ Unhandled Rejection: ${err.message}`);
            console.error(err.stack);
            server.close(async () => {
                // Close DB connection gracefully before exit
                try {
                    await require('mongoose').disconnect();
                    console.log('✅ MongoDB disconnected');
                } catch (dbErr) {
                    console.error(`❌ Error disconnecting MongoDB: ${dbErr.message}`);
                }
                process.exit(1);
            });
        });

        // Graceful shutdown on signals (e.g., CTRL+C or Docker stop)
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

        async function shutdown() {
            console.log('⚡ Shutting down gracefully...');
            server.close(async () => {
                try {
                    await require('mongoose').disconnect();
                    console.log('✅ MongoDB disconnected');
                } catch (err) {
                    console.error(`❌ Error disconnecting MongoDB: ${err.message}`);
                }
                process.exit(0);
            });
        }
    })
    .catch((err) => {
        console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
        process.exit(1);
    });
