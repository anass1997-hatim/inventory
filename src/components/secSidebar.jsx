import { Sidebar } from "flowbite-react";
    import {
        HiAdjustments,
        HiArrowUp,
        HiBookmark,
        HiClipboard,
        HiClipboardList,
        HiCloud,
        HiDocumentReport,
        HiDownload,
        HiFolder,
        HiHome,
        HiIdentification,
        HiLink,
        HiMail,
        HiOutlineClock,
        HiOutlineKey,
        HiOutlineTag,
        HiPrinter,
        HiSearch,
        HiTruck,
        HiUserGroup,
    } from "react-icons/hi";
    import '../css/secSidebar.css';
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faFileAlt, faFolder, faPlus } from "@fortawesome/free-solid-svg-icons";
    import { HiArrowTrendingUp, HiClipboardDocumentCheck, HiUserPlus } from "react-icons/hi2";
    import { useEffect, useRef, useState } from "react";
    import {NavLink} from "react-router-dom";
    import AddFolder from "../components/body/formFolder";

    export default function SecondSideMenu({ activeItem }) {
        const [dropdownVisible, setDropdownVisible] = useState(false);
        const dropdownRef = useRef(null);
        const [openModalFolder, setOpenModalFolder ] = useState(false);
        const [buttonType , setButtonType] = useState(null)
        const openModal = (type) => {
            setOpenModalFolder(true);
            setButtonType(type);
        };
        const closeModal = () => setOpenModalFolder(false);


        const toggleDropdown = () => {
            setDropdownVisible(!dropdownVisible);
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);




        const renderMenuItems = () => {
            switch (activeItem) {
                case "Acceuil":
                    return (
                        <>
                            <Sidebar.Item className="sec-sidebar-item">
                                <button className="buttonAdd" onClick={toggleDropdown}>
                                    <span className="buttonContent">
                                        <FontAwesomeIcon icon={faPlus} className="icon" />
                                        Nouveau
                                    </span>
                                </button>

                                {dropdownVisible && (
                                    <div className="dropdown">
                                        <button className="dropdown-item"
                                                onClick={() => openModal("folder")}>
                                            <FontAwesomeIcon icon={faFolder} className="icon-gap"/>
                                            Créer un dossier
                                        </button>
                                        <button className="dropdown-item"
                                                onClick={() => openModal("product")}>
                                            <FontAwesomeIcon icon={faFileAlt} className="icon-gap"/>
                                            Créer un produit
                                        </button>
                                        <button className="dropdown-item" 
                                                onClick={() => openModal("equipment")}>
                                            <FontAwesomeIcon icon={faFileAlt} className="icon-gap"/>
                                            Créer un équipement
                                        </button>
                                    </div>
                                )}


                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Accueil
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiFolder} className="sec-sidebar-item sub-item">
                                <NavLink to="/home" className="sec-sidebar-item" end>
                                    Dossiers
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiIdentification} className="sec-sidebar-item sub-item">
                                <NavLink to="/home/recipients" className="sec-sidebar-item">
                                Attribution / Restitution
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiArrowUp} className="sec-sidebar-item sub-item">
                                <NavLink to="/home/data/import" className="sec-sidebar-item">
                                Import de données
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiSearch} className="sec-sidebar-item sub-item">
                                <NavLink to="/home/data/search-by-file" className="sec-sidebar-item">
                                Recherche par fichier
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Suivi de l'activité
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiArrowTrendingUp} className="sec-sidebar-item sub-item">
                                <NavLink to="/home/data/transactions" className="sec-sidebar-item">
                                Transactions
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiDocumentReport} className="sec-sidebar-item sub-item">
                                <NavLink to="/home/data/reservations" className="sec-sidebar-item">
                                Réservations
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item icon={HiOutlineClock} className="sec-sidebar-item sub-item">
                                <NavLink to="/home/data/activity" className="sec-sidebar-item">
                                Journal d'activités
                                </NavLink>
                            </Sidebar.Item>
                        </>
                    );
                case "Rapports":
                    return (
                        <>
                            <Sidebar.Item className="sec-sidebar-item title-item">
                                Rapports
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                Détails des rapports
                            </Sidebar.Item>
                        </>
                    );
                case "Interventions":
                    return (
                        <>

                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Interventions
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions" className="sec-sidebar-item" end>
                                Toutes les interventions
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/daily-interventions" className="sec-sidebar-item">
                                Les interventions du jour
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/weekly-interventions" className="sec-sidebar-item">
                                Les interventions de la semaine
                                    </NavLink>
                            </Sidebar.Item>

                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Tâches
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/tasks" className="sec-sidebar-item">
                                Toutes les tâches
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/tasks-to-do" className="sec-sidebar-item">
                                Mes tâches à faire
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/tasks-in-group" className="sec-sidebar-item">
                                Tâches à faire de mon groupe
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/my-tasks" className="sec-sidebar-item">
                                Mes tâches
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/interventions/data/unassigned-tasks" className="sec-sidebar-item">
                                Tâches non assignées
                            </NavLink>
                            </Sidebar.Item>
                        </>
                    );

                case "Commandes":
                    return (
                        <>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Commandes
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/orders" className="sec-sidebar-item" end>
                                Toutes les Commandes
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/orders/orders-received" className="sec-sidebar-item">
                                les Commandes reçus
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/orders/current-orders" className="sec-sidebar-item">
                                les Commandes en cours
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Les articles
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/orders/items" className="sec-sidebar-item">
                                Tous les articles commandés
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/orders/current-items" className="sec-sidebar-item">
                                Les articles reçus
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item">
                                <NavLink to="/orders/incoming-items" className="sec-sidebar-item">
                                Les articles en cours de réception
                                </NavLink>
                            </Sidebar.Item>
                        </>
                    )
                case "Paramètres":
                    return (
                        <>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Générale
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiUserPlus}>
                            <NavLink to="/settings/users" className="sec-sidebar-item">
                                Utilisateurs
                            </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiUserGroup}>
                            <NavLink to="/settings/groups" className="sec-sidebar-item">
                                Groupes
                            </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiMail}>
                                <NavLink to="/settings/mails" className="sec-sidebar-item">
                                Notifications personnalisées
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiClipboardDocumentCheck}>
                                <NavLink to="/settings/business-rules" className="sec-sidebar-item">
                                Règles métiers
                               </NavLink>
                            </Sidebar.Item>

                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Gestion des références
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiFolder}>
                                <NavLink to="/settings/categories" className="sec-sidebar-item">
                                Catégories
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiClipboardList}>
                                <NavLink to="/settings/fields" className="sec-sidebar-item">
                                Champs personnalisés
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiClipboard}>
                                <NavLink to="/settings/formlayouts" className="sec-sidebar-item">
                                Formulaires personnalisés
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiClipboard}>
                                <NavLink to="/settings/quickupdate" className="sec-sidebar-item">
                                Formulaires de mise à jour rapide
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiOutlineTag}>
                                <NavLink to="/settings/reservations" className="sec-sidebar-item">
                                Noms des réservations
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiHome}>
                                <NavLink to="/settings/destination-sites" className="sec-sidebar-item">
                                Sites de destination
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiBookmark}>
                                <NavLink to="/settings/bundles" className="sec-sidebar-item">
                                Associations des références
                                    </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiPrinter}>
                                <NavLink to="/settings/printers" className="sec-sidebar-item">
                                Impression étiquette
                                </NavLink>
                            </Sidebar.Item>

                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Gestion des dossiers
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiOutlineKey}>
                                <NavLink to="/settings/tags" className="sec-sidebar-item">
                                Mots-clés
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Gestion des commandes
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiTruck}>
                                <NavLink to="/settings/suppliers" className="sec-sidebar-item">
                                Fournisseurs
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item title-item non-clickable">
                                Automatisation
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiLink}>
                                <NavLink to="/settings/api/connections" className="sec-sidebar-item">
                                Connexions
                             </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiAdjustments}>
                                <NavLink to="/settings/api/services" className="sec-sidebar-item">
                                Fonctions
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiCloud}>
                                <NavLink to="/settings/api/requests" className="sec-sidebar-item">
                                Requêtes (Webhooks)
                                </NavLink>
                            </Sidebar.Item>
                            <Sidebar.Item className="sec-sidebar-item sub-item" icon={HiDownload}>
                                <NavLink to="/settings/api/incoming-requests" className="sec-sidebar-item">
                                Requêtes entrantes
                                </NavLink>
                            </Sidebar.Item>
                        </>
                    )
                default:
                    return (
                        <Sidebar.Item className="sec-sidebar-item">
                            Please select a valid menu item
                        </Sidebar.Item>
                    );
            }
        };

        return (
            <>
                <Sidebar aria-label="Second Sidebar with content separator example" className="sec-sidebar">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup className="sec-sidebar-item-group">
                            {renderMenuItems()}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
                <AddFolder open={openModalFolder} onClose={closeModal} btnType={buttonType} />
            </>
        );
    }
