import '../../css/activity.css';
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare, faHome } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import AddFolder from "../body/formFolder";

const itemsPerPage = 5;

export default function ProductsDisplay() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
    const navigate = useNavigate();

    const inventoryData = useMemo(() => [], []);

    const paginatedData = useMemo(() => {
        return inventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [inventoryData, currentPage]);

    const totalPages = useMemo(() => Math.ceil(inventoryData.length / itemsPerPage), [inventoryData]);

    const exportToExcel = () => {
        try {
            if (inventoryData.length === 0) {
                alert("Aucune donnée à exporter.");
                return;
            }
            const ws = XLSX.utils.json_to_sheet(inventoryData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Inventory");
            XLSX.writeFile(wb, "inventory.xlsx");
        } catch (error) {
            console.error("Erreur lors de l'exportation en Excel :", error);
            alert("Une erreur s'est produite lors de l'exportation des données.");
        }
    };

    return (
        <div className="activity">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Gestion de l'Inventaire
            </h4>
            <div className="buttons-container">
                <button className="home-btn" onClick={() => navigate('/home')}>
                    <FontAwesomeIcon icon={faHome} className="icon-gap" style={{ marginRight: "5px" }} />
                    Accueil
                </button>

                <button className="home-btn" onClick={() => setIsAddFolderOpen(true)}>
                    Ajouter un Produit
                </button>

                <button className="export-btn" onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faFileExcel} className="icon-gap" style={{ marginRight: "5px" }} />
                    Export to Excel
                </button>
            </div>

            <div className="table-container">
                {inventoryData.length === 0 ? (
                    <div className="no-data">
                        <p>Aucun article en inventaire pour le moment.</p>
                        <p>
                            Cliquez sur <strong>Ajouter un Produit</strong> pour commencer à ajouter des articles.
                        </p>
                    </div>
                ) : (
                    <table className="product-table">
                        <thead>
                        <tr>
                            <th>Identifiant Code-barres</th>
                            <th>Type</th>
                            <th>Quantite</th>
                            <th>Quantite disponible</th>
                            <th>Seuil d'alerte</th>
                            <th>Categorie</th>
                            <th>Mots-cles</th>
                            <th>Emplacement</th>
                            <th>Description</th>
                            <th>Créer le</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.identifiantCodeBarres}>
                                <td>{item.identifiantCodeBarres}</td>
                                <td>{item.type}</td>
                                <td>{item.quantite}</td>
                                <td>{item.quantiteDisponible}</td>
                                <td>{item.seuilAlerte}</td>
                                <td>{item.categorie}</td>
                                <td>{item.motsCles}</td>
                                <td>{item.emplacement}</td>
                                <td>{item.description}</td>
                                <td>{item.creeLE}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {inventoryData.length > 0 && (
                <div className="pagination-container">
                    <button
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Précédent
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Suivant
                    </button>
                </div>
            )}

            <AddFolder
                open={isAddFolderOpen}
                onClose={() => setIsAddFolderOpen(false)}
                btnType="Ajouter un élément"
            />
        </div>
    );
}
