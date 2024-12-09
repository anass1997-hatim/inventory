import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import '../../css/formDestinataire.css';

export default function OpenedFormDestinataire({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        codebarres: '',
        telephone: '',
        status: 'Actif',
        service: ''
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    const handleSave = useCallback(() => {
        // Add save logic here
        console.log('Saved data:', formData);
        onClose();
    }, [formData, onClose]);

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Créer un destinataire</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formNom">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    placeholder="Nom"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="formPrenom">
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    placeholder="Prénom"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formCodebarres">
                                <Form.Label>Code-barres</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codebarres"
                                    value={formData.codebarres}
                                    onChange={handleChange}
                                    placeholder="Code-barres"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="formTelephone">
                                <Form.Label>Téléphone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="Téléphone"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option>Actif</option>
                                    <option>Inactif</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={12}>
                            <Form.Group controlId="formService">
                                <Form.Label>Service / Département</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    placeholder="Service / Département"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Annuler</Button>
                <Button variant="primary" onClick={handleSave}>Sauvegarder</Button>
            </Modal.Footer>
        </Modal>
    );
}
