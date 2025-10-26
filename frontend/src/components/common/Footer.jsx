import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>About Us</h4>
                    <p>Your trusted platform for event ticketing solutions.</p>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: support@eventticketing.com</p>
                    <p>Phone: +1 234 567 8900</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/events">Browse Events</a></li>
                        <li><a href="/register">Become an Organizer</a></li>
                        <li><a href="/help">Help Center</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Event Ticketing System. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
