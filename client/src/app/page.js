"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import LogoutButton from "../components/Auth/LogoutButton";
import { withAuth } from "../components/Auth/WithAuth";

const Home = () => {
  const { user, token } = useAuth();
  console.log(user);

  return (
    <main>
      <div>
        <h1>Welcome to the Home page</h1>
        <div>
          <h2>User details</h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Registration date: {user.registrationDate}</p>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
};

export default withAuth(Home);
