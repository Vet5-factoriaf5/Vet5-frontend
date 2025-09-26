import './footer.css';
import footerImage from '../assets/images/Logo-Happy-Paws2.svg'; 

export default function Footer() {
    return (<footer className="footer" > <img src= {
            footerImage
        }

        alt="Footer" /> </footer>);
}