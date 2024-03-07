"use client";
import LoginForm from "../../components/Auth/LoginForm";
import Link from "next/link";
import { WithRedirectIfAuthenticated } from "../../components/Auth/WithRedirectIfAuthenticated";

const Login = () => {
  return (
    <>
      <LoginForm />
      <Link href="/register">Register</Link>
    </>
  );
};

export default WithRedirectIfAuthenticated(Login);
