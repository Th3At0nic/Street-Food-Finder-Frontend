"use client";

import RegisterForm from "@/components/modules/auth/register/RegisterForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {

  const { data: userData, status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    if (userData.user.role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else {
      router.push('/home')
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
