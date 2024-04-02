import React, { useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./RegisterForm.module.css";
import Link from "next/link";
import { BiSolidError } from "react-icons/bi";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState({
    general: "",
    username: "",
    email: "",
    password: "",
  });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSuccess = (response) => {
    login(response.data.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("auth/register", {
        username,
        email,
        password,
      });
      onSuccess(response);

      console.log(response.data);
    } catch (err) {
      console.log(err);
      setError({ ...err.response.data });
    }
  };

  const validateUsername = (username) => {
    if (username == "") return "Username is required";
    if (username.length < 4) return "Username must be 4 characters or more";
    const re = /^[a-zA-Z0-9]*$/;
    if (!re.test(username))
      return "Username must contain only letters and numbers";
    return "";
  };

  const validateEmail = (email) => {
    if (email == "") return "Email is required";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Invalid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (password == "") return "Password is required";
    const re = /\S{8,}/;
    if (!re.test(password)) return "Password must be 8 characters or more";
    const re2 = /[A-Z]/;
    if (!re2.test(password))
      return "Password must contain at least one uppercase letter";
    const re3 = /[a-z]/;
    if (!re3.test(password))
      return "Password must contain at least one lowercase letter";
    const re4 = /\d/;
    if (!re4.test(password)) return "Password must contain at least one number";
    return "";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span>Be</span>Social
      </h1>
      <hr />
      <h2 className={styles.formTitle}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="JohnDoe"
            className={`${styles.fieldInput} ${
              error.username && styles.fieldError
            }`}
            onBlur={(e) =>
              setError({ ...error, username: validateUsername(e.target.value) })
            }
          />
          {error.username && (
            <span className={styles.errorSpecific}>{error.username}</span>
          )}
          <br />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your@email.com"
            className={`${styles.fieldInput} ${
              error.email && styles.fieldError
            }`}
            onBlur={(e) =>
              setError({ ...error, email: validateEmail(e.target.value) })
            }
          />
          {error.email && (
            <span className={styles.errorSpecific}>{error.email}</span>
          )}
          <br />
        </div>
        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="********"
            className={`${styles.fieldInput} ${
              error.password && styles.fieldError
            }`}
            onBlur={(e) =>
              setError({ ...error, password: validatePassword(e.target.value) })
            }
          />
          {error.password && (
            <span className={styles.errorSpecific}>{error.password}</span>
          )}
          <br />
        </div>
        {error.general && (
          <span className={styles.error}>
            <BiSolidError size={24} />
            {error.general}
          </span>
        )}
        <button
          type="submit"
          disabled={username == "" || email == "" || password == ""}
        >
          Register
        </button>
        <span className={styles.login}>
          Already have an account?&nbsp;
          <Link href="/login">Login here</Link>
        </span>
      </form>
    </div>
  );
};

export default RegisterForm;
