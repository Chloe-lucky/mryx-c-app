/* eslint-disable no-param-reassign */
import axios from 'axios';

axios.defaults.baseURL = 'https://mallapi.duyiedu.com/goods/';
axios.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    appkey: 'xiaodeng_1605533370345',
  };
  return config;
}, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response.data);
export default axios;
