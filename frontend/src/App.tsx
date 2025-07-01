import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import LoginForm from './pages/LoginForm';
import HomeForm from './pages/HomeForm';

import Cosmetic from './pages/CosmetiForm';
import ActionForm from './pages/ActionForm';
import CatalogForm from './pages/CatalogForm';
import SkinTypeForm from './pages/SkinTypeForm';
import BrandForm from "./pages/BrandForm";
import IngredientForm from "./pages/IngredientForm";

const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/" element={<HomeForm/>}/>

                {/* Защищённые маршруты под /admin */}
                <Route path="/admin" element={<PrivateRoute><Cosmetic/></PrivateRoute>}></Route>
                <Route path="/admin/catalog" element={<PrivateRoute><CatalogForm/></PrivateRoute>}></Route>
                <Route path="/admin/brand" element={<PrivateRoute><BrandForm/></PrivateRoute>}></Route>
                <Route path="/admin/action" element={<PrivateRoute><ActionForm/></PrivateRoute>}></Route>
                <Route path="/admin/skinType" element={<PrivateRoute><SkinTypeForm/></PrivateRoute>}></Route>
                <Route path="/admin/ingredient" element={<PrivateRoute><IngredientForm/></PrivateRoute>}></Route>
            </Routes>
        </Router>
    );
};

export default App;