import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

export default function Login() {
  const [user, setUser] = useState({
    rollnumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const notify = () => {
    toast.error("invalid credentials");
  }

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await fetch("https://digital-mess.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
      });
      console.log("response data : ", response);
      if (response.ok) {
        const responseData = await response.json();
        alert("Login successful");
        setUser({ rollnumber: "", password: "" });
        localStorage.setItem('token', responseData.token);
        console.log(responseData);
        if (responseData.role === "instructor") {
          window.location.href = "/main/genQR";
        } else {
          window.location.href = "/";
        }
      } else {
        const errorData = await response.json();
        console.log("Error response", errorData);
        notify();
      }
    } catch (error) {
      console.error("Error login fetch", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  let myStyle = {
    width: 350,
  };
  let myStyle2 = {
    marginLeft: 65,
    fontFamily: 'Inconsolata',
  };

  return (
    <>
      <div className='container mt-1 shadow p-3' style={{ width: 500, height: 600, backgroundColor: 'white', borderRadius: 10 }}>
        <p className="bgimg mb-5" style={{ marginLeft: 185, fontSize: 35, fontFamily: 'Hubballi' }}>Login</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3" style={myStyle2}>
            <label htmlFor="exampleInputEmail1" className="form-label">Roll Number</label>
            <input
              required
              type="string"
              className="form-control"
              style={myStyle}
              name='rollnumber'
              value={user.rollnumber}
              onChange={handleInput}
              id="exampleInputEmail1" />
          </div>
          <div className="mb-3" style={myStyle2}>
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input
              required
              type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
              className="form-control"
              style={myStyle}
              name='password'
              value={user.password}
              onChange={handleInput}
              id="exampleInputPassword1" />
          </div>
          <div className="mb-3 form-check" style={myStyle2}>
            <input
              type="checkbox"
              className="form-check-input"
              id="showPasswordCheck"
              onChange={toggleShowPassword} // Toggle show password
            />
            <label className="form-check-label" htmlFor="showPasswordCheck" style={{ color: 'grey' }}>
              Show Password
            </label>
          </div>
          <div className="mb-3 form-check" style={myStyle2}>
            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" htmlFor="exampleCheck1" style={{ color: 'grey' }}>Remember me</label>
          </div>
          <button type="submit" className="btn btn-outline-success mt-5" style={{ marginLeft: 65, fontFamily: 'Inconsolata', borderRadius: 50, width: 350 }}>Login</button>
          <ToastContainer />
          <div id="emailHelp" className="form-text mt-3" style={{ color: 'grey', marginLeft: 135 }}>Don't have an account? <Link to="Signup" style={{ textDecoration: 'none', color: 'blue' }}>SignUp</Link></div>
        </form>
      </div>
    </>
  );
}
