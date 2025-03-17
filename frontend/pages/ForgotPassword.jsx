import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom'


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate()
  
  const handleEmailSubmit = async (e) => {
	e.preventDefault();
	try {
		const res = await fetch(process.env.APP_URL + 'users')
		const users = await res.json()
		const usersWithMatchingEmail = users.filter((user) => user.email === email)
		if(usersWithMatchingEmail.length === 0){
			alert(email + " doesn't exists.")
		}
		else{
			setSubmitted(true)
		}
	} catch(error){
		console.log(error);
	}
	if (submitted) {
		try{
			const response = await fetch(process.env.APP_URL + 'users/send-email/' + email, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			console.log(response.json())
		} catch(error){
			console.log(error)
		}
	}
	
  };

  const handleTokenSubmit = async (e) => {
	e.preventDefault();
	try{
		const response = await fetch(process.env.APP_URL + 'users/validate-token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, token}),
		});
		if(response.ok) {
			navigate('/login')
		}
		else{
			alert('Invalid token')
		}
	} catch(error){
		console.log(error);
	}
  };

  return (
    <div id="email-form">
      {submitted ? (
        <div>
          <h1>Thank you!</h1>
          <p>An email with the token has been sent to {email}</p>
		  <form onSubmit={handleTokenSubmit}>
			<div className='input'>
				<label style={{margin: '5px'}}>
					Token
				</label>
				<input
				style={{marginBottom: '30px'}}
				required type="text" 
				onChange={(e) => setToken(e.target.value)}
				/>
				<button className="button" type="submit">Submit</button>
			</div>
		  </form>
        </div>
      ) : (
        <form onSubmit={handleEmailSubmit}>
			<h1>Forgot Account Password</h1>
			<div className="input">
				<label style={{margin: '5px'}}>
					Email
				</label>
				<input
				style={{marginBottom: '30px'}}
				type="email"
				required
				onChange={(e) => setEmail(e.target.value)}
				/>
				<button className="button" type="submit">Submit</button>
			</div>
        	
        </form>
      )}
    </div>
  );
}
export default ForgotPassword;