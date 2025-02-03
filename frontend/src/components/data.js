import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f4f4f4;
`;

const Table = styled.table`
  width: 80%;
  margin-top: 20px;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  background: #007bff;
  color: white;
`;

const Home = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      if (!localStorage.getItem('token')) {
        window.location.href = '/login';
      }
      setUsers([
        { name: 'John Doe', dob: '2000-01-01', email: 'john@example.com' },
        { name: 'Jane Smith', dob: '1995-05-10', email: 'jane@example.com' }
      ]);
    }, []);
  
    return (
      <Container>
        <h2>Protected Table</h2>
        <Table>
          <thead>
            <TableRow>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
            </TableRow>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.dob}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
};

export default Home;
  