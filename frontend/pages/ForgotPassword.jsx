import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(null)

  
  const handleEmailSubmit = async (e) => {
    setSubmitted(true);
	try{
		const response = await fetch(process.env.LOCAL_URL + 'users/send-email/' + email, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		console.log(response.json())
	} catch(error){
		console.log(error)
	}
  };

  const handleTokenSubmit = async (e) => {
	e.preventDefault();
	try{
		const response = await fetch(process.env.LOCAL_URL + 'users/validate-token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, token}),
		});
		if(response.ok) {
			setIsValidToken(true);
		}
		else{
			setIsValidToken(false);
		}
	} catch(error){
		console.log(error);
		setIsValidToken(false);
	}
  };

  function invalidError(isValidToken){
	if(isValidToken === false){
		return(
			<p style={{color: 'red'}}> This is an invalid token</p>
		);
	}
	else if(isValidToken === true){
		return(
			<p style={{color: 'green'}}> This is a valid token</p>
		);
	}
  }
  return (
    <div>
      {submitted ? (
        <div>
          <h1>Thank you!</h1>
          <p>An email with the token has been sent to {email}</p>
		  <form onSubmit={handleTokenSubmit} className="input">
			<label>
				Token
			</label>
			<input type="text" onChange={(e) => setToken(e.target.value)}/>
			<button type="submit">Submit</button>
			{invalidError(isValidToken)}
		  </form>
        </div>
      ) : (
        <form onSubmit={handleEmailSubmit}>
			<div className="input">
				<label>
					Email
				</label>
				<input
				type="email"
				onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
        	<button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
export default ForgotPassword;