import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faFileExcel, faPenToSquare, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { Nav } from "react-bootstrap";
import * as XLSX from 'xlsx';
import '../../css/recipient.css';
import OpenedFormDestinataire from '../body/formDestinataire';

export default function Recipient() {
    const [activeTab, setActiveTab] = useState("destinataires");
    const [modalOpen, setModalOpen] = useState(false);

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const destinatairesData = [
        { nom: "Dupont", prenom: "Jean", status: "Actif", email: "jean.dupont@example.com", utilisateur: "Admin", telephone: "+123456789", dateCreer: "2024-12-09" }
    ];

    const referencesData = [
        { id: "123", codebarres: "ABC123", quantite: "5", assignéPrenom: "Jean", assignéNom: "Dupont", dateAttribution: "2024-12-09", assignéParPrenom: "Alice", assignéParNom: "Martin" }
    ];

    const handleExportToExcel = () => {
        let data;
        let headers;
        let titleRow;

        if (activeTab === "destinataires") {
            headers = ["Nom", "Prenom", "Status", "Email", "Utilisateur", "Telephone", "Creer le"];
            data = destinatairesData.map((item) => [
                item.nom,
                item.prenom,
                item.status,
                item.email,
                item.utilisateur,
                item.telephone,
                item.dateCreer,
            ]);
        } else if (activeTab === "references") {
            headers = ["Identifiant", "Code-barres", "Quantité", "Assigné à - Prénom", "Assigné à - Nom", "Date d'attribution", "Assigné par - Prénom", "Assigné par - Nom"];
            data = referencesData.map((item) => [
                item.id,
                item.codebarres,
                item.quantite,
                item.assignéPrenom,
                item.assignéNom,
                item.dateAttribution,
                item.assignéParPrenom,
                item.assignéParNom,
            ]);
        }

        titleRow = [headers];
        const ws = XLSX.utils.aoa_to_sheet([...titleRow, ...data]);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, activeTab === "destinataires" ? "Destinataires" : "Références");

        XLSX.writeFile(wb, `${activeTab === "destinataires" ? "Destinataires" : "Références"}.xlsx`);
    };

    return (
        <div className="recipient">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Gestion des attributions et restitutions
            </h4>
            <span className="recepient-title">
                <h6>
                    <FontAwesomeIcon icon={faCircleExclamation} className="icon-gap" />
                    Permet de créer, modifier et supprimer les destinataires qui pourront être sélectionnés lors d'une action d'entrée ou de sortie.
                </h6>
            </span>
            <div className="button-container">
                <button className="buttonExport" onClick={handleExportToExcel}>
                    <FontAwesomeIcon icon={faFileExcel} className="icon-gap" /> Exporter vers Excel
                </button>
                <button className="buttonCreation" onClick={handleOpenModal}>
                    <FontAwesomeIcon icon={faRightLong} className="icon-gap" /> Créer un destinataire
                </button>
            </div>

            <OpenedFormDestinataire
                isOpen={modalOpen}
                onClose={handleCloseModal}
            />

            <Nav variant="tabs" className="custom-nav">
                <Nav.Item>
                    <Nav.Link
                        onClick={() => handleTabSelect("destinataires")}
                        className={activeTab === "destinataires" ? "active" : ""}
                    >
                        Destinataires
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => handleTabSelect("references")}
                        className={activeTab === "references" ? "active" : ""}
                    >
                        Références attribuées
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="tab-content">
                {activeTab === "destinataires" && (
                    <div className="tab-pane active">
                        <div className="table-container">
                            <table className="destinataires-table">
                                <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prenom</th>
                                    <th>Status</th>
                                    <th>Email</th>
                                    <th>Utilisateur de Inventory</th>
                                    <th>Telephone</th>
                                    <th>Creer le</th>
                                </tr>
                                </thead>
                                <tbody>
                                {destinatairesData.map((dest, index) => (
                                    <tr key={index}>
                                        <td>{dest.nom}</td>
                                        <td>{dest.prenom}</td>
                                        <td>{dest.status}</td>
                                        <td>{dest.email}</td>
                                        <td>{dest.utilisateur}</td>
                                        <td>{dest.telephone}</td>
                                        <td>{dest.dateCreer}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "references" && (
                    <div className="tab-pane active">
                        <div className="table-container">
                            <table className="destinataires-table">
                                <thead>
                                <tr>
                                    <th>Identifiant</th>
                                    <th>Code-barres</th>
                                    <th>Quantité</th>
                                    <th>Assigné à - Prénom</th>
                                    <th>Assigné à - Nom</th>
                                    <th>Date d'attribution</th>
                                    <th>Assigné par - Prénom</th>
                                    <th>Assigné par - Nom</th>
                                </tr>
                                </thead>
                                <tbody>
                                {referencesData.map((ref, index) => (
                                    <tr key={index}>
                                        <td>{ref.id}</td>
                                        <td>{ref.codebarres}</td>
                                        <td>{ref.quantite}</td>
                                        <td>{ref.assignéPrenom}</td>
                                        <td>{ref.assignéNom}</td>
                                        <td>{ref.dateAttribution}</td>
                                        <td>{ref.assignéParPrenom}</td>
                                        <td>{ref.assignéParNom}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
