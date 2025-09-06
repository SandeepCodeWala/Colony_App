import { API_CONSTANT } from '../../services/ApiConstant';
import {
  get,
  post,
  postWithTokenAndFormHeader,
  putWithTokenAndFormHeader,
  put,
  remove,
  getWithOutToken
} from '../../services/ApiServices';
import { store } from '../Store';
import { faqDataSuccess } from '../app/reducer';
import {
  addOfferPriceList,
  addProductList,
  setOfferPriceList,
  setProductList
} from './reducer';

const getProductVariants = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.PRODUCT_VARIATIONS)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const getWarehouseAdd = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_WAREHOUSE)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const postAddProductVariant = (data) => {
  return new Promise((resolve, reject) => {
    putWithTokenAndFormHeader(API_CONSTANT.PRODUCT_ADD_VARIANT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const getProductCategories = (data) => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.VENDER_PRODUCT_CATEGORY)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const getRequestProduct = (queryParams, fetchMore) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_PRODUCT_REQUEST}${queryParams}`)
      .then((res) => {
        if (fetchMore) {
          store.dispatch(addOfferPriceList(res?.data.data));
        } else {
          store.dispatch(setOfferPriceList(res?.data.data));
        }

        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getCurrentOrders = () => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_DASHBOARD_VENDOR}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const putRequestVendor = (data) => {
  return new Promise((resolve, reject) => {
    put(`${API_CONSTANT.FETCH_ACCEPT_VENDOR}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const putRequestOutForDelivery = (data) => {
  return new Promise((resolve, reject) => {
    put(`${API_CONSTANT.FETCH_OUT_FOR_DELIVERY}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getRetailerRequests = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_RATAILER_REQUESTS}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postVendorAccept = (data) => {
  return new Promise((resolve, reject) => {
    post(`${API_CONSTANT.ACCEPT_REQUEST_BY_VENDOR}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getRetailer = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_RETAILER}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const geAllRetailer = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_RETAILER}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postReferUser = (data) => {
  return new Promise((resolve, reject) => {
    post(`${API_CONSTANT.USER_REFER}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getRetailerHistory = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.ORDER_BY_USERID}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postPlaceOrder = (data) => {
  return new Promise((resolve, reject) => {
    post(`${API_CONSTANT.ACCEPT_ORDER_VENDOR}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getFlashSalesData = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_FLASH_SALES}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const orderAcceptAndCancel = (data) => {
  return new Promise((resolve, reject) => {
    put(API_CONSTANT.ORDER_ACCEPT_BY_VENDOR, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const fetchInvoiceData = (orderID) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.INVOICE_DOWNLOAD_URL}/${orderID}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteOwnAccount = (data) => {
  return new Promise((resolve, reject) => {
    remove(API_CONSTANT.DELETE_OWN_ACCOUNT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getFlashProductVar = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_PRODUCT_VAR)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postFlashProduct = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ADD_FLASH_PRODUCT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const supportEmail = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.EMAIL_REQUEST, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getFaqDetails = (data) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.GET_FAQ}${data}`)
      .then((res) => {
        store.dispatch(faqDataSuccess(res?.data?.data));
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const reviewAndFeedback = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.REVIEW_FEEDBACK, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const putRequestSetAsDefault = (data) => {
  return new Promise((resolve, reject) => {
    put(`${API_CONSTANT.SET_AS_DEFAULT}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getUserPermissions = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_PERMISSIONS_ACTIVE_ONLY)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const sendEmailOtpToSubUser = (request) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.SEND_SUB_USER_EMAIL_OTP}${request}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const verifySubUserEmailOtp = (request) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.VERIFY_SUB_USER_EMAIL}${request}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const onAddSubUser = (data) => {
  return new Promise((resolve, reject) => {
    postWithTokenAndFormHeader(API_CONSTANT.ADD_SUB_USER, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateSubUser = (data) => {
  return new Promise((resolve, reject) => {
    putWithTokenAndFormHeader(API_CONSTANT.EDIT_SUB_USER, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
// const updateSubUser = (data) => {
//   return new Promise((resolve, reject) => {
//     put(`${API_CONSTANT.EDIT_SUB_USER}`, data)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

const getAllSubUsers = (request) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_ALL_SUB_USERS}${request}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteWarehouse = (data) => {
  return new Promise((resolve, reject) => {
    remove(API_CONSTANT.DELETE_WAREHOUSE, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteSubUser = (request) => {
  return new Promise((resolve, reject) => {
    remove(`${API_CONSTANT.DELETE_SUB_USER}${request}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const fetchProductVendor = (queryParams = '', fetchMore, isStore = false) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_PRODUCT}${queryParams}`)
      .then((res) => {
        if (!isStore) {
          if (fetchMore) {
            store.dispatch(addProductList(res?.data.data));
          } else {
            store.dispatch(setProductList(res?.data.data));
          }
        }

        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAllTypes = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_GETALL_TYPES)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAllCategory = (query = '') => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_CATEGORY}${query}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postAddProduct = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ADD_PRODUCT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postAddProductWithVariant = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ADD_PRODUCT_WITH_VARIANT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postEditProductVariant = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.EDIT_PRODUCT_VARIANT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteProductVariant = (data) => {
  return new Promise((resolve, reject) => {
    remove(API_CONSTANT.DELETE_PRODUCT_VARIANT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteProductWithVariant = (request) => {
  return new Promise((resolve, reject) => {
    // get(`${API_CONSTANT.ACTIVATE_PRODUCT_WITH_VARIANT}`)
    remove(`${API_CONSTANT.DELETE_PRODUCT_WITH_VARIANT}${request}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteRequestProduct = (request) => {
  return new Promise((resolve, reject) => {
    // get(`${API_CONSTANT.ACTIVATE_PRODUCT_WITH_VARIANT}`)
    remove(`${API_CONSTANT.DELETE_REQUEST_PRODUCT}`, request)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteFlashInput = (request) => {
  return new Promise((resolve, reject) => {
    remove(`${API_CONSTANT.DELETE_FLASH_INPUT}`, request)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const putFlashSaleProduct = (data) => {
  return new Promise((resolve, reject) => {
    put(API_CONSTANT.EDIT_FLASH_SALES, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getArchiveProduct = (queryParams = '') => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_ARCHIVE_PRODUCT}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const putSubUserStatusChange = (data) => {
  return new Promise((resolve, reject) => {
    put(API_CONSTANT.USER_STATUS_CHANGE, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  deleteSubUser,
  getAllSubUsers,
  getCurrentOrders,
  getFlashProductVar,
  getFlashSalesData,
  getProductCategories,
  getProductVariants,
  getRequestProduct,
  getRetailer,
  getRetailerHistory,
  getUserPermissions,
  getWarehouseAdd,
  orderAcceptAndCancel,
  deleteOwnAccount,
  onAddSubUser,
  geAllRetailer,
  postAddProductVariant,
  postEditProductVariant,
  postFlashProduct,
  supportEmail,
  putRequestSetAsDefault,
  deleteWarehouse,
  reviewAndFeedback,
  postPlaceOrder,
  postReferUser,
  putRequestVendor,
  sendEmailOtpToSubUser,
  verifySubUserEmailOtp,
  fetchProductVendor,
  getAllTypes,
  getAllCategory,
  postAddProduct,
  postAddProductWithVariant,
  deleteProductVariant,
  deleteProductWithVariant,
  getArchiveProduct,
  getRetailerRequests,
  postVendorAccept,
  deleteRequestProduct,
  deleteFlashInput,
  putFlashSaleProduct,
  updateSubUser,
  putSubUserStatusChange,
  getFaqDetails,
  putRequestOutForDelivery,
  fetchInvoiceData
};
