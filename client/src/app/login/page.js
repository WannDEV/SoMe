"use client";
import LoginForm from "../../components/Auth/LoginForm";
import { WithRedirectIfAuthenticated } from "../../components/Auth/WithRedirectIfAuthenticated";
import styles from "./page.module.css";

const Login = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <LoginForm />
      </div>
    </div>
  );
};

export default WithRedirectIfAuthenticated(Login);
