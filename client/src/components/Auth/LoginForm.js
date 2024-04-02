// https://betterprogramming.pub/a-step-by-step-guide-to-handle-form-validation-in-react-83232cd52316

import React, { useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { BiSolidError } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const onSuccess = (response) => {
    login(response.data.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("auth/login", {
        email,
        password,
      });
      onSuccess(response);

      console.log(response.data);
    } catch (error) {
      setEmail("");
      setPassword("");
      setError(error.response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span>Be</span>Social
      </h1>
      <hr />
      <h2 className={styles.formTitle}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        {error && (
          <span className={styles.error}>
            <BiSolidError size={24} />
            {error}
          </span>
        )}
        <button type="submit" disabled={email == "" || password == ""}>
          Login
        </button>
        <span className={styles.register}>
          Don&apos;t have an account?&nbsp;
          <Link href="/register">Register here</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
