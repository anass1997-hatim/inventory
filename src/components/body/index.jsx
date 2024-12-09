import React, { useState, useEffect, useRef } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import '../../css/index.css';

export default function Index() {
    const [columnsVisible, setColumnsVisible] = useState({
        column1: true,
        column2: true,
        column3: true,
    });
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [viewDropdownVisible, setViewDropdownVisible] = useState(false);
    const [selectedView, setSelectedView] = useState('Tableau');
    const dropdownRef = useRef(null);
    const viewDropdownRef = useRef(null);

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
        const data = [
            { column1: 'Data 1', column2: 'Data 2', column3: 'Data 3' },
            { column1: 'Data 4', column2: 'Data 5', column3: 'Data 6' },
        ];

        if (selectedView === 'Liste') {

            return (
                <ul className="styled-list">
                    {data.map((row, index) => (
                        <li key={index} className="list-item">
                            {columnsVisible.column1 && <strong>Column 1:</strong>} {row.column1}
                            {columnsVisible.column2 && <strong>Column 2:</strong>} {row.column2}
                            {columnsVisible.column3 && <strong>Column 3:</strong>} {row.column3}
                        </li>
                    ))}
                </ul>
            );
        } else if (selectedView === 'Tableau') {
            return (
                <table className="table">
                    <thead>
                    <tr>
                        {columnsVisible.column1 && <th>Column 1</th>}
                        {columnsVisible.column2 && <th>Column 2</th>}
                        {columnsVisible.column3 && <th>Column 3</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {columnsVisible.column1 && <td>{row.column1}</td>}
                            {columnsVisible.column2 && <td>{row.column2}</td>}
                            {columnsVisible.column3 && <td>{row.column3}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        } else if (selectedView === 'Grille') {
            return (
                <div className="grid-container">
                    {data.map((row, index) => (
                        <div className="grid-item" key={index}>
                            {columnsVisible.column1 && <p>Column 1: {row.column1}</p>}
                            {columnsVisible.column2 && <p>Column 2: {row.column2}</p>}
                            {columnsVisible.column3 && <p>Column 3: {row.column3}</p>}
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="custom-navbar">
            <Navbar data-bs-theme="dark">
                <Container>
                    <Nav className="me-auto">
                        <Button variant="light" className="me-2">Importer depuis Excel</Button>
                        <Button variant="light" className="me-2">Exporter vers Excel</Button>
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
                        <Button variant="light" className="me-2">Button 4</Button>
                    </Nav>
                    <Nav className="d-flex">
                        <div style={{ position: 'relative' }}>
                            <Button variant="light" className="me-2" onClick={toggleDropdown}>
                                Filter Columns
                            </Button>
                            {dropdownVisible && (
                                <div ref={dropdownRef} className="dropdown-menu show">
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column1', e)}
                                    >
                                        Toggle Column 1
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column2', e)}
                                    >
                                        Toggle Column 2
                                    </Button>
                                    <Button
                                        className="dropdown-item"
                                        onClick={(e) => handleColumnToggle('column3', e)}
                                    >
                                        Toggle Column 3
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Nav>
                </Container>
            </Navbar>

            <div style={{ marginTop: '20px' }}>
                {renderTableContent()}
            </div>
        </div>
    );
}
