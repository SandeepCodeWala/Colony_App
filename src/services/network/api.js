import axios from 'axios';
import baseURL from './base_url';

const REQUEST_TIMEOUT = 15000;

const buildHeaders = (authKey, isJson = true) => {
  const headers = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  if (isJson) headers['Content-Type'] = 'application/json';
  if (authKey) headers.Authorization = `Bearer ${authKey}`;
  return headers;
};

const normalizeError = error =>
  error?.response?.data || {
    success: false,
    message:
      error?.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : error?.message || 'Unable to connect to the server',
  };

const request = async config => {
  try {
    const response = await axios({ timeout: REQUEST_TIMEOUT, ...config });
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.warn('API request failed:', error?.response?.data || error?.message);
    }
    return normalizeError(error);
  }
};

export function getApi(method, authKey) {
  return request({
    method: 'get',
    url: `${baseURL.base_url}${method}`,
    headers: buildHeaders(authKey),
  });
}

export function getAPI(method) {
  return request({
    method: 'get',
    url: `${baseURL.termsBaseUrl || baseURL.base_url}${method}`,
    headers: buildHeaders(),
  });
}

export function postAPI(method, data, authKey) {
  return postApi(method, data, authKey);
}

export function postApi(method, data, authKey) {
  return request({
    method: 'post',
    url: `${baseURL.base_url}${method}`,
    data,
    headers: buildHeaders(authKey),
  });
}

export function postAbsoluteApi(url, data, authKey) {
  return request({
    method: 'post',
    url: String(url || '').trim(),
    data,
    headers: buildHeaders(authKey),
  });
}

export function putApiWithBase1(method, data, authKey) {
  return request({
    method: 'put',
    url: `${baseURL.base_url1}${method}`,
    data,
    headers: buildHeaders(authKey),
  });
}

export function putMultipartApiWithBase1(method, formData, authKey) {
  return request({
    method: 'put',
    url: `${baseURL.base_url1}${method}`,
    data: formData,
    headers: buildHeaders(authKey, false),
  });
}

export function CreateRestaurant(data, authKey) {
  return request({
    method: 'post',
    url: `${baseURL.base_url1}restaurant`,
    data,
    headers: buildHeaders(authKey),
  });
}
