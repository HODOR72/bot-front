import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstanceBase = axios.create({
  baseURL: HOST_API,
});

const ApiClients = {
  axiosBase: axiosInstanceBase,
}

Object.values(ApiClients).forEach((instance) => instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
))

export default ApiClients;
