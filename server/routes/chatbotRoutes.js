const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Chatbot routes
router.post('/chat', chatbotController.chatWithBot);
router.post('/suggestions', chatbotController.getMaintenanceSuggestions);
router.post('/troubleshooting', chatbotController.getTroubleshootingGuide);
router.post('/schedule-recommendations', chatbotController.getMaintenanceScheduleRecommendations);
router.post('/safety-protocols', chatbotController.getSafetyProtocols);

module.exports = router;
