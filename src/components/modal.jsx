import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../css/modal.css';
import DisplayCards from "./cards";
import DisplayIndex from "./navbar";
import SideMenu from "../components/sidebar";
import SecondSideMenu from "../components/secSidebar";

export default function DisplayModal() {
    const [showModal, setShowModal] = useState(() => {
        const modalStatus = localStorage.getItem("modalAccepted");
        return modalStatus !== "true";
    });

    const [activeItem, setActiveItem] = useState("Acceuil");
    const [showSecondSidebar, setShowSecondSidebar] = useState(true);

    const handleClose = useCallback(() => setShowModal(false), []);

    const handleAccept = useCallback(() => {
        setShowModal(false);
        localStorage.setItem("modalAccepted", "true");
    }, []);

    useEffect(() => {
        const modalStatus = localStorage.getItem("modalAccepted");
        if (modalStatus === "true") {
            setShowModal(false);
        }
    }, []);

    useEffect(() => {
        setShowSecondSidebar(!(activeItem === "Rapports" || activeItem === "Mise à jour"
            || activeItem === "Faq" || activeItem === "Deconnexion"
        ));
    }, [activeItem]);

    return (
        <div className="main-container">
            <DisplayIndex />
            <div className="app-container">
                <SideMenu
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    className="first-sidebar"
                />
                {showSecondSidebar && (
                    <SecondSideMenu
                        activeItem={activeItem}
                        className="second-sidebar"
                    />
                )}
            </div>
            <Modal
                show={showModal}
                onHide={handleClose}
                aria-labelledby="modal-title"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-title">
                        Vos Premiers Pas sur l'application
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-body">
                    <DisplayCards />
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="button1"
                        aria-label="En savoir plus"
                        variant="secondary"
                    >
                        En savoir plus
                    </Button>
                    <Button
                        className="button2"
                        aria-label="J'ai compris"
                        variant="primary"
                        onClick={handleAccept}
                    >
                        J'ai compris
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
