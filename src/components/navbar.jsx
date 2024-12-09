import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import '../css/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBell, faUser, faBarcode } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function DisplayIndex() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar">
            <Container fluid className="navbar-container">
                <Navbar.Brand className="navbar-brand">Logo</Navbar.Brand>

                <Form className="d-flex search-wrapper">
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </div>
                    <Form.Control
                        type="search"
                        placeholder="Rechercher des dossiers ou des références..."
                        className="search"
                        aria-label="Search"
                    />
                </Form>

                <div className="navbar-buttons">
                    {[
                        { icon: faBarcode, hasDot: true },
                        { icon: faBell, hasDot: false },
                        { icon: faUser, hasDot: false }
                    ].map((button, index) => (
                        <button key={index} className="navbar-button">
                            <div className={`icon-wrapper ${button.hasDot ? 'icon-with-dot' : ''}`}>
                                <FontAwesomeIcon icon={button.icon} />
                                {button.hasDot && <span className="dot"></span>}
                            </div>
                        </button>
                    ))}
                </div>
            </Container>
        </Navbar>
    );
}
