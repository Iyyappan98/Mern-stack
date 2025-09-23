import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import { deleteOrder,adminOrders as adminOrdersAction } from '../../actions/orderAction';
import { clearOrderDeleted } from '../../slices/orderSlice';

const OrderList = () => {
    const { adminOrders = [], loading = true, error, isOrderDeleted} = useSelector(state => state.orderState);
      
      const dispatch = useDispatch();
    
      const setOrders = () => {
        const data = {
          columns: [
            {
              label: 'ID',
              field: 'id',
              sort: 'asc'
            },
            {
              label: 'Number of Items',
              field: 'noOfItems',
              sort: 'asc'
            },
            {
              label: 'Amount',
              field: 'amount',
              sort: 'asc'
            },
            {
              label: 'Status',
              field: 'status',
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
    
        adminOrders.forEach(order => {
          data.rows.push({
            id: order._id,
            noOfItems: order.orderItems.length,
            amount: `$${order.totalPrice}`,
            status: order.orderStatus && order.orderStatus.includes('Delivered') ? 
            (<p style={{color: 'green'}}>{order.orderStatus}</p>) :
            (<p style={{color: 'red'}}>{order.orderStatus}</p>),
            action: (
              <>
                <Link to={`/admin/order/${order._id}`} className='btn btn-primary'>
                  <i className='fa fa-pencil'></i>
                </Link>
                <Button onClick={e => deleteHandler(e, order._id)} className='btn btn-danger py-1 px-2 ml-2'>
                  <i className='fa fa-trash'></i>
                </Button>
              </>
            )
          })
        })
    
        return data
      }
    
      useEffect(() => {
        if (error) {
          toast.error(error, {
            position: 'bottom-center'
          })
          return
        }
        if (isOrderDeleted) {
          toast.success('Order Deleted', {
            position: 'bottom-center',
            onOpen: () => dispatch(clearOrderDeleted())
          })
          
          return
        }
        dispatch(adminOrdersAction)
      }, [dispatch, error, isOrderDeleted])
    
      const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteOrder(id))
      }
  return (
     <div className='row'>
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Order Lists</h1>
        <>
          {loading ? (<Loader />) : (

            <MDBDataTable
              className='px-3'
              bordered
              striped
              hover
              data={setOrders()}
            />
          )

          }
        </>
      </div>
    </div>
  )
}

export default OrderList
