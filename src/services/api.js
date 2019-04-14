import axios from 'axios';

const api = axios.create({
  baseURL: 'https://omniweek.herokuapp.com'
});

export default api;
