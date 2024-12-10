import '../../css/activity.css';
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const itemsPerPage = 5;

export default function ProductsDisplay() {
    const [currentPage, setCurrentPage] = useState(1);

    const inventoryData = useMemo(() => [
        {
            identifiantCodeBarres: "BC001",
            type: "Électronique",
            quantite: 50,
            quantiteDisponible: 45,
            seuilAlerte: 20,
            categorie: "Accessoires",
            motsCles: "USB, Adaptateur",
            emplacement: "Entrepôt A",
            description: "Adaptateur USB multiport",
            creeLE: "2024-12-01"
        },
        {
            identifiantCodeBarres: "BC002",
            type: "Matériel Bureau",
            quantite: 100,
            quantiteDisponible: 80,
            seuilAlerte: 30,
            categorie: "Papeterie",
            motsCles: "Stylo, Écriture",
            emplacement: "Entrepôt B",
            description: "Stylos à bille bleus",
            creeLE: "2024-12-02"
        },
        {
            identifiantCodeBarres: "BC003",
            type: "Mobilier",
            quantite: 25,
            quantiteDisponible: 15,
            seuilAlerte: 10,
            categorie: "Meubles",
            motsCles: "Chaise, Bureau",
            emplacement: "Entrepôt C",
            description: "Chaise de bureau ergonomique",
            creeLE: "2024-12-03"
        },
        {
            identifiantCodeBarres: "BC004",
            type: "Informatique",
            quantite: 40,
            quantiteDisponible: 35,
            seuilAlerte: 15,
            categorie: "Ordinateurs",
            motsCles: "Écran, Moniteur",
            emplacement: "Entrepôt D",
            description: "Écran LED 24 pouces",
            creeLE: "2024-12-04"
        },
        {
            identifiantCodeBarres: "BC005",
            type: "Électroménager",
            quantite: 30,
            quantiteDisponible: 25,
            seuilAlerte: 10,
            categorie: "Cuisine",
            motsCles: "Cafetière, Machine",
            emplacement: "Entrepôt E",
            description: "Cafetière automatique",
            creeLE: "2024-12-05"
        },
        {
            identifiantCodeBarres: "BC006",
            type: "Fournitures",
            quantite: 200,
            quantiteDisponible: 150,
            seuilAlerte: 50,
            categorie: "Bureau",
            motsCles: "Papier, Impression",
            emplacement: "Entrepôt F",
            description: "Ramettes de papier A4",
            creeLE: "2024-12-06"
        }
    ], []);

    const paginatedData = useMemo(() => {
        return inventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [inventoryData, currentPage]);

    const totalPages = useMemo(() => Math.ceil(inventoryData.length / itemsPerPage), [inventoryData]);

    // Function to export data to Excel
    const exportToExcel = () => {
        try {
            if (inventoryData.length === 0) {
                alert("No data to export.");
                return;
            }
            const ws = XLSX.utils.json_to_sheet(inventoryData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Inventory");
            XLSX.writeFile(wb, "inventory.xlsx");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("There was an error exporting the data.");
        }
    };

    return (
        <div className="activity">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Gestion de l'Inventaire
            </h4>

            <button className="export-btn" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faFileExcel} className="icon-gap" style={{ marginRight: "5px" }} />
                Export to Excel
            </button>

            <div className="table-container">
                {inventoryData.length === 0 ? (
                    <p>Aucun article en inventaire.</p>
                ) : (
                    <table className="activity-table">
                        <thead>
                        <tr>
                            <th>Identifiant Code-barres</th>
                            <th>Type</th>
                            <th>Quantité</th>
                            <th>Quantité disponible</th>
                            <th>Seuil d'alerte</th>
                            <th>Catégorie</th>
                            <th>Mots-clés</th>
                            <th>Emplacement</th>
                            <th>Description</th>
                            <th>Créé le</th>
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
        </div>
    );
}