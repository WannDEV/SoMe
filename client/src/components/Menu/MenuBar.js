// https://nextui.org/docs/components/dropdown

import React, { useState, useEffect, useRef } from "react";
import styles from "./MenuBar.module.css";

const MenuBar = ({ buttonComponent, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div ref={menuRef} className={styles.menuBar}>
      {React.cloneElement(buttonComponent, { onClick: toggleMenu })}
      {isOpen && <div className={styles.menuContent}>{children}</div>}
    </div>
  );
};

export default MenuBar;
