import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = event => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  // submit form (notice the async!)
  /*  
    With this updated function, we will now pass the data from the form state object as variables for 
    our addUser mutation function. Upon success, we destructure the data object from the response of our 
    mutation and simply log it to see if we're getting our token.



    We use the try...catch block functionality here, as it is especially useful with asynchronous code 
    such as Promises. This way, we can use async/await instead of .then() and .catch() method-chaining 
    while still being able to handle any errors that may occur
  
  */
  const handleFormSubmit = async event => {
    event.preventDefault();

    // use try/catch instead of promises to handle errors
    try{
        // execute addUser mutation and pass in variable data from form 
        const { data } = await addUser({
            variables: { ...formState }
        });
        Auth.login(data.addUser.token);
        console.log(data)
    } catch(e) {
        console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <div className="card">
          <h4 className="card-header">Sign Up</h4>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="username"
                id="username"
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button className="btn d-block w-100" type="submit">
                Submit
              </button>
            </form>
            {error && <div>Sign Up failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
