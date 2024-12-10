import "../../css/transaction.css";
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Nav } from "react-bootstrap";
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2";
import * as XLSX from "xlsx";

const itemsPerPage = 5;

export default function Transaction() {
    const [activeTab, setActiveTab] = useState("tousLesTransactions");
    const [currentPage, setCurrentPage] = useState(1);


    const transactionsData = useMemo(() => [
        { idTransaction: 1, typeTransaction: "Entrée", dateTransaction: "2024-12-01", idUtilisateur: "U1", idDossier: "D1", quantite: 10 },
        { idTransaction: 2, typeTransaction: "Sortie", dateTransaction: "2024-12-02", idUtilisateur: "U2", idDossier: "D2", quantite: 5 },
        { idTransaction: 3, typeTransaction: "Entrée", dateTransaction: "2024-12-03", idUtilisateur: "U3", idDossier: "D3", quantite: 15 },
        { idTransaction: 4, typeTransaction: "Sortie", dateTransaction: "2024-12-04", idUtilisateur: "U4", idDossier: "D4", quantite: 7 },
        { idTransaction: 5, typeTransaction: "Entrée", dateTransaction: "2024-12-05", idUtilisateur: "U5", idDossier: "D5", quantite: 20 },
        { idTransaction: 6, typeTransaction: "Sortie", dateTransaction: "2024-12-06", idUtilisateur: "U6", idDossier: "D6", quantite: 12 },

    ], []);

    const filteredData = useMemo(() => {
        if (!transactionsData || transactionsData.length === 0) {
            return [];
        }
        return transactionsData.filter((transaction) =>
            activeTab === "tousLesTransactions"
                ? true
                : transaction.typeTransaction === (activeTab === "entrees" ? "Entrée" : "Sortie")
        );
    }, [activeTab, transactionsData]);

    const paginatedData = useMemo(() => {
        return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData]);

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const exportToExcel = () => {
        try {
            const ws = XLSX.utils.json_to_sheet(filteredData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Transactions");
            XLSX.writeFile(wb, "transactions.xlsx");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("There was an error exporting the data.");
        }
    };

    return (
        <div className="transaction">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Transaction
            </h4>
            <button className="export-btn" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faFileExcel} className="icon-gap" style={{ marginRight: "5px" }} />
                Export to Excel
            </button>

            <Nav variant="tabs" className="custom-nav">
                <Nav.Item>
                    <Nav.Link
                        onClick={() => handleTabSelect("tousLesTransactions")}
                        className={activeTab === "tousLesTransactions" ? "active" : ""}
                    >
                        Tous les Transactions
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => handleTabSelect("entrees")}
                        className={activeTab === "entrees" ? "active" : ""}
                    >
                        <HiArrowTrendingUp style={{ marginRight: "5px" }} />
                        Entrées
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => handleTabSelect("sorties")}
                        className={activeTab === "sorties" ? "active" : ""}
                    >
                        <HiArrowTrendingDown style={{ marginRight: "5px" }} />
                        Sorties
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="tab-content">
                <div className="tab-pane active">
                    {filteredData.length === 0 ? (
                        <div>Vous n'avez pas encore effectué de Transactions.</div>
                    ) : (
                        <div className="table-container">
                            <table className="transactions-table">
                                <thead>
                                <tr>
                                    <th>IdTransaction</th>
                                    <th>Type Transaction</th>
                                    <th>Date Transaction</th>
                                    <th>Id Utilisateur</th>
                                    <th>Id Dossier</th>
                                    <th>Quantité</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedData.map((transaction) => (
                                    <tr key={transaction.idTransaction}>
                                        <td>{transaction.idTransaction}</td>
                                        <td>{transaction.typeTransaction}</td>
                                        <td>{transaction.dateTransaction}</td>
                                        <td>{transaction.idUtilisateur}</td>
                                        <td>{transaction.idDossier}</td>
                                        <td>{transaction.quantite}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="pagination-container">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
