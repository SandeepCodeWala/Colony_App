import { API_CONSTANT } from '../../services/ApiConstant';
import {
  getWithOutToken,
  get,
  patch,
  post,
  remove
} from '../../services/ApiServices';
import { store } from '../Store';
import { setCategoryList, setInventoryData } from './reducer';

const getUniversalData = () => {
  return new Promise((resolve, reject) => {
    getWithOutToken(API_CONSTANT.UNIVERSAL_DATA)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const getUniversalFeaturesData = () => {
  return new Promise((resolve, reject) => {
    getWithOutToken(API_CONSTANT.USER_GET_FEATURES)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
const getVendorOrderData = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_ORDER_DATA}${queryParams}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const getVendorOrderDetails = (request) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_GET_BY_ORDER_ID}${request}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const sendTaxInvoice = (orderId) => {
  return new Promise((resolve, reject) => {
    patch(`${API_CONSTANT.SEND_TAX_INVOICE}/${orderId}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const getInventory = (queryParams = '') => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_INVENTORY}${queryParams}`)
      .then((res) => {
        store.dispatch(setInventoryData(res?.data?.data));

        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const getDeleteOwnAccount = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_DELETE_ACCOUNT)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getInventoryProduct = (queryParams = '') => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_INVENTORY_PRODUCT}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

const fetchCategory = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_CATEGORY)
      .then((res) => {
        resolve(res);
        store.dispatch(setCategoryList(res?.data?.data));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getProductList = (queryParams) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.FETCH_PRODUCT}${queryParams}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const getProductById = (queryParams) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.FETCH_PRODUCT_BY_ID}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getCategoryList = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.SUB_CATEGORY_BY_ID}${queryParams}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const getGuestCategoryList = (queryParams) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.SUB_CATEGORY_BY_ID}${queryParams}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

const getNotificationList = ({ page = 1, pageSize = 20 }) => {
  return new Promise((resolve, reject) => {
    get(
      `${API_CONSTANT.USER_NOTIFICATION_LIST}?page=${page}&pageSize=${pageSize}`
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const clearNotification = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.NOTIFICATION_CLEAR)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const seenNotification = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.NOTIFICATION_SEEN)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSearchHistoryList = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_HISTORY_LIST)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const removeSearchKeyword = (data) => {
  return new Promise((resolve, reject) => {
    remove(API_CONSTANT.REMOVE_SEARCH_KEYWORDS, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateSearchHistoryList = (title) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.POST_HISTORY_LIST, { title })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const sendErp_PosData = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ERP_POS_SEND, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getTermsAndCondition = (query, header) => {
  return new Promise((resolve, reject) => {
    getWithOutToken(`${API_CONSTANT.GET_TERMS_AND_CONDITION}${query}`, header)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getReferalTermsAndCondition = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_REFERAL_TERMS_AND_CONDITION)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getProductSearchSuggestion = (keyword = '') => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.PRODUCT_SUGGESTION}?search_by_name=${keyword}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getCompanyDetails = () => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.COMPANY_DETAIL}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getExploreVideos = () => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_VIDEO}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const patchLanguage = (data) => {
  return new Promise((resolve, reject) => {
    patch(`${API_CONSTANT.UPDATE_LANGUAGE}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  getUniversalData,
  getVendorOrderData,
  getVendorOrderDetails,
  getInventory,
  getInventoryProduct,
  fetchCategory,
  getUniversalFeaturesData,
  getProductList,
  getCategoryList,
  getNotificationList,
  clearNotification,
  seenNotification,
  sendTaxInvoice,
  getDeleteOwnAccount,
  getSearchHistoryList,
  updateSearchHistoryList,
  sendErp_PosData,
  getTermsAndCondition,
  removeSearchKeyword,
  getReferalTermsAndCondition,
  getProductSearchSuggestion,
  getCompanyDetails,
  getExploreVideos,
  getProductById,
  patchLanguage,
  getGuestCategoryList
};
