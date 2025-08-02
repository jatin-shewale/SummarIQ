import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error(error.response.data.detail || 'Invalid request');
    } else if (error.response?.status === 422) {
      throw new Error('Validation error: ' + (error.response.data.detail || 'Invalid data'));
    } else if (error.response?.status === 500) {
      throw new Error('Server error: Please try again later');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout: The server is taking too long to respond');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Please check your connection and ensure the backend is running');
    }
    
    throw new Error(error.response?.data?.detail || error.message || 'An unexpected error occurred');
  }
);

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding. Please ensure it is running on port 8000.');
    }
  },

  // Text summarization
  async summarizeText(text, additionalContext = '', title = '') {
    try {
      const response = await api.post('/summarize/text', {
        text: text.trim(),
        additional_context: additionalContext.trim() || null,
        title: title.trim() || null,
      });
      return response.data;
    } catch (error) {
      console.error('Text summarization error:', error);
      throw error;
    }
  },

  // PDF summarization
  async summarizePDF(file, additionalContext = '', title = '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalContext.trim()) {
        formData.append('additional_context', additionalContext.trim());
      }
      
      if (title.trim()) {
        formData.append('title', title.trim());
      }

      const response = await api.post('/summarize/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('PDF summarization error:', error);
      throw error;
    }
  },

  // List all summaries
  async listSummaries() {
    try {
      const response = await api.get('/summaries');
      return response.data;
    } catch (error) {
      console.error('List summaries error:', error);
      throw error;
    }
  },

  // Test backend connection
  async testConnection() {
    try {
      const response = await api.get('/', { timeout: 5000 });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: 'Could not connect to backend server. Please ensure it is running on port 8000.' 
      };
    }
  }
};

export default apiService;