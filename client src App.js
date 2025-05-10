import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Profile from './pages/Profile';
import CreateGroup from './pages/CreateGroup';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { Container } from '@material-ui/core';

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/create-group" element={<PrivateRoute><CreateGroup /></PrivateRoute>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;