import React from 'react';
import "./footer.scss";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 Estate Company. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/about" className="footer-link">About Us</a>
                    <a href="/contact" className="footer-link">Contact</a>
                    <a href="/privacy" className="footer-link">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

