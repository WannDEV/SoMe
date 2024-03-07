"use client";
import RegisterForm from "../../components/Auth/RegisterForm";
import Link from "next/link";
import { WithRedirectIfAuthenticated } from "../../components/Auth/WithRedirectIfAuthenticated";

const Register = () => {
  return (
    <>
      <RegisterForm />
      <Link href="/login">Login</Link>
    </>
  );
};

export default WithRedirectIfAuthenticated(Register);
