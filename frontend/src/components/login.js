

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

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
`;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #00796b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background: #004d40;
  }
`;

const SwitchText = styled.p`
  color: #00ffcc;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    text-decoration: underline;
  }
`;

const Login = ({ setToken }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Reset form when switching between login and sign-up
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
    });
    setErrors({});
  }, [isSignup]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Inputs
  const validateInputs = () => {
    let newErrors = {};

    if (isSignup) {
      if (!formData.name.trim()) newErrors.name = "Name is required.";
      if (!formData.dob) newErrors.dob = "Date of Birth is required.";
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);

    // Automatically remove errors after 5 seconds
    setTimeout(() => setErrors({}), 5000);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    let data;
    try {
      if (isSignup) {
        const response = await axios.post("http://localhost:9876/api/auth/signup", formData);
        data = response.data;
      } else {
        const response = await axios.post("http://localhost:9876/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        data = response.data;
      }

      if (data.token) {
        console.log(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Error during authentication:", error.response?.data?.message || error.message);
      setErrors({ server: error.response?.data?.message || "Authentication failed." });
      setTimeout(() => setErrors({}), 5000); // Remove server error after 5 seconds
    }
  };

  return (
    <Container>
      <LoginBox>
        <Card>
          <Header>{isSignup ? "Sign Up" : "Login"}</Header>
          <Avatar>
            <AvatarImage src="icon.jpg" alt="User Avatar" />
          </Avatar>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} error={!!errors.name} />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </>
            )}
            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} error={!!errors.email} />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} error={!!errors.password} />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

            {isSignup && (
              <>
                <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} />
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}

                <Input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} error={!!errors.dob} />
                {errors.dob && <ErrorMessage>{errors.dob}</ErrorMessage>}
              </>
            )}

            {errors.server && <ErrorMessage>{errors.server}</ErrorMessage>}

            <Button type="submit">{isSignup ? "Sign Up" : "Login"}</Button>
          </form>

          <SwitchText onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </SwitchText>
        </Card>
      </LoginBox>
    </Container>
  );
};

export default Login;
