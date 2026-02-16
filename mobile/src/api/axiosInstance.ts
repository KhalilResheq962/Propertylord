import axios from 'axios';

// IMPORTANT: Use your machine's local IP address instead of 'localhost'
// so the physical phone or emulator can reach the server.
// Example: 'http://192.168.1.10:3000'
const API_BASE_URL = 'http://10.0.2.2:3000'; // Default for Android Emulator

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosInstance;