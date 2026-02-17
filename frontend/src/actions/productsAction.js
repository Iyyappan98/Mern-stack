import axios from 'axios'
import { adminProductsFail, adminProductsRequest, adminProductsSuccess, productsFail, productsRequest, productsSuccess } from '../slices/productsSlices';
import { deleteProductFail, deleteProductRequest, deleteProductSuccess, deleteReviewFail, deleteReviewRequest, deleteReviewSuccess, newProductFail, newProductRequest, newProductSuccess, reviewsFail, reviewsRequest, reviewsSuccess, updateProductFail, updateProductRequest, updateProductSuccess } from '../slices/productSlice';



export const getProducts = (currentPage,keyword,price,category,rating) => async (dispatch) => {

  try {
    dispatch(productsRequest());  
    let link = `${process.env.REACT_APP_API_URL}/api/v1/products?page=${currentPage}`;

    if(keyword) {
       link += `&keyword=${keyword}`
    }

    if(price) {
       link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
    }
    if(category) {
       link += `&category=${category}`
    }
    if(rating) {
       link += `&ratings=${rating}`
    }
    
    const {data} =  await axios.get(link);
    dispatch(productsSuccess(data))

  } catch (error) {
     dispatch(productsFail(error.response.data.message))
  }
  

}


export const getAdminProducts = async (dispatch) => {
   try {
      dispatch(adminProductsRequest());
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/admin/products`);
      dispatch(adminProductsSuccess(data));
   } catch (error) {
      dispatch(adminProductsFail(error.response.data.message))
   }
}

export const createNewProduct = productData => async (dispatch) => {
   try {
      dispatch(newProductRequest());
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/admin/product/new`, productData);
      dispatch(newProductSuccess(data));
   } catch (error) {
      dispatch(newProductFail(error.response.data.message))
   }
}

export const deleteProduct = id => async (dispatch) => {
   try {
      dispatch(deleteProductRequest());
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/product/${id}`);
      dispatch(deleteProductSuccess());
   } catch (error) {
      dispatch(deleteProductFail(error.response.data.message))
   }
}


export const updateProduct =  (id,productData)  => async (dispatch) => {
   try {
      dispatch(updateProductRequest());
      const {data} = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/admin/product/${id}`, productData);
      dispatch(updateProductSuccess(data));
   } catch (error) {
      dispatch(updateProductFail(error.response.data.message))
   }
}

export const getReviews = id => async (dispatch) => {

  try {
    dispatch(reviewsRequest());    
    const {data} =  await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/admin/reviews`, {params: {id}});
    dispatch(reviewsSuccess(data))

  } catch (error) {
     dispatch(reviewsFail(error.response.data.message))
  }
  

}

export const deleteReview = (productId,id) => async (dispatch) => {

  try {
    dispatch(deleteReviewRequest());    
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/review`, {params: {productId,id}});
    dispatch(deleteReviewSuccess())

  } catch (error) {
     dispatch(deleteReviewFail(error.response.data.message))
  }
  

}