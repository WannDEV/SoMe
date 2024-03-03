"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";

export default function Home() {
  const { user } = useAuth();
  console.log(user);

  return (
    <main>
      <div>
        {!user && (
          <div>
            <p>You are not logged in</p>
            <LoginForm />
            <RegisterForm />
          </div>
        )}
        <h1>Welcome to the Home page</h1>
        {user && (
          <div>
            <h2>User details</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Registration date: {user.registrationDate}</p>
          </div>
        )}
      </div>
    </main>
  );
}
