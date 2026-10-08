import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import type { NavLinkRenderProps } from 'react-router-dom'

import './App.css'
import RenderChat from "./components/RenderChat";
import Intent from "./components/Intent";
import Dataset from "./components/Dataset";

// Style function for active links
const navLinkStyles = ({ isActive }: NavLinkRenderProps) => ({
    color: isActive ? '#1dd2e3' : '#fff',
    textDecoration: isActive ? 'none' : 'underline',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '5px 10px'
});

function App() {
  return (   
    <BrowserRouter>
     <Toaster position='top-center' />
      <nav style={{ backgroundColor: '#282f37', padding: '10px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img width="150px" src="https://cdn.prod.website-files.com/663854450d5c9fbcd99cb187/68cb51772015b116e74cfb64_Nodero%20Logo.svg" />
        <NavLink to="/" style={navLinkStyles}>Home</NavLink> | {" "}
        <NavLink to="/intents" style={navLinkStyles}>Intents</NavLink> | {" "}
        <NavLink to="/datasets" style={navLinkStyles}>Datasets</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<RenderChat></RenderChat>} />
        <Route path="/intents" element={<Intent></Intent>} />
        <Route path="/datasets" element={<Dataset></Dataset>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;