import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Cosmetic from './pages/Cosmetic';
import Action from './pages/Action';
import CatalogForm from './pages/CatalogForm';
import SkinType from './pages/SkinType';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Home/>}/>

                {/* Защищённые маршруты под /admin */}
                <Route path="/admin" element={<PrivateRoute><Cosmetic/></PrivateRoute>}></Route>
                <Route path="/admin/catalog" element={<PrivateRoute><CatalogForm/></PrivateRoute>}></Route>
                <Route path="/admin/action" element={<PrivateRoute><Action/></PrivateRoute>}></Route>
                <Route path="/admin/skinType" element={<PrivateRoute><SkinType/></PrivateRoute>}></Route>

            </Routes>
        </Router>
    );
};

export default App;