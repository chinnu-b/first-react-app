import React from 'react'


const Payments = () => {
    // This is the component for the Payments page
    // we will show the payments corresponding to the user in details
    const [payments, setPayments] = React.useState([]);
    const userId = localStorage.getItem('userId');
    // We will fetch the payments from the backend and show them here
    // We will show the payments in a table format
    // We will show the date, amount, and the status of the payment
    // now fetch the payments from the backend
    React.useEffect(() => {
        fetch('https://first-react-app-server.onrender.com/api/getPayments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    setPayments(data.payments);
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='dashboard'>
            <h3>Payments</h3>
            <table className="table w-75 m-auto">
                <thead>
                    <tr>
                        <th scope="col">Sl. No</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>

                    {payments.map((payment, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{payment.from}</td>
                                <td>{payment.to}</td>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.status || 'Completed'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>

    )
}

export default Payments