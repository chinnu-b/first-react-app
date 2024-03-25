import React from 'react'

// This is the component for the Portfolio page
// We will show the portfolio of the user in details
// show the details of user's portfolio
// give attention to the design aspects of the portfolio
// show the portfolio in a table format
// user image, name, email, and the portfolio details



const Portfolio = () => {
  const userId = localStorage.getItem('userId');
  const [user, setUser] = React.useState({});
  React.useEffect(() => {
    fetch('http://localhost:4000/api/getUserByUserId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 'success') {
          setUser(data.user);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='dashboard'>
      <h3>Portfolio</h3>
      <div className="card w-75 m-auto p-2">
        {user.photo ? <img src={'http://localhost:4000/photo/' + user.photo} className="card-img-top" alt="..." style={{ width: '200px', height: '200px', borderRadius: '50%' }}/>
        : <img src={require('../assets/user.png')} className="card-img-top" alt="..." style={{ width: '200px', height: '200px', borderRadius: '50%' }}/>}
        <div className="card-body">
          <h5 className="card-title">{user.firstName} {user.lastName}</h5>
          {/* <p className="card-text">{user.email}</p>
          <p className="card-text">{user.portfolio}</p>
          {Object.keys(user).map((key, index) => {
            return (
              <p key={index} className="card-text">{key}: {user[key]}</p>
            )
          }
          )} */}
          {/* add the above details in table format */}
          <table className="table w-50 ml-1">
            <tbody>
              <tr>
                <td><b>Email</b></td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td><b>Mobile</b></td>
                <td>{user.mobile || 'NA'}</td>
              </tr>
              <tr>
                <td><b>Address</b></td>
                <td>{user.address || 'NA'}</td>
              </tr>
              <tr>
                <td><b>Skills</b></td>
                <td>{user.skills || 'NA'}</td>
              </tr>
              <tr>
                <td><b>Quotes</b></td>
                <td>{user.quotes || 'NA'}</td>
              </tr>
              <tr>
                <td><b>Works</b></td>
                <td>{user.works || 'NA'}</td>
              </tr>
              <tr>
                <td><b>Hobbies</b></td>
                <td>{user.hobbies || 'NA'}</td>
              </tr>
              <tr>
                <td><b>Achievements</b></td>
                <td>{user.achievements || 'NA'}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>


    

  )
}

export default Portfolio