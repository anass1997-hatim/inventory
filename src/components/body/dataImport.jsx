import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
import Card from "react-bootstrap/Card";
import * as XLSX from "xlsx";
import "../../css/recipient.css";

export default function DataImport() {
    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);
    const [errors, setErrors] = useState([]);
    const [validData, setValidData] = useState([]);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [fileUploaded1, setFileUploaded1] = useState(false);
    const [fileUploaded2, setFileUploaded2] = useState(false);
    const [fileUploaded3, setFileUploaded3] = useState(false);

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

    const generateExampleFile = () => {
        const exampleData = [
            EXPECTED_COLUMNS,
            ["001", "Produit", "123456789", "10", "5", "Catégorie A", "Description du produit", "100"],
            ["002", "Produit", "987654321", "20", "10", "Catégorie B", "Description d'un autre produit", "150"],
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(exampleData);
        XLSX.utils.book_append_sheet(wb, ws, "Exemple");

        XLSX.writeFile(wb, "exemple-fichier.xlsx");
    };

    const validateFile = (file, cardId) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            if (!worksheet) {
                setErrors(["Le fichier téléchargé est vide ou invalide."]);
                setProgress100(cardId);
                return;
            }

            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (data.length === 0 || (data.length === 1 && data[0].every(cell => cell === undefined))) {
                setErrors(["Le fichier téléchargé est vide."]);
                setProgress100(cardId);
                return;
            }

            let fileErrors = [];
            setProgress(20, cardId);

            const headers = data[0];
            if (!headers || headers.length !== EXPECTED_COLUMNS.length) {
                fileErrors.push("Nombre incorrect de colonnes dans le fichier.");
            }

            setProgress(40, cardId);

            let emptyRows = data.slice(1).filter(row => row.every(cell => cell === null || cell === undefined || cell === ""));
            if (emptyRows.length > 0) {
                fileErrors.push("Certaines lignes sont complètement vides.");
            }

            setProgress(60, cardId);

            let duplicateRows = data.slice(1).map((row, index) => JSON.stringify(row))
                .filter((rowString, index, self) => self.indexOf(rowString) !== index);
            if (duplicateRows.length > 0) {
                fileErrors.push("Il y a des lignes dupliquées dans le fichier.");
            }

            setProgress(80, cardId);

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

            setProgress100(cardId);

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
                if (cardId === 1) setFileUploaded1(true);
                if (cardId === 2) setFileUploaded2(true);
                if (cardId === 3) setFileUploaded3(true);
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleFileUpload = (event, cardId) => {
        const file = event.target.files[0];
        if (file) {
            setErrors([]);
            setValidData([]);
            setProgress(10, cardId);
            setAnalysisComplete(false);
            validateFile(file, cardId);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const setProgress = (progressValue, cardId) => {
        if (cardId === 1) setProgress1(progressValue);
        if (cardId === 2) setProgress2(progressValue);
        if (cardId === 3) setProgress3(progressValue);
    };

    const setProgress100 = (cardId) => {
        setProgress(100, cardId);
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
                                {!fileUploaded1 && (
                                    <input
                                        className="button"
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={(e) => handleFileUpload(e, 1)}
                                    />
                                )}
                                {progress1 > 0 && (
                                    <ProgressBar now={progress1} label={`${Math.round(progress1)}%`} />
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="card-title">Mise à jour de produits.</Card.Title>
                                <Card.Text className="card-text">
                                    Mettez à jour vos produits à partir d'un fichier Excel (.xlsx).
                                </Card.Text>
                                {!fileUploaded2 && (
                                    <input
                                        className="button"
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={(e) => handleFileUpload(e, 2)}
                                    />
                                )}
                                {progress2 > 0 && (
                                    <ProgressBar now={progress2} label={`${Math.round(progress2)}%`} />
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="card-title">Mise à jour d'equipement.</Card.Title>
                                <Card.Text className="card-text">
                                    Mettez à jour vos équipements à partir d'un fichier Excel (.xlsx).
                                </Card.Text>
                                {!fileUploaded3 && (
                                    <input
                                        className="button"
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={(e) => handleFileUpload(e, 3)}
                                    />
                                )}
                                {progress3 > 0 && (
                                    <ProgressBar now={progress3} label={`${Math.round(progress3)}%`} />
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
                            <table className="destinataires-table">
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

            {!fileUploaded1 && (
                <div className="example-file">
                    <button className="download-btn" onClick={generateExampleFile}>
                        Télécharger un fichier exemple
                    </button>
                </div>
            )}
        </div>
    );
}
