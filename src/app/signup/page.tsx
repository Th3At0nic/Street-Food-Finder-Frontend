"use client";

import RegisterForm from "@/components/modules/auth/register/RegisterForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {

  const session = useSession();
  const router = useRouter();
  console.log({ session });

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
