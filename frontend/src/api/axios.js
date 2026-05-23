import axios from 'axios';

export default axios.create({
  baseURL: 'https://uts-pemweb-production-b30f.up.railway.app/api'
});