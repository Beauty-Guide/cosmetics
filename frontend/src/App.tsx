
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cosmetic from './pages/Cosmetic';
import Action from './pages/Action';
import CatalogForm from './pages/CatalogForm';
import SkinType from './pages/SkinType';

// function App() {
//   return (
//       <div className="App">
//         <h1>React + Spring Boot Админка</h1>
//         <AdminPanel />
//       </div>
//   );
// }


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Cosmetic />} />
                <Route path="/catalog" element={<CatalogForm />} />
                <Route path="/action" element={<Action />} />
                <Route path="/skinType" element={<SkinType />} />
            </Routes>
        </Router>
    );
};

export default App;