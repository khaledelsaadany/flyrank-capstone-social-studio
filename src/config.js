require('dotenv').config();
const path = require('path');

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databasePath: process.env.DATABASE_PATH || path.join(__dirname, '../data/social_studio.db'),
  defaultPublisherAdapter: process.env.DEFAULT_PUBLISHER_ADAPTER || 'mock_x',
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  workerPollIntervalMs: parseInt(process.env.WORKER_POLL_INTERVAL_MS || '2000', 10),
  workerBatchSize: parseInt(process.env.WORKER_BATCH_SIZE || '5', 10),
  platformAdapters: {
    x: 'mock_x',
    linkedin: 'mock_linkedin',
    discord: 'discord',
    telegram: 'telegram',
    instagram: 'mock_x'
  }
};

module.exports = config;
