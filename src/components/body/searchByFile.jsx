import '../../css/searchByFile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faPenToSquare, faDownload } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';
import { useState, useMemo } from 'react';

const itemsPerPage = 5;

const predefinedData = [
    { Identifiant: '12345', Codebarres: '987654321' },
    { Identifiant: '67890', Codebarres: '123456789' },
    { Identifiant: '54321', Codebarres: '111213141' },
    { Identifiant: '67812', Codebarres: '333444555' },
    { Identifiant: '87654', Codebarres: '999888777' }
];

export default function SearchByFile() {
    const [fileError, setFileError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredResults, setFilteredResults] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setFileError("Aucun fichier sélectionné.");
            return;
        }

        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
            setFileError("Veuillez télécharger un fichier Excel (.xlsx ou .xls).");
            return;
        }
        setFileError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const header = jsonData[0].map(col => col.toLowerCase());
            if (!header.includes("identifiant") || !header.includes("code-barres")) {
                setFileError("Le fichier doit contenir les colonnes 'Identifiant' et 'Code-barres'.");
                return;
            }

            const filteredData = jsonData.slice(1);

            // Simulate backend search by matching data with predefinedData
            const results = filteredData.filter(row => {
                const identifiant = row[0]?.toString().trim();
                const codebarres = row[1]?.toString().trim();

                return predefinedData.some(item =>
                    item.Identifiant === identifiant && item.Codebarres === codebarres
                );
            });

            setFilteredResults(results);
        };
        reader.readAsBinaryString(file);
    };

    const handleDownloadExample = () => {
        const headers = [
            { Identifiant: 'Identifiant', Codebarres: 'Code-barres' }
        ];

        const ws = XLSX.utils.json_to_sheet(headers, { header: ['Identifiant', 'Codebarres'], skipHeader: true });

        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
            if (cell) {
                cell.s = { font: { bold: true } };
            }
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Example");
        XLSX.writeFile(wb, 'exemple_references.xlsx');
    };

    const paginatedData = useMemo(() => {
        if (!filteredResults) return [];
        return filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredResults, currentPage]);

    const totalPages = useMemo(() => Math.ceil(filteredResults ? filteredResults.length / itemsPerPage : 1), [filteredResults]);

    return (
        <div className="search-by-file">
            <h4>
                <FontAwesomeIcon icon={faPenToSquare} className="icon-gap"/> Recherche par fichier
            </h4>
            <div className="download-example">
                <button className="download-btn" onClick={handleDownloadExample}>
                    <FontAwesomeIcon icon={faDownload} className="icon-gap"/>
                    Télécharger un fichier Model
                </button>
            </div>
            <span className="search-by-file-title">
                <h6>
                    <FontAwesomeIcon icon={faCircleExclamation} className="icon-gap"/>
                    Réalisez des recherches sur vos références en important un fichier Excel avec les identifiants ou les code-barres des références pour lesquelles vous souhaitez avoir plus d'informations.
                </h6>
            </span>

            <div className="steps-container">
                <div className="step">
                    <h5>1. Sélection du fichier</h5>
                    <p>Importez un fichier Excel contenant les identifiants ou les code-barres des références.</p>
                    <input type="file" accept=".xlsx, .xls" className="file-input" onChange={handleFileUpload}/>
                </div>
                <div className="step">
                    <h5>2. Affichage des résultats</h5>
                    <p>Une fois le fichier téléchargé, les résultats correspondants s'afficheront ici.</p>
                    <div className="results-placeholder">
                        {filteredResults.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Identifiant</th>
                                        <th>Code-barres</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginatedData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row[0]}</td>
                                            <td>{row[1]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

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
                            </div>
                        ) : (
                            <p>Aucun résultat à afficher pour le moment.</p>
                        )}
                    </div>
                </div>
            </div>

            {fileError && (
                <div className="error-message">
                    <p>{fileError}</p>
                </div>
            )}
        </div>
    );
}
