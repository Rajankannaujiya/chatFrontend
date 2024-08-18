import React, { useState } from 'react';
import './LoginSignUp.css';
import Toaster from './Toaster';
// import { Route, redirect } from 'react-router-dom';
import Axios from 'axios';
import { Backdrop, CircularProgress } from "@mui/material";
// or
// import { Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from './config.js';



function Login() {
    const navigate = useNavigate();

    const [islogin, setIslogin] = useState("");
    const [loading,setLoading]=useState(false);

    const [user, setUser] = useState({
        username:"",
        email: "",
        password: ""
    })

    let name, value;
    function handleInputs(event) {
        name = event.target.name;
        value = event.target.value;
        setUser({ ...user, [name]: value })
    }

    var postLoginData = async (event) => {
        event.preventDefault();
        setLoading(true)
        try {
          
        
            // const {username, email, password } = user;
            const config={
                header:{
                    "Content-type": "application/json",
                }
            }
            await Axios.post(`${BACKEND_URL}/login`, user,config).then((response)=>{
                // console.log("Login:",response.data);
                setIslogin({msg:"success", key:Math.random()})
                setLoading(false);
                localStorage.setItem("userData", JSON.stringify(response.data)); // Use response.data instead of just response
                // console.log("response==", localStorage.getItem("userData")); // Retrieve the data from localStorage
                navigate("/app/welcome");
            })
            
        } catch (error) {
            setIslogin({msg:"Invalid username or password", key:Math.random()})
            setLoading(false);
            console.error("Error during login:", error);
        }
    };






    return (
        <>
    
        <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>
        <div className='login'>
            <div className='form-container'>
                <form  method="POST">

                <div className="form">
                        <label htmlFor="name">Your Name</label>
                        <input type="name" className="form-input" name="username" placeholder='Enter Your Name'
                            autoComplete='off'
                            value={user.username}
                            onChange={handleInputs} />
                    </div>
                    <div className="form">
                        <label htmlFor='email'>Email</label>
                        <input type="email" className="form-input" name="email" placeholder='Enter the Email'
                            autoComplete='off'
                            value={user.email}
                            onChange={handleInputs}
                        />
                    </div>
                    <div className="form">
                        <label htmlFor='password'>Password</label>
                        <input type="password" className="form-input" name="password" placeholder="Enter the password"
                            autoComplete='off'
                            value={user.password}
                            onChange={handleInputs}
                        />
                    </div>
                    <button type="submit" className="button" onClick={(event) => postLoginData(event)}>Login</button>
                </form>

            </div>
            <div>
                <div className='Question'>
                    Are you a new user ?
                </div>
                <button className="button"><a href='/'>SignUp</a></button>
            </div>
            {islogin ? (
              <Toaster key={islogin.key} message={islogin.msg} />
            ) : null}

        </div>
              
        </>
    )
}

export default Login;