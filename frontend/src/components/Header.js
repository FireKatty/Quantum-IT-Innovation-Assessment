import React from "react";
import styled from "styled-components";

// Styled Components
const AppBarStyled = styled.div`
  position: fixed;
  z-index: 1201;
  background-color: #2c3e50;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, .1);
  background: rgba(0, 0, 0, .1);
  width: 95%;
`;

const ToolbarStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

const BoxStyled = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarStyled = styled.img`
  width: 100px;
  height: 40px;
  margin-right: 8px;
  object-fit: cover; /* Ensures the image covers the area without distortion */
  border-radius: 40%; /* Gives a rounded appearance */
  // border: 2px solid #fff; /* Adds a border around the image to make it stand out */
`;

const TypographyStyled = styled.div`
  font-weight: ${(props) => (props.variant === "h6" ? "bold" : "normal")};
  color: ${(props) => (props.variant === "h6" ? "#1a1a1a" : "black")};
  font-size: ${(props) => (props.variant === "h6" ? "1.25rem" : "1rem")};
  margin-right: ${(props) => (props.variant === "body1" ? "16px" : "0")};  /* Add margin-right for the 'Welcome' message */
`;

const ButtonStyled = styled.button`
// margin-right:50px;
  border: 1px solid #2c3e50;
  color: #2c3e50;
  padding: 8px 16px;
  background: transparent;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #1a1a1a;
    color: #ecf0f1;
  }
`;

const Header = () => {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;
  const userName = user?.name || "User";


  const handleLogout = async () => {
    try {
      localStorage.clear();
      window.location.href = "/"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <AppBarStyled>
        <ToolbarStyled>
          {/* Left Side: Logo and Company Name */}
          <BoxStyled>
            <AvatarStyled src="logo-white.png" alt="Company Logo" />
            <TypographyStyled variant="h6"></TypographyStyled>
          </BoxStyled>

          {/* Right Side: Welcome message and Logout button */}
          <BoxStyled>
            <TypographyStyled variant="body1">Welcome, {userName}!</TypographyStyled>
            <ButtonStyled onClick={handleLogout}>Logout</ButtonStyled>
          </BoxStyled>
        </ToolbarStyled>
      </AppBarStyled>

      {/* Spacer to prevent content overlap */}
      <ToolbarStyled style={{ height: "64px" }} />
    </>
  );
};

export default Header;
