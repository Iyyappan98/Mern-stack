import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import { deleteUser, getUsers } from '../../actions/userActions';
import { clearUserDeleted } from '../../slices/userSlice';

const UserList = () => {
    const { users = [], loading = true, error, isUserDeleted} = useSelector(state => state.userState);
          
          const dispatch = useDispatch();
        
          const setUsers = () => {
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
                  label: 'Email',
                  field: 'email',
                  sort: 'asc'
                },
                {
                  label: 'Role',
                  field: 'role',
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
        
            users.forEach(user => {
              data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                action: (
                  <>
                    <Link to={`/admin/user/${user._id}`} className='btn btn-primary'>
                      <i className='fa fa-pencil'></i>
                    </Link>
                    <Button onClick={e => deleteHandler(e, user._id)} className='btn btn-danger py-1 px-2 ml-2'>
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
            if (isUserDeleted) {
              toast.success('User Deleted', {
                position: 'bottom-center',
                onOpen: () => dispatch(clearUserDeleted())
              })
              
              return
            }
            dispatch(getUsers)
          }, [dispatch, error, isUserDeleted])
        
          const deleteHandler = (e, id) => {
            e.target.disabled = true;
            dispatch(deleteUser(id))
          }
  return (
    <div className='row'>
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Users Lists</h1>
        <>
          {loading ? (<Loader />) : (

            <MDBDataTable
              className='px-3'
              bordered
              striped
              hover
              data={setUsers()}
            />
          )

          }
        </>
      </div>
    </div>
  )
}

export default UserList
