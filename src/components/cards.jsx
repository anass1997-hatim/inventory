import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import '../css/card.css';
import add_folder from '../images/add-folder.png';
import add_user from '../images/add-user.png';
import download from '../images/download.png';

const cardData = [
    {
        title: "Création de dossiers et références",
        text: `Organisez vos dossiers et références de manière optimale 
        en utilisant la fonctionnalité d'importation pour un ajout en masse, 
        ou optez pour l'ajout manuel pour un contrôle personnalisé.`,
        image: add_folder,
        alt: "Add Folder",
        className: "images",
    },
    {
        title: "Commencez à utiliser Inventory sur mobile",
        text: `Téléchargez l'application mobile, connectez-vous, 
        puis commencez à scanner vos références pour explorer 
        toutes les fonctionnalités de Inventory.`,
        image: download,
        alt: "Download",
        className: "image",
    },
    {
        title: "Gestion des utilisateurs et abonnements",
        text: `En tant qu'administrateur, vous avez la possibilité d'ajouter de nouveaux utilisateurs 
        et de sélectionner l'abonnement le plus adapté à votre organisation.`,
        image: add_user,
        alt: "Add User",
        className: "images",
    },
];

export default function DisplayCards() {
    return (
        <CardGroup className="card-group">
            {cardData.map((card, index) => (
                <Card key={index} className="card">
                    <Card.Body className="card-body">
                        <Card.Title className="card-title">{card.title}</Card.Title>
                        <Card.Text className="card-text">{card.text}</Card.Text>
                        <div className="images-container">
                            <img
                                className={card.className}
                                src={card.image}
                                alt={card.alt}
                            />
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </CardGroup>
    );
}
