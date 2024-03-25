
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Requests = () => {
  const [users, setUsers] = useState([])
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  React.useEffect(() => {
    fetch('http://localhost:4000/api/getUsers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 'success') {
          setUsers(data.users.filter(user => user._id !== userId && user.status === 'Pending'));
        }
      })
      .catch(err => console.error(err));
  }, []);
  const requestPayment = (userId) => {
    return () => {
      fetch('http://localhost:4000/api/requestPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 'success') {
            toast.success('Payment requested successfully');
            // refresh the users list
            fetch('http://localhost:4000/api/getUsers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId })
            })
              .then(response => response.json())
              .then(data => {
                userId = localStorage.getItem('userId');
                if (data.status == 'success') {
                  setUsers(data.users.filter(user => user._id !== userId && user.status === 'Pending'));
                }
              })
              .catch(err => console.error(err));
          }
        })
        .catch(err => console.error(err));
    }
  }
  const createPortfolio = (userId) => {
    navigate(`/users/${userId}`);
  }


  const deleteUser = (userId) => {
    return () => {
      fetch('http://localhost:4000/api/deleteUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 'success') {
            toast.success('User deleted successfully');
            setUsers(users.filter(user => user._id !== userId));
          }
        })
        .catch(err => console.error(err));
    }
  }
  return (
    <div className='dashboard'>
      <ToastContainer />
      <h3>Users</h3>
      <table className="table w-75 m-auto">
        <thead>
          <tr>
            <th scope="col">Sl. No</th>
            <th scope="col">User</th>
            <th scope="col">Email</th>
            <th scope="col">Payment status</th>
            <th scope="col">Action</th>
            <th scope="col">Action</th>

          </tr>
        </thead>
        <tbody>

          {users.map((user, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                {user.status === 'Pending' ? <td><h5><span className="badge bg-warning sm-2">Pending</span></h5></td> : <td><h5><span className="badge bg-success ">Payed</span></h5></td>}
                {user.status === 'Pending' ?
                  user.paymentRequested ?
                    <td><button className="btn btn-secondary" disabled>Payment Requested</button></td>
                    : <td><button className="btn btn-primary" onClick={requestPayment(user._id)}>Request Payment</button></td> : <td><button className="btn btn-primary" onClick={createPortfolio(user._id)}>Create Portfolio</button></td>}
                <td><button className="btn btn-danger" onClick={deleteUser(user._id)} >Delete</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Requests