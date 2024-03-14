import React, { useEffect, useRef } from "react";
import styles from "./MenuBar.module.css";

const MenuBar = (props) => {
  const isOpen = props.isOpen;
  const setIsOpen = props.setIsOpen;
  const menuRef = useRef(null);

  const placement = props.placement || "right"; // Set default placement to right

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
      {React.cloneElement(props.buttonComponent, { onClick: toggleMenu })}
      {isOpen && (
        <div className={styles.menuContent} style={getMenuStyles()}>
          {props.children}
        </div>
      )}
    </div>
  );
};

export default MenuBar;
