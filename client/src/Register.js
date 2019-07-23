import React, { useState } from "react";

function Register(props) {
  const [formData, setFormData] = useState({ email: "", password: "" , name:""});
  const { email, password, name } = formData;

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert("register");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleFormChange}
          placeholder="name"
        />
        <label htmlFor="">Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={handleFormChange}
          placeholder="email"
        />
        <label htmlFor="">password</label>
        <input
          type="text"
          name="password"
          value={password}
          onChange={handleFormChange}
          placeholder="password"
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Register;
