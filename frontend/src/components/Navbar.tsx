// // src/components/Navbar.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
//
// const Navbar: React.FC = () => {
//     const isAuthenticated = !!localStorage.getItem('token'); // Проверяем наличие токена
//     return (
//         <nav>
//             <ul>
//                 {/* Отображаем только если пользователь авторизован */}
//                 {isAuthenticated && (
//                     <>
//                         <li>
//                             <Link to="/">Домашняя</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin">Косметика</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin/catalog">Каталоги</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin/skinType">Типы кожи</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin/action">Действия</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin/ingredient">Ингредиенты</Link>
//                         </li>
//                     </>
//                 )}
//             </ul>
//         </nav>
//     );
// };
//
//
// export default Navbar;



import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

const AppNavbar: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Beauty Guide</Navbar.Brand>

                <Nav className="me-auto">
                    {/*<Nav.Link as={Link} to="/">Главная</Nav.Link>*/}

                    {isAuthenticated && (
                        <>
                            <Nav.Link as={Link} to="/admin/catalog">Каталоги</Nav.Link>
                            <Nav.Link as={Link} to="/admin">Косметика</Nav.Link>
                            <Nav.Link as={Link} to="/admin/skinType">Типы кожи</Nav.Link>
                            <Nav.Link as={Link} to="/admin/action">Действия</Nav.Link>
                            <Nav.Link as={Link} to="/admin/ingredient">Ингредиенты</Nav.Link>
                        </>
                    )}
                </Nav>

                {isAuthenticated && (
                    <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                        Выйти
                    </button>
                )}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;