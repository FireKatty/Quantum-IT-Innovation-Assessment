
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaEdit, FaTrash } from "react-icons/fa";
import Header from "./Header";


const Container = styled.div`
  padding: 3rem;
  background-image: url('19.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: calc(100vh - 49px);
  opacity: 0.9;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  color: #00fff;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #00796b;
  color: white;
  font-size: 16px;
  &:hover {
    background-color: #004d40;
  }
`;

const StatusButton = styled.button`
  border: 2px solid ${(props) => (props.status === "Active" ? "green" : "red")};
  color: ${(props) => (props.status === "Active" ? "green" : "red")};
  background: transparent;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.status === "Active" ? "green" : "red")};
    color: white;
  }
`;


const DrawerContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background-color: rgba(0.5, 0.5, 0.5, 0.5);
  padding: 20px;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.5);
  display: ${({ open }) => (open ? "block" : "none")};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  ${({ error }) => error && `border-color: red;`}
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  ${({ error }) => error && `border-color: red;`}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.3);
`;

const TableHeader = styled.thead`
  background-color: rgba(0, 0, 0, 0.5);
  color: #ecf0f1;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableCell = styled.td`
  padding: 10px;
  color: #000;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ color }) => color || "#00796b"};
`;

// Styled component for error messages
const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;



const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [viewUsers, setViewUsers] = useState(false);
  const [openUserDrawer, setOpenUserDrawer] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phoneNumber: "", salary: "", role: "", status: "Active" });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const drawerRef = useRef(null);

  const rolePermissions = {
    Admin: ["Read", "Write", "Delete"],
    Manager: ["Read", "Write"],
    Employee: ["Read"],
  };

  const getPermissionsForRole = (role) => {
    return rolePermissions[role] || ["Read"];
  };

  const validateUser = (user) => {
    const errors = {};
    if (!user.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.email = "Invalid email address.";
    }
    if (!/^\d{10}$/.test(user.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!/^\d+$/.test(user.salary)) {
      errors.salary = "Salary must be a numeric value.";
    }
    if (!user.role) {
      errors.role = "Role is required.";
    }
    return errors;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpenUserDrawer(false);
        resetNewUser();  // Clear input fields when the drawer is closed
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const resetNewUser = () => {
    setNewUser({
      name: "",
      email: "",
      phoneNumber: "",
      salary: "",
      role: "",
      status: "Active",
    });
    setErrors({});
    setEditMode(false);
    setEditingUser(null);
  };


  const handleDrawerClose = () => {
    setOpenUserDrawer(false);
    resetNewUser();  // Clear input fields when the drawer is closed
  };


  const handleAddUser = async (event) => {
    event.preventDefault();
    
    // Validate user input
    const validationErrors = validateUser(newUser);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTimeout(() => setErrors({}), 5000);
        return;
    }

    setErrors({});
    const permissions = getPermissionsForRole(newUser.role);

    try {
        const response = await fetch("http://localhost:9876/api/data/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem('token')
            },
            body: JSON.stringify({ newUser, permissions }),
        });

        const data = await response.json(); // Parse response JSON

        if (!response.ok) {
            throw new Error(data.error || "Failed to create user"); // Extract backend error message
        }

        // Fetch updated users list
        fetchUsersFromDatabase();
        resetNewUser();

    } catch (error) {
        console.error("Error adding user:", error);

        // Display specific error messages from the backend
        if (error.message.includes("Email already exists")) {
            setErrors((prevErrors) => ({ ...prevErrors, email: error.message }));
        } else if (error.message.includes("Invalid email format")) {
            setErrors((prevErrors) => ({ ...prevErrors, email: error.message }));
        } else if (error.message.includes("Invalid mobile number")) {
            setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: error.message }));
        } else {
            setErrors({ server: error.message }); // Show generic error message
        }

        // Clear errors after 5 seconds
        setTimeout(() => setErrors({}), 5000);
    }
};


  const fetchUsersFromDatabase = async () => {
    console.log("Fetch Data")
    try {
      const response = await fetch("http://localhost:9876/api/data/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
      });
      if (response.ok) {
        const data = await response.json();

        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = async (id, role) => {
    const permissions = getPermissionsForRole(role);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, role, permissions } : user
      )
    );
    try {
      const response = await fetch(`http://localhost:9876/api/data/editrole/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({ role, permissions }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? updatedUser : user))
        );
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const toggleViewUsers = () => {
    if (!viewUsers) {
      console.log("toggle run");
      fetchUsersFromDatabase();
    }
    setViewUsers(!viewUsers);
  };

  const handleEditUser = async (event) => {
    event.preventDefault();
    // console.log("Edit user")
    const validationErrors = validateUser(editingUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log(editingUser)
    setErrors({});
    const permissions = getPermissionsForRole(editingUser.role) || [];
    try {
      const response = await fetch(`http://localhost:9876/api/data/update/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({ editingUser, permissions }),
      });
      if (response.ok) {
        await fetchUsersFromDatabase();
      } else {
        console.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
    setEditMode(false);
    setEditingUser(null);
    setOpenUserDrawer(false);
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:9876/api/data/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
      });
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        console.error(`Failed to delete user with ID ${id}.`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  const toggleUserStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:9876/api/data/toggleStatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? updatedUser : user))
        );
      } else {
        console.error("Failed to toggle user status.");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  return (
    <Container>
      <Header />
      <Title>Admin Dashboard</Title>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Button onClick={() => setOpenUserDrawer(true)}>Add User</Button>
        <Button onClick={() => { toggleViewUsers(); setViewUsers(!viewUsers); }}>{viewUsers ? "Hide User Info" : "View User Info"}</Button>
      </div>

      <DrawerContainer open={openUserDrawer} ref={drawerRef}>
        <IconButton onClick={handleDrawerClose}>
          <FaChevronLeft />
        </IconButton>
        <h3>{editMode ? "Edit User" : "Add New User"}</h3>
        <Input
          placeholder="Name"
          value={editMode ? editingUser?.name : newUser.name}
          onChange={(e) =>
            editMode
              ? setEditingUser({ ...editingUser, name: e.target.value })
              : setNewUser({ ...newUser, name: e.target.value })
          }
          error={!!errors.name}
        />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        <Input
          placeholder="Email"
          value={editMode ? editingUser?.email : newUser.email}
          onChange={(e) =>
            editMode
              ? setEditingUser({ ...editingUser, email: e.target.value })
              : setNewUser({ ...newUser, email: e.target.value })
          }
          error={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        <Input
          placeholder="Phone Number"
          value={editMode ? editingUser?.phoneNumber : newUser.phoneNumber}
          onChange={(e) =>
            editMode
              ? setEditingUser({ ...editingUser, phoneNumber: e.target.value })
              : setNewUser({ ...newUser, phoneNumber: e.target.value })
          }
          error={!!errors.phoneNumber}
        />
        {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
        <Input
          placeholder="Salary"
          value={editMode ? editingUser?.salary : newUser.salary}
          onChange={(e) =>
            editMode
              ? setEditingUser({ ...editingUser, salary: e.target.value })
              : setNewUser({ ...newUser, salary: e.target.value })
          }
          error={!!errors.salary}
        />
        {errors.salary && <ErrorMessage>{errors.salary}</ErrorMessage>}
        <Select
          value={editMode ? editingUser?.role : newUser.role}
          onChange={(e) =>
            editMode
              ? setEditingUser({ ...editingUser, role: e.target.value })
              : setNewUser({ ...newUser, role: e.target.value })
          }
          error={!!errors.role}
        >
          <option value="" disabled>Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </Select>
        {errors.role && <ErrorMessage>{errors.role}</ErrorMessage>}
        <Button onClick={editMode ? handleEditUser : handleAddUser}>
          {editMode ? "Update User" : "Add User"}
        </Button>
      </DrawerContainer>

      {viewUsers && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.salary}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </Select>
                </TableCell>
                <TableCell>
                <StatusButton status={user.status} onClick={() => toggleUserStatus(user.id)}>
                    {user.status}
                </StatusButton>

                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setEditMode(true);
                    setEditingUser(user);
                    setOpenUserDrawer(true);
                  }}>
                    <FaEdit />
                  </IconButton>
                  <IconButton color="#d32f2f" onClick={() => handleDeleteUser(user.id)}>
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminDashboard;
