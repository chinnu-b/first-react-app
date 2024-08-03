import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';

const Users = () => {
    const [users, setUsers] = useState([])
    const userId = localStorage.getItem('userId');
    React.useEffect(() => {
        fetch('https://fyl-service.vercel.app/api/getUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    setUsers(data.users.filter(user => user._id !== userId));
                }
            })
            .catch(err => console.error(err));
    }, []);
    const deleteUser = (userId) => {
        return () => {
            fetch('https://fyl-service.vercel.app/api/deleteUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 'success') {
                        toast.success('User deleted successfully');
                        setUsers(users.filter(user => user._id !== userId && user.status !== 'Pending' ));
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
                        <th scope="col">Photo</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>

                    {users.map((user, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.photo ? <img src={'https://fyl-service.vercel.app/photo/' + user.photo} alt={user.firstName} style={{ width: '100px' }} /> : <img src={require('../assets/user.png')} alt={user.firstName} style={{ width: '50px' }} />}
                                </td>
                                <td><Link className="btn btn-primary" to={`/users/${user._id}`}> Edit</Link></td>
                                <td><button className="btn btn-danger" onClick={deleteUser(user._id)} >Delete</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Users