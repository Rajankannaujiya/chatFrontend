import React, { useState } from 'react';
import './LoginSignUp.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from "@mui/material";
import Toaster from './Toaster';
import { BACKEND_URL } from './config.js';

function SignUp() {
    const navigate = useNavigate();

    const [loading,setLoading]=useState(false);
    const [signUpStatus,setSignUpStatus]=useState("");

    const [users, setUsers] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    let name, value;


    function handleInputs(event) {
        name = event.target.name;
        value = event.target.value
        setUsers({ ...users, [name]: value })

    }

    const postData = async (event) => {
        event.preventDefault();
        setLoading(true)
    
        const { username, email, password, confirmPassword } = users;
    
        try {
            await Axios.post(`${BACKEND_URL}/users/register`, {
                username,
                email,
                password,
                confirmPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response)=>{
                console.log("registered:",response.data);
                setSignUpStatus({msg:"success", key:Math.random()})
                setLoading(false);
                localStorage.setItem("userData", JSON.stringify(response.data)); // Use response.data instead of just response
                console.log("response==", localStorage.getItem("userData")); // Retrieve the data from localStorage
                navigate("/app/welcome");
            })
            
        } catch (error) {
            setSignUpStatus({msg:"user with the given username or email already exists", key:Math.random()})
            setLoading(false);
            console.log("Response data:", error.response ? error.response.data : undefined);
            console.log("Response status:", error.response ? error.response.status : undefined);
        }
    };
    

    return (

        <>

        <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>

        <div className='SignUp'>

            <div className='form-container'>
                <form action="/signUp" method="POST" >
                    <div className="form">
                        <label htmlFor="name">Your Name</label>
                        <input type="name" className="form-input" name="username" placeholder='Enter Your Name'
                            autoComplete='off'
                            value={users.username}
                            onChange={handleInputs} />
                    </div>
                    <div className="form">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-input" name="email" placeholder='Enter the Email'
                            autoComplete='off'
                            value={users.email}
                            onChange={handleInputs} />
                    </div>
                    <div className="form">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-input" name="password" placeholder="Enter the password"
                            autoComplete='off'
                            value={users.password}
                            onChange={handleInputs} />
                    </div>
                    <div className="form">
                        <label htmlFor="password">Conform Password</label>
                        <input type="password" className="form-input" name="confirmPassword" placeholder='Please Conform Your Password'
                            autoComplete='off'
                            value={users.confirmPassword}
                            onChange={handleInputs} />
                    </div>
                    <button type="submit" className="button" onClick={postData}>SignUp</button>
                </form>
            </div>
            <div>
                <div className='Question'>
                    Already an user?
                </div>
                <button className="button"><a href='/Login'>Login</a></button>
            </div>
            {signUpStatus ? (
              <Toaster key={signUpStatus.key} message={signUpStatus.msg} />
            ) : null}
        </div>
             
        </>
    )
}

export default SignUp;