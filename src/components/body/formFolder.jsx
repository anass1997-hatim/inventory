import React, { useRef, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../css/formAddFolder.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCamera,
    faIdBadge,
    faBarcode,
    faMapMarkerAlt,
    faTag,
    faStickyNote,
    faInfoCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

const AddFolder = ({ open, onClose, btnType }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    const [customAttributes, setCustomAttributes] = useState([]);

    const addAttribute = () => {
        setCustomAttributes([
            ...customAttributes,
            { id: Date.now(), name: "", value: "" },
        ]);
    };

    const removeAttribute = (id) => {
        setCustomAttributes(customAttributes.filter((attr) => attr.id !== id));
    };

    const handleAttributeChange = (id, field, value) => {
        setCustomAttributes(
            customAttributes.map((attr) =>
                attr.id === id ? { ...attr, [field]: value } : attr
            )
        );
    };

    const fileInputRef = useRef();

    const handleAddCategory = useCallback(() => {
        if (newCategory.trim() && !categories.includes(newCategory)) {
            setCategories((prevCategories) => [...prevCategories, newCategory]);
            setSelectedCategory(newCategory);
            setNewCategory("");
        }
    }, [newCategory, categories]);

    const handleFileUpload = useCallback((event) => {
        const files = Array.from(event.target.files);
        setUploadedImages((prev) => [...prev, ...files]);
    }, []);

    const handleRemoveImage = useCallback((index) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
    };

    const renderFolderForm = () => (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
                <Col md={6}>
                    <Form.Group controlId="formId">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faIdBadge} className="me-2" />
                            ID
                        </Form.Label>
                        <Form.Control type="text" placeholder="ID unique" required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="formBarcode">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faBarcode} className="me-2" />
                            Code-barres
                        </Form.Label>
                        <Form.Control type="text" placeholder="Scanner ou entrer le code-barres" required />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col md={6}>
                    <Form.Group controlId="formLocation">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                            Emplacement
                        </Form.Label>
                        <Form.Control type="text" placeholder="Emplacement physique" required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="formCategory">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faTag} className="me-2" />
                            Catégorie
                        </Form.Label>
                        <div className="d-flex mt-2">
                            <Form.Control
                                type="text"
                                placeholder="Nouvelle catégorie"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <Button className="me-3" type="button" onClick={handleAddCategory}>
                                Ajouter
                            </Button>
                        </div>
                        <Form.Control
                            as="select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Sélectionner une catégorie"
                        >
                            <option value="">{categories.length === 0 ? "Aucune donnée" : "Sélectionner une catégorie"}</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col>
                    <Form.Group controlId="formKeywords">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faStickyNote} className="me-2" />
                            Mots-clés
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ajouter des mots-clés séparés par des virgules"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col>
                    <Form.Group controlId="formImages">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faCamera} className="me-2" />
                            Images téléchargées
                        </Form.Label>
                        <div className="d-flex align-items-center mb-2">
                            <div className="me-2">
                                <FontAwesomeIcon
                                    icon={faCamera}
                                    className="camera-btn"
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ cursor: "pointer" }}
                                    aria-label="Ajouter une image"
                                />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                aria-label="Choisir des fichiers"
                            />
                            {uploadedImages.length > 0 && (
                                <ul className="list-group">
                                    {uploadedImages.map((img, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            {img.name}
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                className="text-danger cursor-pointer"
                                                onClick={() => handleRemoveImage(index)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formDescription">
                <Form.Label className="small">
                    <FontAwesomeIcon icon={faStickyNote} className="me-2" />
                    Description
                </Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Ajouter une description" required />
            </Form.Group>

            <Row className="mt-3">
                <Col>
                    <Button type="button" onClick={onClose} className="me-4">
                        Annuler
                    </Button>
                    <Button type="submit" className="me-3">
                        Enregistrer
                    </Button>
                </Col>
            </Row>
        </Form>
    );

    const renderProductForm = () => (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
                <Col md={6}>
                    <Form.Group controlId="formFolderId">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faIdBadge} className="me-2" />
                            Affecter à un ID de dossier
                        </Form.Label>
                        <Form.Control as="select" defaultValue="" aria-label="Sélectionner un dossier">
                            <option value="">Sélectionner un dossier</option>
                            <option value="1">Dossier 1</option>
                            <option value="2">Dossier 2</option>
                            <option value="3">Dossier 3</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group controlId="formBarcode">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faBarcode} className="me-2" />
                            Code-barres
                        </Form.Label>
                        <Form.Control type="text" placeholder="Scanner ou entrer le code-barres" required />
                    </Form.Group>
                </Col>
            </Row>


            <Row className="mb-2">
                <Col md={6}>
                    <Form.Group controlId="formLocation">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                            Emplacement
                        </Form.Label>
                        <Form.Control type="text" placeholder="Emplacement physique" required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="formCategory">
                        <Form.Label className="small">
                            <FontAwesomeIcon icon={faTag} className="me-2" />
                            Catégorie
                        </Form.Label>
                        <Form.Control type="text" placeholder="Catégorie" required />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formDescription">
                <Form.Label className="small">
                    <FontAwesomeIcon icon={faStickyNote} className="me-2" />
                    Description
                </Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Ajouter une description" required />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formInventoryDate">
                <Form.Label className="small">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Date d'inventaire
                </Form.Label>
                <Form.Control type="date" required />
            </Form.Group>

            <div className="mb-2">
                <h5 className="mb-3">Stock</h5>
                <Row className="mb-2">
                    <Col md={4}>
                        <Form.Group controlId="formQuantity">
                            <Form.Label className="small">Quantité</Form.Label>
                            <Form.Control type="number" placeholder="Quantité" required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formAvailableQuantity">
                            <Form.Label className="small">Quantité disponible</Form.Label>
                            <Form.Control type="number" placeholder="Quantité disponible" required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formAlertThreshold">
                            <Form.Label className="small">Seuil d'alerte</Form.Label>
                            <Form.Control type="number" placeholder="Seuil d'alerte" required />
                        </Form.Group>
                    </Col>
                </Row>
            </div>

            <div className="mb-3">
                <h5>Attributs personnalisés</h5>
                {customAttributes.map((attr) => (
                    <Row key={attr.id} className="mb-2">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Nom de l'attribut"
                                value={attr.name}
                                onChange={(e) => handleAttributeChange(attr.id, "name", e.target.value)}
                            />
                        </Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Valeur de l'attribut"
                                value={attr.value}
                                onChange={(e) => handleAttributeChange(attr.id, "value", e.target.value)}
                            />
                        </Col>
                        <Col md={2}>
                            <Button className="delete-attribute" onClick={() => removeAttribute(attr.id)}>
                                Supprimer
                            </Button>
                        </Col>
                    </Row>
                ))}
                <Button className="add-attribute" onClick={addAttribute}>
                    Ajouter un attribut
                </Button>
            </div>

            <Row className="modal-btn-row">
                <Col>
                    <Button type="button" onClick={onClose} className="modal-btn cancel-btn">
                        Annuler
                    </Button>
                    <Button type="submit" className="modal-btn submit-btn">
                        Enregistrer
                    </Button>
                </Col>
            </Row>
        </Form>
    );

    return (
        <Modal show={open} onHide={onClose} centered dialogClassName="fixed-modal-width" contentClassName="add-folder-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    {btnType === "folder" ? "Créer un dossier" : btnType === "equipment" ? "Créer un équipement" : "Ajouter un élément"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {btnType === "folder" ? renderFolderForm() : btnType === "equipment" ? renderProductForm() : renderProductForm()}
            </Modal.Body>
        </Modal>
    );
};

export default AddFolder;
