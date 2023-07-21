import axios from 'axios';
import {
  ALL_PRODUCTS_FAIL,
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
} from '../constant/productConstant';

const getProducts =
  (currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });
      let link = `/api/v1/product?page=${currentPage}}`;
      // keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]
      const { data } = await axios.get(link);
      // console.log(data);
      dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

const getSearchProducts =
  (keyword = '', currentPage = 1, price) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });
      let link = `/api/v1/product?page=${currentPage}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`;

      const { data } = await axios.get(link);
      // console.log(data);
      dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/v1/product/${id}`);
    // console.log(data);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export { getProducts, getProductDetails, clearErrors, getSearchProducts };
