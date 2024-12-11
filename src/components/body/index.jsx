import React, { useState, useEffect, useRef } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import '../../css/index.css';

const EXPECTED_COLUMNS = [
    'Identifiant',
    'Code-barres',
    'Emplacement',
    'Dossiers',
    'Catégorie',
    'Description',
    'Mots-cles'
];

export function useExcelImport() {
    const [importErrors, setImportErrors] = useState([]);
    const [importedData, setImportedData] = useState([]);

    const validateAndCleanData = (jsonData) => {
        const errors = new Set();
        const cleanedData = [];
        const uniqueEntries = new Set();

        if (!jsonData || jsonData.length === 0) {
            errors.add("Le fichier Excel est vide.");
            return { cleanedData: [], errors: Array.from(errors) };
        }

        const actualColumns = Object.keys(jsonData[0]);
        const missingColumns = EXPECTED_COLUMNS.filter(
            col => !actualColumns.includes(col)
        );

        if (missingColumns.length > 0) {
            errors.add(`Colonnes manquantes : ${missingColumns.join(', ')}`);
            return { cleanedData: [], errors: Array.from(errors) };
        }

        jsonData.forEach((row) => {
            let errorMessage = '';

            if (!row.Identifiant) {
                errorMessage = `Identifiant manquant`;
            }

            const rowKey = row.Identifiant;
            if (uniqueEntries.has(rowKey)) {
                errorMessage = `Doublon détecté pour l'identifiant : ${rowKey}`;
            } else {
                uniqueEntries.add(rowKey);
            }

            if (errorMessage) {
                errors.add(errorMessage);
            }

            const cleanedRow = {
                id: row.Identifiant,
                barcode: row['Code-barres'] || '',
                location: row.Emplacement || '',
                folders: row.Dossiers ? row.Dossiers.split(',').map(f => f.trim()) : [],
                category: row.Catégorie || '',
                description: row.Description || '',
                keywords: row['Mots-cles'] || ''
            };

            cleanedData.push(cleanedRow);
        });

        return { cleanedData, errors: Array.from(errors) };
    };

    const handleImport = (event) => {
        setImportErrors([]);
        setImportedData([]);

        const file = event.target.files[0];
        if (!file) return;

        const validFileTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        if (!validFileTypes.includes(file.type)) {
            setImportErrors(["Type de fichier non supporté. Utilisez Excel ou CSV."]);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                const { cleanedData, errors } = validateAndCleanData(jsonData);

                setImportedData(cleanedData);
                setImportErrors(errors);
            } catch (error) {
                console.error("Erreur lors de l'import :", error);
                setImportErrors([
                    "Erreur lors de la lecture du fichier. Vérifiez le format du fichier.",
                    error.message
                ]);
            }
        };

        reader.onerror = (error) => {
            console.error("Erreur de lecture de fichier :", error);
            setImportErrors(["Impossible de lire le fichier. Réessayez."]);
        };

        reader.readAsBinaryString(file);
    };

    return {
        handleImport,
        importedData,
        importErrors
    };
}

export default function Index() {
    const [columnsVisible, setColumnsVisible] = useState({
        column1: true,
        column2: true,
        column3: true,
        column4: true,
        column5: true,
        column6: true,
        column7: true
    });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [viewDropdownVisible, setViewDropdownVisible] = useState(false);
    const [selectedView, setSelectedView] = useState('Tableau');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const dropdownRef = useRef(null);
    const viewDropdownRef = useRef(null);
    const navigate = useNavigate();
    const { handleImport, importedData, importErrors } = useExcelImport();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (importedData.length > 0) {
            setData(importedData);
            setCurrentPage(1);
        } else if (importErrors.length > 0) {
            setData([]);
            setCurrentPage(1);
        }
    }, [importedData, importErrors]);

    const handleColumnToggle = (column, event) => {
        event.stopPropagation();
        setColumnsVisible((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    const toggleDropdown = (event) => {
        setDropdownVisible(!dropdownVisible);
        event.stopPropagation();
    };

    const toggleViewDropdown = (event) => {
        setViewDropdownVisible(!viewDropdownVisible);
        event.stopPropagation();
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
        if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target)) {
            setViewDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleViewSelect = (view, event) => {
        event.stopPropagation();
        setSelectedView(view);
        setViewDropdownVisible(false);
    };

    const renderTableContent = () => {
        if (data.length === 0) {
            return (
                <div className="no-data-message">
                    <p>Aucune donnée disponible. Assurez-vous d'avoir des données à afficher.</p>
                    <p>Vous pouvez importer des données en utilisant le bouton 'Importer depuis Excel' ci-dessus.</p>
                </div>
            );
        }

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

        const handleItemClick = (row) => {
            navigate(`/home/folder/${row.id}`);
        };

        if (selectedView === 'Liste') {
            return (
                <div className="styled-list">
                    {currentData.map((row, index) => (
                        <div key={index} className="list-item" onClick={() => handleItemClick(row)}>
                            <div className="list-item-row">
                                {columnsVisible.column1 && <span><strong>Identifiant:</strong> {row.id}</span>}
                                {columnsVisible.column2 && <span><strong>Code-barres:</strong> {row.barcode}</span>}
                                {columnsVisible.column3 && <span><strong>Emplacement:</strong> {row.location}</span>}
                                {columnsVisible.column4 && <span><strong>Dossiers:</strong> {row.folders.join(', ')}</span>}
                            </div>
                            <div className="list-item-row">
                                {columnsVisible.column5 && <span><strong>Catégorie:</strong> {row.category}</span>}
                                {columnsVisible.column6 && <span><strong>Description:</strong> {row.description}</span>}
                                {columnsVisible.column7 && <span><strong>Mots-cles:</strong> {row.keywords}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (selectedView === 'Tableau') {
            return (
                <table className="table">
                    <thead>
                    <tr>
                        {columnsVisible.column1 && <th>Identifiant</th>}
                        {columnsVisible.column2 && <th>Code-barres</th>}
                        {columnsVisible.column3 && <th>Emplacement</th>}
                        {columnsVisible.column4 && <th>Dossiers</th>}
                        {columnsVisible.column5 && <th>Catégorie</th>}
                        {columnsVisible.column6 && <th>Description</th>}
                        {columnsVisible.column7 && <th>Mots-cles</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((row, index) => (
                        <tr key={index} onClick={() => handleItemClick(row)}>
                            {columnsVisible.column1 && <td>{row.id}</td>}
                            {columnsVisible.column2 && <td>{row.barcode}</td>}
                            {columnsVisible.column3 && <td>{row.location}</td>}
                            {columnsVisible.column4 && <td>{row.folders.join(', ')}</td>}
                            {columnsVisible.column5 && <td>{row.category}</td>}
                            {columnsVisible.column6 && <td>{row.description}</td>}
                            {columnsVisible.column7 && <td>{row.keywords}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        } else if (selectedView === 'Grille') {
            return (
                <div className="grid-container">
                    {currentData.map((row, index) => (
                        <div
                            className="grid-item"
                            key={index}
                            onClick={() => handleItemClick(row)}
                        >
                            {columnsVisible.column1 && <p>Identifiant: {row.id}</p>}
                            {columnsVisible.column2 && <p>Code-barres: {row.barcode}</p>}
                            {columnsVisible.column3 && <p>Emplacement: {row.location}</p>}
                            {columnsVisible.column4 && <p>Dossiers: {row.folders.join(', ')}</p>}
                            {columnsVisible.column5 && <p>Catégorie: {row.category}</p>}
                            {columnsVisible.column6 && <p>Description: {row.description}</p>}
                            {columnsVisible.column7 && <p>Mots-cles: {row.keywords}</p>}
                        </div>
                    ))}
                </div>
            );
        }
    };

    const handleExport = () => {
        const exportData = data.map((row) => ({
            Identifiant: row.id,
            'Code-barres': row.barcode,
            Emplacement: row.location,
            Dossiers: row.folders.join(', '),
            Catégorie: row.category,
            Description: row.description,
            'Mots-cles': row.keywords,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(file, 'data.xlsx');
    };

    const handleValidate = () => {
        alert("Validation successful!");
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="custom-navbar">
            {importErrors.length > 0 && (
                <div className="error-container">
                    <h4>Erreurs d'importation :</h4>
                    <ul>
                        {importErrors.map((error, index) => (
                            <li key={index} className="error-message">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <Navbar data-bs-theme="dark">
                <Container>
                    <Nav className="me-auto">
                        <Button variant="light" className="me-2">
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                accept=".xlsx,.xls,.csv"
                                onChange={handleImport}
                                id="import-file"
                            />
                            <label htmlFor="import-file">Importer depuis Excel</label>
                        </Button>
                        <Button variant="light" className="me-2" onClick={handleExport}>Exporter vers Excel</Button>
                        <div style={{ position: 'relative' }}>
                            <Button
                                variant="light"
                                className="me-2"
                                onClick={toggleViewDropdown}
                            >
                                {selectedView}
                            </Button>
                            {viewDropdownVisible && (
                                <div ref={viewDropdownRef} className="dropdown-menu show">
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleViewSelect('Liste', e)}
                                    >
                                        Liste
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleViewSelect('Tableau', e)}
                                    >
                                        Tableau
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleViewSelect('Grille', e)}
                                    >
                                        Grille
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Nav>
                    <Nav className="d-flex">
                        <div style={{ position: 'relative' }}>
                            <Button variant="light" className="me-2" onClick={toggleDropdown}>
                                Colonnes à afficher
                            </Button>
                            {dropdownVisible && (
                                <div ref={dropdownRef} className="dropdown-menu show">
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column1', e)}
                                    >
                                        {columnsVisible.column1 ? 'Cacher Identifiant' : 'Afficher Identifiant'}
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column2', e)}
                                    >
                                        {columnsVisible.column2 ? 'Cacher Code-barres' : 'Afficher Code-barres'}
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column3', e)}
                                    >
                                        {columnsVisible.column3 ? 'Cacher Emplacement' : 'Afficher Emplacement'}
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column4', e)}
                                    >
                                        {columnsVisible.column4 ? 'Cacher Dossiers' : 'Afficher Dossiers'}
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column5', e)}
                                    >
                                        {columnsVisible.column5 ? 'Cacher Catégorie' : 'Afficher Catégorie'}
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column6', e)}
                                    >
                                        {columnsVisible.column6 ? 'Cacher Description' : 'Afficher Description'}
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column7', e)}
                                    >
                                        {columnsVisible.column7 ? 'Cacher Mots-cles' : 'Afficher Mots-cles'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Nav>
                </Container>
            </Navbar>

            <div className="table-container">
                {renderTableContent()}
            </div>

            <div className="pagination-controls d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="me-2"
                    >
                        Précédent
                    </Button>
                    <span className="me-2">{currentPage}</span>
                    <Button
                        onClick={() => paginate(currentPage + 1)}
                        className="me-2"
                        disabled={currentPage * itemsPerPage >= data.length}
                    >
                        Suivant
                    </Button>
                </div>
                <Button className="validate-data-btn" onClick={handleValidate}>
                    Valider
                </Button>
            </div>
        </div>
    );
}