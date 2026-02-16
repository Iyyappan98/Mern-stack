import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReview, getSingleProduct } from '../../actions/productAction'
import { useParams } from 'react-router-dom';
import Loader from '../layouts/Loader';
import { Carousel, CarouselItem } from 'react-bootstrap';
import MetaData from '../layouts/MetaData';
import { addCartItem } from '../../actions/cartAction';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { clearProduct, clearReviewSubmitted } from '../../slices/productSlice';
import ProductReview from './ProductReview';

const ProductDetail = () => {

    const dispatch = useDispatch();
    const { id } = useParams();
    const { product = {}, loading, isReviewSubmited, error } = useSelector(state => state.productState);
    const { user } = useSelector(state => state.authState)
    const [quantity, setQuantity] = useState(1);


    const increaseQty = () => {
        const count = document.querySelector('.count');
        if (product.stock === 0 || count.valueAsNumber >= product.stock) {
            return;
        }
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count');
        if (count.valueAsNumber === 1) {
            return;
        }
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    //Model open close for submit review

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const reviewHandler = () => {
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id)
        dispatch(createReview(formData))
    }



    useEffect(() => {
        if (isReviewSubmited) {
            handleClose();
            toast.success('Review Submited Successfully', {
                position: 'bottom-center',
                onOpen: () => dispatch(clearReviewSubmitted())
            })
        }
        if (error) {
            toast.error(error, {
                position: 'bottom-center'
            })
            return;
        }
        if (!product._id || isReviewSubmited) {
            dispatch(getSingleProduct(id));
        }

        return () => {
            dispatch(clearProduct())
        }

    }, [dispatch, id, isReviewSubmited, error])
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title={product.name} />
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {product.images && product.images.map(image => (
                                    <CarouselItem key={image._id}>
                                        <img className='d-block w-100' src={image.image} alt={product.name} height="500" width="500" />
                                    </CarouselItem>
                                ))}

                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">Product # {product._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                            <hr />

                            <p id="product_price">${product.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                            </div>
                            <button type="button" id="cart_btn" disabled={product.stock === 0 ? true : false} className="btn btn-primary d-inline ml-4" onClick={() => {
                                dispatch(addCartItem(product._id, quantity))
                                toast.success('Cart Item Added!', {
                                    position: 'bottom-center',
                                   
                                })
                            }}>Add to Cart</button>

                            <hr />

                            <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                            {user ? <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                Submit Your Review
                            </button> :
                                <div className='alert alert-danger mt-5'>Login to Post Review</div>
                            }

                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">

                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Submit Review</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <ul className="stars" >
                                                {
                                                    [1, 2, 3, 4, 5].map(star => (
                                                        <li
                                                            value={star}
                                                            onClick={() => setRating(star)}
                                                            className={`star ${star <= rating ? 'orange' : ''}`}
                                                            onMouseOver={(e) => e.target.classList.add('yellow')}
                                                            onMouseOut={(e) => e.target.classList.remove('yellow')}
                                                        ><i className="fa fa-star"></i></li>
                                                    ))
                                                }


                                            </ul>

                                            <textarea name="review" id="review" className="form-control mt-3" onChange={(e) => setComment(e.target.value)}>

                                            </textarea>
                                            <button disabled={loading} onClick={reviewHandler} aria-label='Close' className='btn my-3 float-right review-btn px-4 text-white'>submit</button>
                                        </Modal.Body>

                                    </Modal>


                                </div>

                            </div>

                        </div>

                    </div>
                    {product.reviews && product.reviews.length > 0 ?

                        <ProductReview reviews={product.reviews} /> : null

                    }
                </>
            }
        </>
    )
}

export default ProductDetail;
