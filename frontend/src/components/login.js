

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #00aaff, #00ffcc);
`;

const Card = styled.div`
  background: #1e1e2f;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2), -5px -5px 15px rgba(255, 255, 255, 0.1);
//   width: 350px;
  text-align: center;
  color: white;
`;
const LoginBox = styled.div`
  background: #1c2b3a;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
  text-align: center;
  width: 350px;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #00e5ff;
  padding: 10px 30px;
  border-radius: 5px;
  font-weight: bold;
  color: #003b4d;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 40px auto 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: center/cover no-repeat;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;



const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  background: #2e2e3f;
  color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #00ffcc;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const SwitchText = styled.p`
  cursor: pointer;
  color: #00ffcc;
  margin-top: 10px;
`;

const Login = ({ setToken }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  useEffect(()=>{
    setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
    })
  },[isSignup])

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     if (isSignup) {
//        {data} = await axios.post('http://localhost:9876/api/auth/sign', formData);
//     } else {
//        { data } = await axios.post('http://localhost:9876/api/auth/login', { 
//         email: formData.email, 
//         password: formData.password 
//       });
//     }
//     if (data.token){
//         console.log(data.token)
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         navigate("/");
//     //   localStorage.setItem('token', data.token);
//     //   localStorage.setItem('user', JSON.stringify(data.user));
//     //   setToken(data.token);
//     }
//   };


const handleSubmit = async (e) => {
    e.preventDefault();
  
    let data;
    if (isSignup) {
      const response = await axios.post('http://localhost:9876/api/auth/signup', formData);
      data = response.data;
    } else {
      const response = await axios.post('http://localhost:9876/api/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      data = response.data;
    }
  
    if (data.token) {
      console.log(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate("/"); // Assuming `navigate` is available for redirection
    }
};
  

  return (
    <Container>
        <LoginBox>
      <Card>
        <Header>{isSignup ? 'Sign Up' : 'Login'}</Header>
        <Avatar>
            <AvatarImage src="icon.jpg" alt="User Avatar" />
        </Avatar>
        <form onSubmit={handleSubmit}>
            {isSignup ? (
                <>
                <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                <Input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
                </>
            ) : (
                <>
                <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                </>
            )}

            <Button type="submit">{isSignup ? 'Sign Up' : 'Login'}</Button>
        </form>

        <SwitchText onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </SwitchText>
      </Card>
      </LoginBox>
    </Container>
  );
};

export default Login;
