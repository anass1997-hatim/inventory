import { Sidebar } from "flowbite-react";
import { NavLink, useLocation } from "react-router-dom";
import {
    HiHome,
    HiDocumentReport,
    HiCog,
    HiShoppingCart,
    HiRefresh,
    HiQuestionMarkCircle,
    HiTranslate,
    HiLogout,
} from "react-icons/hi";
import "../css/sidemenu.css";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function SideMenu({ activeItem, setActiveItem }) {
    const location = useLocation();
    const { pathname } = location;

    const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("Langues");

    const menuGroups = useMemo(() => [
        {
            items: [
                { icon: HiHome, label: "Acceuil", path: "/home" , fallbackPath : "/" },
                { icon: HiDocumentReport, label: "Rapports", path: "/reports" },
                { icon: HiCog, label: "Interventions", path: "/interventions" },
                { icon: HiShoppingCart, label: "Commandes", path: "/orders" },
                { icon: HiRefresh, label: "Mise à jour", path: "/updates" },
                { icon: HiCog, label: "Paramètres", path: "/settings" },
                { icon: HiQuestionMarkCircle, label: "Faq", path: "/faq" },
            ],
        },
        {
            items: [
                {
                    icon: HiTranslate,
                    label: selectedLanguage,
                    isDropdown: true,
                    dropdownItems: [
                        { label: "Français", value: "Français" },
                        { label: "Anglais", value: "Anglais" },
                    ],
                },
                { icon: HiLogout, label: "Deconnexion", path: "/logout" },
            ],
        },
    ], [selectedLanguage]);

    const determineActiveItem = useCallback(
        (path) => {
            for (const group of menuGroups) {
                for (const item of group.items) {
                    if (path.startsWith(item.path)) {
                        return item.label;
                    }
                }
            }
            return "Acceuil";
        },
        [menuGroups]
    );

    useEffect(() => {
        setActiveItem(determineActiveItem(pathname));
    }, [pathname, setActiveItem, determineActiveItem]);

    const handleClick = (item) => {
        if (item.isDropdown) {
            setLanguageDropdownOpen(!isLanguageDropdownOpen);
        } else {
            setActiveItem(item.label);
        }
    };

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setLanguageDropdownOpen(false);
        setActiveItem((prev) => (prev === "Langues" ? language : prev));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !event.target.closest(".language-dropdown") &&
                !event.target.closest(".sidebar-item")
            ) {
                setLanguageDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Sidebar aria-label="Sidebar with content separator example" className="sidebar">
            <Sidebar.Items>
                {menuGroups.map((group, groupIndex) => (
                    <Sidebar.ItemGroup key={groupIndex} className="sidebar-item-group">
                        {group.items.map((item, itemIndex) => (
                            <div key={itemIndex}>
                                {item.path ? (
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `sidebar-item ${isActive ? "active" : ""}`
                                        }
                                        onClick={() => setActiveItem(item.label)}
                                    >
                                        <item.icon className="icon" />
                                        {item.label}
                                    </NavLink>
                                ) : (
                                    <Sidebar.Item
                                        icon={item.icon}
                                        className={`sidebar-item ${
                                            activeItem === item.label ? "active" : ""
                                        }`}
                                        onClick={() => handleClick(item)}
                                    >
                                        {item.label}
                                    </Sidebar.Item>
                                )}
                                {item.isDropdown && isLanguageDropdownOpen && (
                                    <div className="language-dropdown">
                                        {item.dropdownItems.map((dropdownItem) => (
                                            <button
                                                key={dropdownItem.value}
                                                className="dropdown-item"
                                                onClick={() => handleLanguageSelect(dropdownItem.value)}
                                            >
                                                {dropdownItem.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </Sidebar.ItemGroup>
                ))}
            </Sidebar.Items>
        </Sidebar>
    );
}
