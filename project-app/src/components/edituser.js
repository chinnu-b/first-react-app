import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EditUser() {
    const navigate = useNavigate();
    // get the user id from the url
    const userId = window.location.pathname.split('/')[2]
    const [fileDetails, setFileDetails] = React.useState({});
    // get the user details from the server
    React.useEffect(() => {
        fetch('https://fyl-service.vercel.app//api/getUserByUserId', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    // set the user details in the form
                    document.getElementById('firstName').value = data.user.firstName || '';
                    document.getElementById('lastName').value = data.user.lastName || '';
                    document.getElementById('skills').value = data.user.skills || '';
                    document.getElementById('works').value = data.user.works || '';
                    document.getElementById('quotes').value = data.user.quotes || '';
                    document.getElementById('hobbies').value = data.user.hobbies || '';
                    document.getElementById('achievements').value = data.user.achievements || '';
                    setFileDetails({ path: data.user.photo });

                }
            })
            .catch(err => console.error(err));
    }, []);
    // handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // upload the file to the server
        const formData = new FormData();
        formData.append('file', file);
        fetch('https://fyl-service.vercel.app//api/uploadFile', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    setFileDetails(data.fileDetails);
                }
            })
            .catch(err => console.error(err));
    }
    //handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const skills = document.getElementById('skills').value;
        const works = document.getElementById('works').value;
        const quotes = document.getElementById('quotes').value;
        const hobbies = document.getElementById('hobbies').value;
        const achievements = document.getElementById('achievements').value;
        const photo = fileDetails.originalname || fileDetails.filename;
        fetch('https://fyl-service.vercel.app//api/editUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, firstName, lastName, skills, works, quotes, hobbies, achievements, photo })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    // redirect to the user details page
                    toast.success('User details updated successfully');
                        setTimeout(() => navigate(`/users`), 1000);
                }
            })
            .catch(err => console.error(err));
    }
    // populate a form with the user details
    return (

        <div className=' dashboard'>
            <div className='container'>

                <h2>Edit User Portfolio</h2>
                <form className="w-50 m-auto" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="firstName" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="lastName" />
                    </div>
                    {/* photo field */}
                    <div className="mb-3">
                        <label htmlFor="photo" className="form-label">Photo</label>
                        <input type="file" className="form-control" id="photo" onChange={handleFileChange}/>
                        {/* show photo name */}
                        {fileDetails.filename && <p>{fileDetails.filename}</p>}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="skills" className="form-label">Skills</label>
                        <input type="text" className="form-control" id="skills" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="works" className="form-label">Works</label>
                        <input type="text" className="form-control" id="works" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="quotes" className="form-label">Quotes</label>
                        <input type="text" className="form-control" id="quotes" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="hobbies" className="form-label">Email</label>
                        <input type="text" className="form-control" id="hobbies" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="achievements" className="form-label">Achievements</label>
                        <input type="text" className="form-control" id="achievements" />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            <ToastContainer/>
        </div>

    )
}

export default EditUser