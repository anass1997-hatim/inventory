import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
import Card from "react-bootstrap/Card";
import * as XLSX from "xlsx";
import "../../css/recipient.css";

export default function DataImport() {
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState([]);
    const [validData, setValidData] = useState([]);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [fileUploaded, setFileUploaded] = useState(false); // Track if a file has been uploaded

    const EXPECTED_COLUMNS = [
        "identifiant",
        "type",
        "code-barres",
        "quantite",
        "seuil d'alerte",
        "categorie",
        "description",
        "quantite disponible",
    ];

    // Function to generate and download the example file
    const generateExampleFile = () => {
        const exampleData = [
            EXPECTED_COLUMNS, // Header row
            ["001", "Produit", "123456789", "10", "5", "Catégorie A", "Description du produit", "100"],
            ["002", "Produit", "987654321", "20", "10", "Catégorie B", "Description d'un autre produit", "150"],
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(exampleData);
        XLSX.utils.book_append_sheet(wb, ws, "Exemple");

        // Trigger the download
        XLSX.writeFile(wb, "exemple-fichier.xlsx");
    };

    const validateFile = (file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            if (!worksheet) {
                setErrors(["Le fichier téléchargé est vide ou invalide."]);
                setProgress(100);
                setAnalysisComplete(true);
                return;
            }

            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (data.length === 0 || (data.length === 1 && data[0].every(cell => cell === undefined))) {
                setErrors(["Le fichier téléchargé est vide."]);
                setProgress(100);
                setAnalysisComplete(true);
                return;
            }

            let fileErrors = [];
            setProgress(20);

            const headers = data[0];
            if (!headers || headers.length !== EXPECTED_COLUMNS.length) {
                fileErrors.push("Nombre incorrect de colonnes dans le fichier.");
            }

            setProgress(40);

            let emptyRows = data.slice(1).filter(row => row.every(cell => cell === null || cell === undefined || cell === ""));
            if (emptyRows.length > 0) {
                fileErrors.push("Certaines lignes sont complètement vides.");
            }

            setProgress(60);

            let duplicateRows = data.slice(1).map((row, index) => JSON.stringify(row))
                .filter((rowString, index, self) => self.indexOf(rowString) !== index);
            if (duplicateRows.length > 0) {
                fileErrors.push("Il y a des lignes dupliquées dans le fichier.");
            }

            setProgress(80);

            let typeErrors = false;
            data.slice(1).forEach((row, index) => {
                const quantiteDispo = row[7];
                const seuil = row[4];

                if (quantiteDispo && isNaN(quantiteDispo)) typeErrors = true;
                if (seuil && isNaN(seuil)) typeErrors = true;
            });

            if (typeErrors) {
                fileErrors.push("Certains champs ne sont pas du bon type (par exemple, Quantité disponible doit être un nombre).");
            }

            setProgress(100);

            const maxErrors = 7;
            const truncatedErrors = fileErrors.slice(0, maxErrors);
            if (fileErrors.length > maxErrors) {
                truncatedErrors.push(`Et ${fileErrors.length - maxErrors} autres erreurs.`);
            }

            if (fileErrors.length > 0) {
                setErrors(truncatedErrors);
                setAnalysisComplete(true);
            } else {
                setValidData(data.slice(1));
                setAnalysisComplete(true);
                setFileUploaded(true); // Mark file as uploaded
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setErrors([]);
            setValidData([]);
            setProgress(10);
            setAnalysisComplete(false);
            validateFile(file);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = validData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="recipient">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap" /> Import de données
            </h4>
            <div className="tabs">
                <div className="tabs-body">
                    <div className="cards">
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="card-title">Création de données</Card.Title>
                                <Card.Text className="card-text">
                                    Importez vos références à partir d'un fichier Excel (.xlsx).
                                </Card.Text>
                                {!fileUploaded && ( // Conditionally render file upload button
                                    <input
                                        className="button"
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={handleFileUpload}
                                    />
                                )}
                                {progress > 0 && (
                                    <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="card-title">Mise à jour de produits.</Card.Title>
                                <Card.Text className="card-text">
                                    Mettez à jour vos produits à partir d'un fichier Excel (.xlsx).
                                </Card.Text>
                                {!fileUploaded && ( // Conditionally render file upload button
                                    <input
                                        className="button"
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={handleFileUpload}
                                    />
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="card-title">Mise à jour d'equipement.</Card.Title>
                                <Card.Text className="card-text">
                                    Mettez à jour vos équipement à partir d'un fichier Excel (.xlsx).
                                </Card.Text>
                                {!fileUploaded && ( // Conditionally render file upload button
                                    <input
                                        className="button"
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={handleFileUpload}
                                    />
                                )}
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="errors-section">
                        {analysisComplete && errors.length > 0 && (
                            <div className="errors">
                                <p>Erreurs trouvées :</p>
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {analysisComplete && errors.length === 0 && validData.length > 0 && (
                        <div className="valid-data-tab">
                            <h5 className="valid-data-title">Données validées</h5>
                            <table className="table">
                                <thead>
                                <tr>
                                    {EXPECTED_COLUMNS.map((col, index) => (
                                        <th key={index}>{col}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {currentItems.map((row, index) => (
                                    <tr key={index}>
                                        {row.map((cell, idx) => (
                                            <td key={idx}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="pagination-container">
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Précédent
                                    </button>
                                    <span>{`Page ${currentPage} sur ${Math.ceil(validData.length / itemsPerPage)}`}</span>
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(validData.length / itemsPerPage)}
                                    >
                                        Suivant
                                    </button>
                                </div>
                                <button className="validate-btn">Valider</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!fileUploaded && (
                <div className="example-file">
                    <button className="download-btn" onClick={generateExampleFile}>
                        Télécharger un fichier exemple
                    </button>
                </div>
            )}
        </div>
    );
}
