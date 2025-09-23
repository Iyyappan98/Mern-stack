import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '.././layouts/MetaData'
import { getProducts } from '../../actions/productsAction';
import Loader from '.././layouts/Loader';
import Product from '.././product/Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const ProductSearch = () => {
  const dispatch = useDispatch();
  const { products, loading, error , productsCount, resPerPage} = useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [price,setPrice] = useState([1,1000]);
  const [priceChanged, setPriceChanged] = useState(price);
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(0);
  console.log(currentPage);

  const {keyword} = useParams();
  const categories = [
    'Electronics',
    'Mobile Phones',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes,Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
  ]

  const setCurrentPageNo = (pageNo) => {
     setCurrentPage(pageNo);
  }

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: 'bottom-center'
      })
    }

    dispatch(getProducts(currentPage,keyword,priceChanged,category,rating))
  }, [error, dispatch,currentPage,keyword,priceChanged,category,rating])

  return (
    <>
      {loading ? <Loader /> :
        <>
          <MetaData title={"Buy best products"} />
          <h1 id="products_heading">Search Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              <div className='col-6 col-md-3 mb-5 mt-5'>
                {/* //price filter */}
                <div className='px-5' onMouseUp={()=>setPriceChanged(price)}>
                    <Slider 
                      range={true}
                      marks={
                        {
                          1: "$1",
                          1000: '$1000'
                        }
                      }
                      min={1}
                      max={1000}
                      defaultValue={price}
                      onChange={(price) => {setPrice(price)}}
                      handleRender={
                         renderProps => {
                            return (
                              <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                <div {...renderProps.props}>

                                </div>
                              </Tooltip>
                            )
                         }
                      }
                    />
                </div>
                <hr className='my-5'/>
                {/* Category filter */}
                <div className='mt-5'>
                    <h3 className='mb-3'>Categories</h3>
                    <ul className='ml-0'>
                      {categories.map(category => 
                         <li key={category} style={{cursor: "pointer", listStyleType: "none"}} onClick={()=>setCategory(category)}>{category}</li>
                      )}
                     
                    </ul>
                </div>
                <hr className='my-5'/>
                {/* Ratings filter */}
                <div className='mt-5'>
                  <div className='mb-3'>
                    <ul className='ml-0'>
                      {[5,4,3,2,1].map(star => 
                         <li key={star} style={{cursor: "pointer", listStyleType: "none"}} onClick={()=>setRating(star)}>
                          <div className='rating-outer'>
                             <div className='rating-inner' style={{width: `${star * 20}%`}}></div>
                          </div>
                         </li>
                      )}
                     
                    </ul>
                  </div>
                </div>


              </div>
               <div className='col-6 col-md-9'>
                 <div className='row'>
                   {products && products.map(product => (
                     <Product col={4} key={product._id} product={product} />
                  ))}
                 </div>
               </div>
              
            </div>
          </section>
          {productsCount > 0 && productsCount >= resPerPage ? 
          <div className='d-flex justify-content-center mt-5'>
             <Pagination 
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={"Next"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass={'page-item'}
                linkClass={'page-link'}
             />
          </div> : null }
        </>
      }
    </>
  )
}

export default ProductSearch;
