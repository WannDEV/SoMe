"use client";
import RegisterForm from "../../components/Auth/RegisterForm";
import { WithRedirectIfAuthenticated } from "../../components/Auth/WithRedirectIfAuthenticated";
import styles from "./page.module.css";

const Register = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default WithRedirectIfAuthenticated(Register);
