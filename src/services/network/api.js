// import axios from 'axios'
import { Platform } from 'react-native';
import moment, { utc } from 'moment';
import baseURL from '../network/base_url';
import axios from 'axios';

export async function getApi(method, authKey) {
  let response = {};

  await axios
    .get(baseURL.base_url + method, {
      headers: {
        Authorization: `Bearer ${authKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(resp => {
      response = resp.data;
      console.log('getApi response : ', response);
    })
    .catch(error => {
      console.log('error : ', error);
    });
  return response;
}

export function getAPI(method) {
  console.log(
    'gitapi---baseURL.termsBaseUrl + method------',
    baseURL.termsBaseUrl + method,
  );
  return fetch(baseURL.termsBaseUrl + method, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log('responseresponse--', response);
      return response.json();
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}

export async function postAPI(method, data) {
  const formData = new FormData();
  let response = {};
  for (let key in data) {
    formData.append(key, data[key]);
  }
  console.log('baseURL + method', baseURL.base_url + method);
  console.log('Request params', formData);
  await axios.post(baseURL.base_url + method, data).then(res => {
    response = res.data;
  });
  return response;
}

// export async function postApi(method, data, authKey) {
//   console.log('baseURL + method', baseURL.base_url + method);
//   let response = {};
//   await axios
//     .post(baseURL.base_url + method, data, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//     .then(res => {
//       console.log('Respoooooooooooooooo', res.data);
//       response = res.data;
//     })
//     .catch(e => {
//       console.log('eeeeeeee-----', e.response.data);
//       response = e.response.data;
//     });
//   return response;
// }


export async function postApi(method, data, authKey) {
  console.log('➡️ API Request:', baseURL.base_url + method);
  let response = {};

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // ✅ Add token if available
    if (authKey) {
      headers['Authorization'] = `Bearer ${authKey}`;
    }

    const res = await axios.post(baseURL.base_url + method, data, { headers });

    console.log('✅ API Response:', res.data);
    response = res.data;
  } catch (e) {
    console.log('❌ API Error:', e?.response?.data || e.message);
    response = e?.response?.data || { success: false, message: e.message };
  }

  return response;
}


////////////
export async function putApiWithBase1(method, data, authKey) {
  // ⭐ Key Change: Using baseURL.base_url1
  const fullUrl = baseURL.base_url1 + method;
  console.log('➡️ API Request (PUT/Base1):', fullUrl);
  let response = {};

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // ✅ Add token if available
    if (authKey) {
      headers['Authorization'] = `Bearer ${authKey}`;
    }

    // ⭐ Constructing the request using the new full URL
    const res = await axios.put(fullUrl, data, { headers });

    console.log('✅ API Response (PUT/Base1):', res.data);
    response = res.data;
  } catch (e) {
    // Handle both Axios error with response data and generic JS errors
    console.log('❌ API Error (PUT/Base1):', e?.response?.data || e.message);
    response = e?.response?.data || { success: false, message: e.message };
  }

  return response;
}



export async function CreateRestaurant(data) {
  console.log('➡️ API Request:', baseURL.base_url + method);
  let response = {};

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // ✅ Add token if available
    if (authKey) {
      headers['Authorization'] = `Bearer ${authKey}`;
    }

    const res = await axios.post(baseURL.base_url + method, data, { headers });

    console.log('✅ API Response:', res.data);
    response = res.data;
  } catch (e) {
    console.log('❌ API Error:', e?.response?.data || e.message);
    response = e?.response?.data || { success: false, message: e.message };
  }

  return response;
}

