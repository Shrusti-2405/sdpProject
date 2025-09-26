// Test script to check server and database connection
const axios = require('axios');

const testConnection = async () => {
  try {
    console.log('🔍 Testing server connection...');
    
    // Test server health
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is running:', healthResponse.data);
    
    // Test equipment API
    console.log('🔍 Testing equipment API...');
    const equipmentResponse = await axios.get('http://localhost:5000/api/equipment');
    console.log('✅ Equipment API working:', equipmentResponse.data);
    
    // Test maintenance API
    console.log('🔍 Testing maintenance API...');
    const maintenanceResponse = await axios.get('http://localhost:5000/api/maintenance');
    console.log('✅ Maintenance API working:', maintenanceResponse.data);
    
    console.log('🎉 All tests passed! Your server is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('Server is not running. Please start the server with: npm start');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testConnection();
