import { API_CONSTANT } from '../../services/ApiConstant';
import { get, post, put, remove } from '../../services/ApiServices';
import { store } from '../Store';
import { addWholesalesProductList, setWholesalesProductList } from './reducer';

const fetchProduct = (queryParams, fetchMore, isStore = false) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_PRODUCT}${queryParams}`)
      .then((res) => {
        if (!isStore) {
          if (fetchMore) {
            store.dispatch(addWholesalesProductList(res?.data.data));
          } else {
            store.dispatch(setWholesalesProductList(res?.data.data));
          }
        }

        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const fetchCategoryProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_PRODUCT}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const fetchWarehouseList = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_WAREHOUSE)
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

const fetchCartList = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_CART_LIST)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const fetchPaymentMethod = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.FETCH_PAYMENT_METHOD)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateCartQuantity = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.CART_ADD, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteCartItem = (data) => {
  return new Promise((resolve, reject) => {
    remove(API_CONSTANT.DELETE_CART_ITEM, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateCartItem = (data) => {
  return new Promise((resolve, reject) => {
    put(API_CONSTANT.UPDATE_CART_ITEM, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userOrderConfirmOtp = (data) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.USER_ORDER_CONFIRMATION}${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userConfirmationVerifyOtp = (data) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.USER_CONFIRMATION_VERIFY}${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const emptyCart = () => {
  return new Promise((resolve, reject) => {
    remove(API_CONSTANT.EMPTY_CART)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postReportOrder = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.REPORT_ORDER, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const sendNotificationAndEmail = (queryParam) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.SEND_NOTIFICATION_EMAIL}?${queryParam}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getProductById = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_PRODUCT_BY_ID}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateProductEnableDisable = (data) => {
  return new Promise((resolve, reject) => {
    put(API_CONSTANT.PRODUCT_ENABLE_DISABLE, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getProductRecommendation = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.PRODUCT_RECOMMENDATION}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// const getFlashSalesList = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     get(`${API_CONSTANT.FLASH_SALE_DATA}${queryParams}`)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

const getFlashSalesList = (queryParams = '', fetchMore, isStore = false) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FLASH_SALE_DATA}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSupplyMatchOffer = (queryParams = '') => {
  return new Promise((resolve, reject) => {
    get(
      `${API_CONSTANT.SUPPLYMATCH_OFFER}${queryParams}&user_type_data=super_admin`
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getCurrentOrderList = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_CURRENT_ORDER)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getRequestProduct = () => {
  return new Promise((resolve, reject) => {
    get(API_CONSTANT.GET_REQUEST_PRODUCT)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postRequestProduct = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ADD_REQUEST_PRODUCT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const putRequestProduct = (data) => {
  return new Promise((resolve, reject) => {
    put(API_CONSTANT.EDIT_REQUEST_PRODUCT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getRequestProductList = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.GET_REQUEST_PRODUCT_LIST}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const postWishlist = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ADD_REMOVE_WISHLIST, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const putReOrder = (data) => {
  const urlPath = data?.isRequested
    ? API_CONSTANT.REQUESTED_ORDER_PAYMENT
    : API_CONSTANT.RETRY_PAYMENT;
  return new Promise((resolve, reject) => {
    put(urlPath, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const fetchWishlist = (queryParams) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.FETCH_WISHLIST}${queryParams}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const orderBuyCart = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ORDER_BUY_CART, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getBankList = (search_key) => {
  return new Promise((resolve, reject) => {
    get(`${API_CONSTANT.BANK_LIST}?search_by_name=${search_key}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const addOutletAddress = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.ADD_OUTLET, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editWarehouseOutletAddress = (data) => {
  return new Promise((resolve, reject) => {
    post(API_CONSTANT.EDIT_WAREHOUSE_OUTLET, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  fetchProduct,
  fetchWarehouseList,
  deleteWarehouse,
  fetchCartList,
  updateCartQuantity,
  deleteCartItem,
  updateCartItem,
  emptyCart,
  getProductById,
  userOrderConfirmOtp,
  userConfirmationVerifyOtp,
  getProductRecommendation,
  getFlashSalesList,
  getCurrentOrderList,
  getRequestProduct,
  postRequestProduct,
  getRequestProductList,
  postWishlist,
  fetchWishlist,
  orderBuyCart,
  postReportOrder,
  addOutletAddress,
  fetchCategoryProduct,
  putRequestProduct,
  putReOrder,
  editWarehouseOutletAddress,
  sendNotificationAndEmail,
  getBankList,
  fetchPaymentMethod,
  updateProductEnableDisable,
  getSupplyMatchOffer
};
