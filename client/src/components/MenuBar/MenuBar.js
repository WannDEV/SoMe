import React, { useEffect, useRef } from "react"; // Importér React, useEffect og useRef fra React
import styles from "./MenuBar.module.css"; // Importér CSS-stilarter fra den lokale fil "MenuBar.module.css"

// MenuBar-komponenten
const MenuBar = (props) => {
  const isOpen = props.isOpen; // Boolean til at angive om menuen er åben
  const setIsOpen = props.setIsOpen; // Funktion til at indstille om menuen er åben
  const menuRef = useRef(null); // Ref til menuelementet

  const placement = props.placement || "right"; // Placeringen af menuen (standard: højre)

  // Effekt til at lukke menuen, når der klikkes udenfor
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Luk menuen, hvis det klikkede element er udenfor menuen
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Lyt efter mousedown-hændelse udenfor menuen
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Fjern event listener, når komponenten afmonteres
    };
  }, [setIsOpen]); // Lyt kun for ændringer i setIsOpen-prop

  // Funktion til at skifte mellem åben og lukket tilstand for menuen
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Funktion til at få menuens styles baseret på placering
  const getMenuStyles = () => {
    let styles = {};
    switch (placement) {
      case "left":
        styles = {
          ...styles,
          left: 0,
          right: "unset",
        };
        break;
      case "center":
        styles = {
          ...styles,
          transform: "translateX(-50%)",
          top: "100%",
          left: "50%",
        };
        break;
      default:
        styles = {
          ...styles,
          top: "100%",
          right: 0,
        };
    }
    return styles;
  };

  return (
    <div ref={menuRef} className={styles.menuBar}>
      {React.cloneElement(props.triggerComponent, { onClick: toggleMenu })}{" "}
      {/* Kloner triggerComponent og tilføjer onClick-event til at åbne/lukke menuen */}
      {isOpen && (
        <div className={styles.menuContent} style={getMenuStyles()}>
          {" "}
          {/* Styler menuindholdet baseret på placering */}
          {props.children} {/* Viser indholdet af menuen */}
        </div>
      )}
    </div>
  );
};

export default MenuBar; // Eksportér MenuBar-komponenten
