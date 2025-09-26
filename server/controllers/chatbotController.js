const axios = require('axios');

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

      // Prepare the request to OpenAI
      const openaiRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      };

      // Make request to OpenAI API
      const response = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequest, {
        headers: {
          'Authorization': 'Bearer sk-bf725748416143d88b7ea444d68f0c90',
          'Content-Type': 'application/json'
        }
      });

      const botResponse = response.data.choices[0].message.content;

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
      console.error('Chatbot error:', error);
      
      // Fallback response if OpenAI API fails
      const fallbackResponse = "I'm sorry, I'm having trouble connecting to my maintenance knowledge base right now. Please try again in a moment, or contact your maintenance supervisor for immediate assistance.";
      
      res.status(200).json({
        success: true,
        data: {
          message: fallbackResponse,
          timestamp: new Date(),
          isFallback: true
        }
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

      const openaiRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a hospital equipment maintenance expert. Provide detailed, professional maintenance guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.5
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequest, {
        headers: {
          'Authorization': 'Bearer sk-bf725748416143d88b7ea444d68f0c90',
          'Content-Type': 'application/json'
        }
      });

      const suggestions = response.data.choices[0].message.content;

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
      console.error('Maintenance suggestions error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error generating maintenance suggestions',
        error: error.message
      });
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

      const openaiRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a hospital equipment troubleshooting expert. Provide clear, safe, and systematic troubleshooting guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequest, {
        headers: {
          'Authorization': 'Bearer sk-bf725748416143d88b7ea444d68f0c90',
          'Content-Type': 'application/json'
        }
      });

      const guide = response.data.choices[0].message.content;

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
      console.error('Troubleshooting guide error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error generating troubleshooting guide',
        error: error.message
      });
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

      const openaiRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a hospital equipment maintenance scheduling expert. Provide comprehensive maintenance scheduling recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.4
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequest, {
        headers: {
          'Authorization': 'Bearer sk-bf725748416143d88b7ea444d68f0c90',
          'Content-Type': 'application/json'
        }
      });

      const recommendations = response.data.choices[0].message.content;

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
      console.error('Maintenance schedule recommendations error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error generating maintenance schedule recommendations',
        error: error.message
      });
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

      const openaiRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a hospital safety expert. Provide comprehensive safety protocols for equipment maintenance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.2
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequest, {
        headers: {
          'Authorization': 'Bearer sk-bf725748416143d88b7ea444d68f0c90',
          'Content-Type': 'application/json'
        }
      });

      const protocols = response.data.choices[0].message.content;

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
      console.error('Safety protocols error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error generating safety protocols',
        error: error.message
      });
    }
  }
}

module.exports = new ChatbotController();
