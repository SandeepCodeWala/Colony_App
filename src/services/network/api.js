import axios from 'axios';
import baseURL from './base_url';

const buildHeaders = authKey => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (authKey) headers.Authorization = `Bearer ${authKey}`;
  return headers;
};

const normalizeError = error =>
  error?.response?.data || {
    success: false,
    message: error?.message || 'Unable to connect to the server',
  };

export async function getApi(method, authKey) {
  try {
    const response = await axios.get(baseURL.base_url + method, {
      headers: buildHeaders(authKey),
    });
    return response.data;
  } catch (error) {
    console.log('GET API Error:', error?.response?.data || error.message);
    return normalizeError(error);
  }
}

export async function getAPI(method) {
  try {
    const response = await axios.get((baseURL.termsBaseUrl || baseURL.base_url) + method, {
      headers: buildHeaders(),
    });
    return response.data;
  } catch (error) {
    console.log('GET Terms API Error:', error?.response?.data || error.message);
    return normalizeError(error);
  }
}

export async function postAPI(method, data, authKey) {
  return postApi(method, data, authKey);
}

export async function postApi(method, data, authKey) {
  try {
    const response = await axios.post(baseURL.base_url + method, data, {
      headers: buildHeaders(authKey),
    });
    return response.data;
  } catch (error) {
    console.log('POST API Error:', error?.response?.data || error.message);
    return normalizeError(error);
  }
}

export async function postAbsoluteApi(url, data, authKey) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        ...buildHeaders(authKey),
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.log('Absolute POST API Error:', error?.response?.data || error.message);
    return normalizeError(error);
  }
}

export async function putApiWithBase1(method, data, authKey) {
  try {
    const response = await axios.put(baseURL.base_url1 + method, data, {
      headers: buildHeaders(authKey),
    });
    return response.data;
  } catch (error) {
    console.log('PUT API Error:', error?.response?.data || error.message);
    return normalizeError(error);
  }
}


export async function putMultipartApiWithBase1(method, formData, authKey) {
  try {
    const headers = { Accept: 'application/json' };
    if (authKey) headers.Authorization = `Bearer ${authKey}`;

    const response = await axios.put(baseURL.base_url1 + method, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.log(
      'PUT Multipart API Error:',
      error?.response?.data || error.message,
    );
    return normalizeError(error);
  }
}

export async function CreateRestaurant(data, authKey) {
  try {
    const response = await axios.post(
      `${baseURL.base_url1}restaurant`,
      data,
      { headers: buildHeaders(authKey) },
    );
    return response.data;
  } catch (error) {
    console.log('Create Restaurant API Error:', error?.response?.data || error.message);
    return normalizeError(error);
  }
}
