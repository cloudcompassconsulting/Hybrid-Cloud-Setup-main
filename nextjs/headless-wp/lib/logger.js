// lib/logger.js
export const logToServer = async (message) => {
    console.log('Client-side log:', message);  // Fallback logging to the browser console
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Error logging to server:', error);
    }
  };