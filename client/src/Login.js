import React, { useState } from "react";

function Login(props) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert("yay");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={handleFormChange}
          placeholder='email'
        />
        <label htmlFor="">password</label>
        <input
          type="text"
          name="password"
          value={password}
          onChange={handleFormChange}
          placeholder='password'
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Login;
