import '../../css/reservations.css';
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const itemsPerPage = 5;

export default function Reservations() {
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsData = useMemo(() => [
        { idReservation: 1, idDossier: "D1", dateDebut: "2024-12-01", dateFin: "2024-12-10", quantiteReservee: 10, idUtilisateur: "U1" },
        { idReservation: 2, idDossier: "D2", dateDebut: "2024-12-02", dateFin: "2024-12-12", quantiteReservee: 5, idUtilisateur: "U2" },
        { idReservation: 3, idDossier: "D3", dateDebut: "2024-12-03", dateFin: "2024-12-13", quantiteReservee: 15, idUtilisateur: "U3" },
        { idReservation: 4, idDossier: "D4", dateDebut: "2024-12-04", dateFin: "2024-12-14", quantiteReservee: 7, idUtilisateur: "U4" },
        { idReservation: 5, idDossier: "D5", dateDebut: "2024-12-05", dateFin: "2024-12-15", quantiteReservee: 20, idUtilisateur: "U5" },
        { idReservation: 6, idDossier: "D6", dateDebut: "2024-12-06", dateFin: "2024-12-16", quantiteReservee: 12, idUtilisateur: "U6" },

    ], []);

    const paginatedData = useMemo(() => {
        return reservationsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [reservationsData, currentPage]);

    const totalPages = useMemo(() => Math.ceil(reservationsData.length / itemsPerPage), [reservationsData]);

    const exportToExcel = () => {
        try {
            if (reservationsData.length === 0) {
                alert("Aucune donnée à exporter.");
                return;
            }
            const ws = XLSX.utils.json_to_sheet(reservationsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Réservations");
            XLSX.writeFile(wb, "reservations.xlsx");
        } catch (error) {
            console.error("Erreur lors de l'exportation vers Excel :", error);
            alert("Une erreur est survenue lors de l'exportation des données.");
        }
    };

    return (
        <div className="reservations">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Réservations
            </h4>

            <button className="export-btn" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faFileExcel} className="icon-gap" style={{ marginRight: "5px" }} />
                Exporter vers Excel
            </button>

            <div className="table-container">
                {reservationsData.length === 0 ? (
                    <p>Aucune réservation disponible.</p>
                ) : (
                    <table className="reservations-table">
                        <thead>
                        <tr>
                            <th>ID Réservation</th>
                            <th>ID Dossier</th>
                            <th>Date Début</th>
                            <th>Date Fin</th>
                            <th>Quantité Réservée</th>
                            <th>ID Utilisateur</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((reservation) => (
                            <tr key={reservation.idReservation}>
                                <td>{reservation.idReservation}</td>
                                <td>{reservation.idDossier}</td>
                                <td>{reservation.dateDebut}</td>
                                <td>{reservation.dateFin}</td>
                                <td>{reservation.quantiteReservee}</td>
                                <td>{reservation.idUtilisateur}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {reservationsData.length > 0 && (
                <div className="pagination-container">
                    <button
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Précédent
                    </button>
                    <span>
                        Page {currentPage} sur {totalPages}
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
