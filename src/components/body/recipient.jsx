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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const destinatairesData = [
        { nom: "Dupont", prenom: "Jean", status: "Actif", email: "jean.dupont@example.com", utilisateur: "Admin", telephone: "+123456789", Crée: "2024-12-09" },
        { nom: "Doe", prenom: "Jane", status: "Actif", email: "jane.doe@example.com", utilisateur: "User", telephone: "+987654321", Crée: "2024-12-10" },
    ];

    const referencesData = [
        { id: "123", codebarres: "ABC123", quantite: "5", assignéPrenom: "Jean", assignéNom: "Dupont", dateAttribution: "2024-12-09", assignéParPrenom: "Alice", assignéParNom: "Martin" },
        // Add more data for testing
    ];

    const handleExportToExcel = () => {
        let data;
        let headers;

        if (activeTab === "destinataires") {
            headers = ["Nom", "Prenom", "Status", "Email", "Utilisateur", "Telephone", "Creer le"];
            data = destinatairesData.map((item) => [
                item.nom,
                item.prenom,
                item.status,
                item.email,
                item.utilisateur,
                item.telephone,
                item.Crée,
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

        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, activeTab === "destinataires" ? "Destinataires" : "Références");

        XLSX.writeFile(wb, `${activeTab === "destinataires" ? "Destinataires" : "Références"}.xlsx`);
    };

    const dataToDisplay = activeTab === "destinataires" ? destinatairesData : referencesData;


    const totalItems = dataToDisplay.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsOnCurrentPage = dataToDisplay.slice(startIndex, endIndex);

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

            <OpenedFormDestinataire isOpen={modalOpen} onClose={handleCloseModal} />

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
                {itemsOnCurrentPage.length === 0 ? (
                    <p>{activeTab === "destinataires" ? "Aucun destinataire disponible." : "Aucune référence attribuée."}</p>
                ) : (
                    <table className="destinataires-table">
                        <thead>
                        <tr>
                            {Object.keys(itemsOnCurrentPage[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {itemsOnCurrentPage.map((item, index) => (
                            <tr key={index}>
                                {Object.values(item).map((value, subIndex) => (
                                    <td key={subIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                <div className="pagination-container">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
