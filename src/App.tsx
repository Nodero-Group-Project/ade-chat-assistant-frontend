import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'

import './App.css'
import RenderChat from "./components/RenderChat";
import Dataset from "./components/Dataset";
import Home from "./components/Home";

function Nav() {
    const { pathname } = useLocation();

    const isLanding = pathname === '/';

    if (isLanding) return null;
    return (
      <nav style={{ backgroundColor: '#282f37', padding: '7px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <NavLink to="/"><img width="85px" src="/logo.png" /></NavLink>

        {!isLanding && (
          <NavLink to="/" style={{marginLeft: 'auto', color: 'white', textDecoration: 'underline'}}>Switch role</NavLink>
        )}
      </nav>
    );
}

function App() {
  return (   
    <BrowserRouter>
     <Toaster position='top-center' />
      <Nav />

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />
        {/* Regular user path */}
        <Route path="/chat" element={<RenderChat />} />
        {/* Admin path */}
        <Route path="/admin/datasets" element={<Dataset />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;