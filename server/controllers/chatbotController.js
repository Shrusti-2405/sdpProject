const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';
const OPENWEBUI_API_URL = process.env.OPENWEBUI_API_URL;
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY;

async function sendChat(messages, { max_tokens = 800, temperature = 0.5 } = {}) {
  // Prefer OpenRouter if key present
  if (OPENROUTER_API_KEY) {
    const payload = {
      model: OPENROUTER_MODEL,
      messages,
      max_tokens,
      temperature
    };
    const headers = {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      // Helpful (optional) headers recommended by OpenRouter
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Hospital Equipment Tracker'
    };
    const response = await axios.post(OPENROUTER_API_URL, payload, { headers, timeout: 30000 });
    const choice = response.data?.choices?.[0]?.message?.content || '';
    return choice;
  }

  // Optional: OpenWebUI self-hosted compat
  if (OPENWEBUI_API_URL && OPENWEBUI_API_KEY) {
    const payload = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens,
      temperature
    };
    const headers = {
      'Authorization': `Bearer ${OPENWEBUI_API_KEY}`,
      'Content-Type': 'application/json'
    };
    const response = await axios.post(OPENWEBUI_API_URL, payload, { headers, timeout: 30000 });
    const choice = response.data?.choices?.[0]?.message?.content || '';
    return choice;
  }

  throw new Error('No LLM provider configured. Set OPENROUTER_API_KEY or OPENWEBUI_API_URL + OPENWEBUI_API_KEY');
}

class ChatbotController {
  // Chat with maintenance bot
  async chatWithBot(req, res) {
    try {
      const { message, equipmentId, maintenanceId } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      // Create context-aware prompt
      let systemPrompt = `You are a Hospital Equipment Maintenance Bot. You help hospital staff with equipment maintenance, troubleshooting, and scheduling. 

Your capabilities include:
- Equipment maintenance guidance
- Troubleshooting common issues
- Maintenance scheduling assistance
- Equipment status monitoring
- Maintenance best practices
- Safety protocols

Always provide helpful, accurate, and professional responses. If you need specific equipment information, ask for clarification.`;

      // Add equipment context if provided
      if (equipmentId) {
        systemPrompt += `\n\nCurrent equipment context: Equipment ID ${equipmentId}`;
      }

      if (maintenanceId) {
        systemPrompt += `\n\nCurrent maintenance context: Maintenance ID ${maintenanceId}`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ];

      const botResponse = await sendChat(messages, { max_tokens: 500, temperature: 0.7 });

      res.status(200).json({
        success: true,
        data: {
          message: botResponse,
          timestamp: new Date(),
          equipmentId: equipmentId || null,
          maintenanceId: maintenanceId || null
        }
      });

    } catch (error) {
      const reason = error?.response?.data || error?.message || 'unknown error';
      console.error('Chatbot error:', reason);

      // Return an error to the client so UI can show it clearly
      return res.status(502).json({
        success: false,
        message: 'Chat service is unavailable right now.',
        error: typeof reason === 'string' ? reason : JSON.stringify(reason)
      });
    }
  }

  // Get maintenance suggestions based on equipment
  async getMaintenanceSuggestions(req, res) {
    try {
      const { equipmentId, equipmentType, issue } = req.body;

      if (!equipmentId && !equipmentType) {
        return res.status(400).json({
          success: false,
          message: 'Either equipmentId or equipmentType is required'
        });
      }

      let prompt = `Provide maintenance suggestions for hospital equipment. `;
      
      if (equipmentType) {
        prompt += `Equipment type: ${equipmentType}. `;
      }
      
      if (issue) {
        prompt += `Reported issue: ${issue}. `;
      }
      
      prompt += `Please provide:
      1. Immediate troubleshooting steps
      2. Preventive maintenance recommendations
      3. Safety considerations
      4. When to contact a technician
      5. Common causes and solutions`;

      const messages = [
        { role: 'system', content: 'You are a hospital equipment maintenance expert. Provide detailed, professional maintenance guidance.' },
        { role: 'user', content: prompt }
      ];

      const suggestions = await sendChat(messages, { max_tokens: 800, temperature: 0.5 });

      res.status(200).json({
        success: true,
        data: {
          suggestions,
          equipmentId: equipmentId || null,
          equipmentType: equipmentType || null,
          issue: issue || null,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Maintenance suggestions error:', error?.response?.data || error?.message);
      res.status(502).json({ success: false, message: 'Chat service unavailable', error: error?.message });
    }
  }

  // Get equipment troubleshooting guide
  async getTroubleshootingGuide(req, res) {
    try {
      const { equipmentId, symptoms } = req.body;

      if (!symptoms) {
        return res.status(400).json({
          success: false,
          message: 'Symptoms description is required'
        });
      }

      const prompt = `Provide a troubleshooting guide for hospital equipment with the following symptoms: ${symptoms}. 

Please include:
1. Step-by-step troubleshooting procedure
2. Safety precautions
3. When to stop and call a technician
4. Common solutions
5. Preventive measures`;

      const messages = [
        { role: 'system', content: 'You are a hospital equipment troubleshooting expert. Provide clear, safe, and systematic troubleshooting guidance.' },
        { role: 'user', content: prompt }
      ];

      const guide = await sendChat(messages, { max_tokens: 1000, temperature: 0.3 });

      res.status(200).json({
        success: true,
        data: {
          guide,
          equipmentId: equipmentId || null,
          symptoms,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Troubleshooting guide error:', error?.response?.data || error?.message);
      res.status(502).json({ success: false, message: 'Chat service unavailable', error: error?.message });
    }
  }

  // Get maintenance schedule recommendations
  async getMaintenanceScheduleRecommendations(req, res) {
    try {
      const { equipmentType, usage, criticality } = req.body;

      if (!equipmentType) {
        return res.status(400).json({
          success: false,
          message: 'Equipment type is required'
        });
      }

      const prompt = `Provide maintenance schedule recommendations for ${equipmentType} hospital equipment. `;
      
      if (usage) {
        prompt += `Usage level: ${usage}. `;
      }
      
      if (criticality) {
        prompt += `Criticality level: ${criticality}. `;
      }
      
      prompt += `Please provide:
      1. Recommended maintenance intervals
      2. Different types of maintenance (daily, weekly, monthly, quarterly, annual)
      3. Key maintenance tasks for each interval
      4. Warning signs to watch for
      5. Documentation requirements`;

      const messages = [
        { role: 'system', content: 'You are a hospital equipment maintenance scheduling expert. Provide comprehensive maintenance scheduling recommendations.' },
        { role: 'user', content: prompt }
      ];

      const recommendations = await sendChat(messages, { max_tokens: 1000, temperature: 0.4 });

      res.status(200).json({
        success: true,
        data: {
          recommendations,
          equipmentType,
          usage: usage || null,
          criticality: criticality || null,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Maintenance schedule recommendations error:', error?.response?.data || error?.message);
      res.status(502).json({ success: false, message: 'Chat service unavailable', error: error?.message });
    }
  }

  // Get safety protocols
  async getSafetyProtocols(req, res) {
    try {
      const { equipmentType, maintenanceType } = req.body;

      if (!equipmentType) {
        return res.status(400).json({
          success: false,
          message: 'Equipment type is required'
        });
      }

      const prompt = `Provide safety protocols for ${equipmentType} hospital equipment maintenance. `;
      
      if (maintenanceType) {
        prompt += `Maintenance type: ${maintenanceType}. `;
      }
      
      prompt += `Please include:
      1. Pre-maintenance safety checks
      2. Personal protective equipment requirements
      3. Safety procedures during maintenance
      4. Emergency procedures
      5. Post-maintenance safety verification
      6. Staff training requirements`;

      const messages = [
        { role: 'system', content: 'You are a hospital safety expert. Provide comprehensive safety protocols for equipment maintenance.' },
        { role: 'user', content: prompt }
      ];

      const protocols = await sendChat(messages, { max_tokens: 1000, temperature: 0.2 });

      res.status(200).json({
        success: true,
        data: {
          protocols,
          equipmentType,
          maintenanceType: maintenanceType || null,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Safety protocols error:', error?.response?.data || error?.message);
      res.status(502).json({ success: false, message: 'Chat service unavailable', error: error?.message });
    }
  }
}

module.exports = new ChatbotController();
