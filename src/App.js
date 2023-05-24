import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Register from './Register';
import ChatsGateway from './ChatsGateway';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/chats" element={<ChatsGateway />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}


export default App;
