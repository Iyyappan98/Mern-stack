import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { deleteProduct, getAdminProducts } from '../../actions/productsAction';
import Sidebar from './Sidebar';
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import { clearProductDeleted } from '../../slices/productSlice';
const ProductList = () => {
  const { products = [], loading = true, error,} = useSelector(state => state.productsState);
  const { isProductDeleted, error: productError } = useSelector(state => state.productState);
  const dispatch = useDispatch();

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: 'ID',
          field: 'id',
          sort: 'asc'
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc'
        },
        {
          label: 'Price',
          field: 'price',
          sort: 'asc'
        },
        {
          label: 'Stock',
          field: 'stock',
          sort: 'asc'
        },
        {
          label: 'Action',
          field: 'action',
          sort: 'asc'
        }
      ],
      rows: []
    }

    products.forEach(product => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        action: (
          <>
            <Link to={`/admin/product/${product._id}`} className='btn btn-primary'>
              <i className='fa fa-pencil'></i>
            </Link>
            <Button onClick={e => deleteHandler(e, product._id)} className='btn btn-danger py-1 px-2 ml-2'>
              <i className='fa fa-trash'></i>
            </Button>
          </>
        )
      })
    })

    return data
  }

  useEffect(() => {
    if (error || productError) {
      toast.error(error || productError, {
        position: 'bottom-center'
      })
      return
    }
    if (isProductDeleted) {
      toast.success('Product Deleted', {
        position: 'bottom-center',
        onOpen: () => dispatch(clearProductDeleted())
      })
      
      return
    }
    dispatch(getAdminProducts)
  }, [dispatch, error, isProductDeleted])

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteProduct(id))
  }
  return (
    <div className='row'>
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Product lists</h1>
        <>
          {loading ? (<Loader />) : (

            <MDBDataTable
              className='px-3'
              bordered
              striped
              hover
              data={setProducts()}
            />
          )

          }
        </>
      </div>
    </div>
  )
}

export default ProductList
