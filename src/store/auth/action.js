import { API_CONSTANT } from '../../services/ApiConstant';
import {
  get,
  putWithOutToken,
  getWithOutToken,
  postWithFormData,
  postWithOutToken
} from '../../services/ApiServices';
import { fetchCategory } from '../app/action';
import { updateNotificationCount } from '../app/reducer';
import { store } from '../Store';
import { setUserDetail } from '../user/reducer';

const userLoginRequestOtp = (data) => {
  return new Promise((resolve, reject) => {
    postWithOutToken(API_CONSTANT.USER_LOGIN, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userLoginVerifyOtp = (data) => {
  return new Promise((resolve, reject) => {
    postWithOutToken(API_CONSTANT.USER_LOGIN_WITH_OTP, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userForgetRequestSendOtp = (data) => {
  return new Promise((resolve, reject) => {
    putWithOutToken(API_CONSTANT.USER_FORGET_WITH_SEND_OTP, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postUserRegisterWithFormData = (data) => {
  return new Promise((resolve, reject) => {
    postWithFormData(API_CONSTANT.USER_REGISTER, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const userForgetRequestVerifyOtp = (data) => {
  return new Promise((resolve, reject) => {
    putWithOutToken(API_CONSTANT.USER_FORGET_WITH_VERIFY_OTP, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postUserRegister = (data) => {
  return new Promise((resolve, reject) => {
    postWithOutToken(API_CONSTANT.USER_REGISTER, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const userForgetRequestChangePassword = (data) => {
  return new Promise((resolve, reject) => {
    putWithOutToken(API_CONSTANT.USER_FORGET_WITH_RESET_PASSWORD, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userRegisterRequestOtp = (queryParam) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.USER_REGISTER_OTP}${queryParam}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userRegisterVerifyOtp = (queryParam) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.USER_REGISTER_VERIFY_OTP}${queryParam}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userPhoneRequestOtp = (queryParam) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.USER_PHONE_OTP}${queryParam}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userPhoneVerifyOtp = (queryParam) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.USER_PHONE_VERIFY_OTP}${queryParam}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const referAndEarn = (data) => {
  return new Promise((resolve, reject) => {
    postWithOutToken(API_CONSTANT.REFER_EARN, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const referUser = (data) => {
  return new Promise((resolve, reject) => {
    postWithOutToken(API_CONSTANT.REFERRAL_USER, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userLogOut = (queryParam) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.USER_LOGOUT}${queryParam}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getUserInfo = (isCallCategory = false, header) => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.USER_INFO, header)
      .then((res) => {
        isCallCategory &&
          fetchCategory()
            .then((_res) => {})
            .catch((_err) => {});
        store.dispatch(setUserDetail(res?.data?.data));
        store.dispatch(
          updateNotificationCount(res?.data?.data?.notification_count)
        );
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  userLoginRequestOtp,
  userLoginVerifyOtp,
  userForgetRequestSendOtp,
  userForgetRequestVerifyOtp,
  userForgetRequestChangePassword,
  postUserRegisterWithFormData,
  userRegisterRequestOtp,
  userRegisterVerifyOtp,
  userPhoneRequestOtp,
  userPhoneVerifyOtp,
  postUserRegister,
  userLogOut,
  getUserInfo,
  referAndEarn,
  referUser
};
