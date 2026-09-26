import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import type { NavLinkRenderProps } from 'react-router-dom'

import './App.css'
import RenderChat from "./components/RenderChat";
import Intent from "./components/Intent";

// Style function for active links
const navLinkStyles = ({ isActive }: NavLinkRenderProps) => ({
    color: isActive ? '#416ad9' : '#333',
    textDecoration: isActive ? 'none' : 'underline',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '5px 10px'
});

function App() {
  return (   
    <BrowserRouter>
      <nav style={{ margin: '20px' }}>
        <NavLink to="/chatbot" style={navLinkStyles}>Home</NavLink> | {" "}
        <NavLink to="/intents" style={navLinkStyles}>Intents</NavLink> | {" "}
        <NavLink to="/skills" style={navLinkStyles}>Skills</NavLink>
      </nav>

      <Routes>
        <Route path="/chatbot" element={<RenderChat></RenderChat>} />
        <Route path="/intents" element={<Intent></Intent>} />
        {/* <Route path="/skills" element={} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;