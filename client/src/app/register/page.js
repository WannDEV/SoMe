"use client";
import RegisterForm from "../../components/Auth/RegisterForm";
import Link from "next/link";
import { withRedirectIfAuthenticated } from "../../components/Auth/withRedirectIfAuthenticated";

const Register = () => {
  return (
    <>
      <RegisterForm />
      <Link href="/login">Login</Link>
    </>
  );
};

export default withRedirectIfAuthenticated(Register);
