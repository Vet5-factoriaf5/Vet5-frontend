import './Nav.css';
import navImage from '../assets/images/Logo-Happy-Paws.svg';
import userIcon from "../assets/images/icons/user dark.svg";

export default function Nav({ onLoginClick }) {
    return (
        <nav className="nav">
            <img src={navImage} alt="Nav" />
            <button className="btn-login" onClick={onLoginClick}>
                <img src={userIcon} alt="user icon" className="login-icon" />
                <span>| Login</span>
            </button>
        </nav>
    );
} 

