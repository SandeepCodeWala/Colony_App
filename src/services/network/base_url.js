// Keep this value on HTTPS for iOS App Transport Security and Android release builds.
// Replace it with the permanent production API domain before final store submission.
const API_ORIGIN = 'https://moistness-shudder-partition.ngrok-free.dev';
const normalizedOrigin = API_ORIGIN.trim().replace(/\/+$/, '');

const baseURL = {
  base_url: `${normalizedOrigin}/user/`,
  base_url1: `${normalizedOrigin}/`,
  termsBaseUrl: `${normalizedOrigin}/user/`,
};

export default baseURL;
