import styles from "./NavigationSideBar.module.css";

const NavigationSideBar = () => {
  return (
    <div className={styles.container}>
      <div style={{ position: "fixed", width: "22.5rem" }}>
        <h1>NavigationSideBar</h1>
      </div>
    </div>
  );
};

export default NavigationSideBar;
