import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/catalog">Каталоги</Link></li>
                <li><Link to="/">Косметика</Link></li>
                <li><Link to="/skinType">Типы кожи</Link></li>
                <li><Link to="/action">Действия</Link></li>
                <li><Link to="/ingredient">Ингредиенты</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;