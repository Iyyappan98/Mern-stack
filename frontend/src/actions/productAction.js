import axios from 'axios'
import { createReviewFail, createReviewRequest, createReviewSuccess, productFail, productRequest, productSuccess } from '../slices/productSlice';



export const getSingleProduct = id => async (dispatch) => {

  try {
    dispatch(productRequest());  
    const {data} =  await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/product/${id}`);
    dispatch(productSuccess(data))

  } catch (error) {
     dispatch(productFail(error.response.data.message))
  }
  

}

export const createReview = reviewData => async (dispatch) => {

  try {
    dispatch(createReviewRequest());  
    const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
    const {data} =  await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/review`, reviewData, config);
    dispatch(createReviewSuccess(data))

  } catch (error) {
     dispatch(createReviewFail(error.response.data.message))
  }
  

}