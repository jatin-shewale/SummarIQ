const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Summarize text
  async summarizeText(text, additionalContext = null) {
    try {
      const response = await fetch(`${this.baseURL}/summarize/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          additional_context: additionalContext
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to summarize text');
      }

      return await response.json();
    } catch (error) {
      console.error('Text summarization failed:', error);
      throw error;
    }
  }

  // Summarize PDF
  async summarizePDF(file, additionalContext = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalContext) {
        formData.append('additional_context', additionalContext);
      }

      const response = await fetch(`${this.baseURL}/summarize/pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to summarize PDF');
      }

      return await response.json();
    } catch (error) {
      console.error('PDF summarization failed:', error);
      throw error;
    }
  }

  // Clear chat history
  async clearHistory() {
    try {
      const response = await fetch(`${this.baseURL}/clear-history`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear history');
      }

      return await response.json();
    } catch (error) {
      console.error('Clear history failed:', error);
      throw error;
    }
  }

  // Get chat history
  async getHistory() {
    try {
      const response = await fetch(`${this.baseURL}/history`);
      
      if (!response.ok) {
        throw new Error('Failed to get history');
      }

      return await response.json();
    } catch (error) {
      console.error('Get history failed:', error);
      throw error;
    }
  }
}

export default new ApiService(); 