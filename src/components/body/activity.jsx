import '../../css/activity.css';
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const itemsPerPage = 5;

export default function Activity() {
    const [currentPage, setCurrentPage] = useState(1);

    const activityData = useMemo(() => [
        { idJournal: 1, action: "Login", dateAction: "2024-12-01", details: "User logged in", idUtilisateur: "U1" },
        { idJournal: 2, action: "Logout", dateAction: "2024-12-02", details: "User logged out", idUtilisateur: "U2" },
        { idJournal: 3, action: "Update", dateAction: "2024-12-03", details: "User updated details", idUtilisateur: "U3" },
        { idJournal: 4, action: "Delete", dateAction: "2024-12-04", details: "User deleted a record", idUtilisateur: "U4" },
        { idJournal: 5, action: "Create", dateAction: "2024-12-05", details: "User created a new record", idUtilisateur: "U5" },
        { idJournal: 6, action: "Login", dateAction: "2024-12-06", details: "User logged in", idUtilisateur: "U6" },
    ], []);

    const paginatedData = useMemo(() => {
        return activityData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [activityData, currentPage]);

    const totalPages = useMemo(() => Math.ceil(activityData.length / itemsPerPage), [activityData]);

    // Function to export data to Excel
    const exportToExcel = () => {
        try {
            if (activityData.length === 0) {
                alert("No data to export.");
                return;
            }
            const ws = XLSX.utils.json_to_sheet(activityData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Activity");
            XLSX.writeFile(wb, "activity.xlsx");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("There was an error exporting the data.");
        }
    };

    return (
        <div className="activity">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Journal d'activités
            </h4>

            <button className="export-btn" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faFileExcel} className="icon-gap" style={{ marginRight: "5px" }} />
                Export to Excel
            </button>

            <div className="table-container">
                {activityData.length === 0 ? (
                    <p>Aucune activités disponibles.</p>
                ) : (
                    <table className="activity-table">
                        <thead>
                        <tr>
                            <th>ID Journal</th>
                            <th>Action</th>
                            <th>DateAction</th>
                            <th>Détails</th>
                            <th>ID Utilisateur</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((activity) => (
                            <tr key={activity.idJournal}>
                                <td>{activity.idJournal}</td>
                                <td>{activity.action}</td>
                                <td>{activity.dateAction}</td>
                                <td>{activity.details}</td>
                                <td>{activity.idUtilisateur}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>


            {activityData.length > 0 && (
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
