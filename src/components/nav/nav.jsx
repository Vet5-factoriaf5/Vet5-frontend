import './Nav.css';
import navImage from '../../assets/images/Logo-Happy-Paws.svg';
import userIcon from '../../assets/images/icons/user dark.svg';

export default function Nav({ onLoginClick }) {
    return (
        <nav className="nav">
            <img src={navImage} alt="Logo Happy Paws" className="nav-logo" />
            <button className="btn-login" onClick={onLoginClick}>
                <img src={userIcon} alt="User icon for login" className="login-icon" />
                <span>| Login</span>
            </button>
        </nav>
    );
}
