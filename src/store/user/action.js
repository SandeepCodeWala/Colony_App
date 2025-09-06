import { API_CONSTANT } from '../../services/ApiConstant';
import {
  get,
  post,
  put,
  putWithTokenAndFormHeader
} from '../../services/ApiServices';

// const putRequestUpdateProfile = (data) => {
//   return new Promise((resolve, reject) => {
//     put(`${API_CONSTANT.UPDATE_PROFILE}`, data)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

const putRequestUpdateProfile = (data) => {
  return new Promise((resolve, reject) => {
    putWithTokenAndFormHeader(API_CONSTANT.UPDATE_PROFILE, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const putRequestchangePassword = (data) => {
  return new Promise((resolve, reject) => {
    put(`${API_CONSTANT.CHANGE_PASSWORD}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getUserList = (userType) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_USER_LIST}?user_type=${userType}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const submitEmployee = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.SUBMIT_EMPLOYEE_SUB_TYPE, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const getEmployeePolicy = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_EMPLOYEE_POLICY)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

export {
  putRequestUpdateProfile,
  putRequestchangePassword,
  getUserList,
  submitEmployee,
  getEmployeePolicy
};
