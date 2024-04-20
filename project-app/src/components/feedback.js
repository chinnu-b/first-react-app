import React, { useState, useContext } from 'react';
import { AuthContext } from '../util/authProvider';
import { toast, ToastContainer } from 'react-toastify';
const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState('');
  const { isAdmin, setIsAdmin } = useContext(AuthContext);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  //admin will see all feedbacks
  //user will send feedback
  React.useEffect(() => {
    if (isAdmin) {
      console.log('fetching feedbacks');
      const fetchFeedbacks = async () => {
        fetch('https://first-react-app-server.onrender.com/api/getFeedbacks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
          .then(response => response.json())
          .then(data => {
            if (data.status == 'success') {
              setFeedbacks(data.feedbacks);
            }
          })
          .catch(err => console.error(err));
        }
        fetchFeedbacks();

    }
  }, []);

  const sendFeedback = () => {
    //send feedback to the backend
    //show a success message
    fetch('https://first-react-app-server.onrender.com/api/sendFeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, feedback: feedback })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 'success') {
          //show a success message
          toast.success('Feedback sent successfully');
          setFeedback('');
          document.querySelector('textarea').value = '';
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className='dashboard'>
      <ToastContainer />
      <div className='w-75 m-auto'>
        <h3>Feedbacks</h3>
        {isAdmin && <table className="table w-75 m-auto">
          <thead>
            <tr>
              <th scope="col">Sl. No</th>
              <th scope="col">User</th>
              <th scope="col">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{feedback.userName}</td>
                  <td>{feedback.feedback}</td>
                </tr>
              )
            })}
          </tbody>
        </table>}
        {!isAdmin && <div>
          <textarea placeholder='Enter your feedback here' style={{ width: '100%', height: '200px' }} onChange={(e) => setFeedback(e.target.value)} >

          </textarea>
          <button onClick={sendFeedback} disabled={!feedback.length} className='btn btn-success mt-2' >Send feedback</button>
        </div>}
      </div>
    </div>
  )
}

export default Feedback