"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "./loginValidation";
import { FcGoogle } from "react-icons/fc";
import config from "@/config";
import Logo from "@/components/shared/Logo";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        // Redirect to dashboard or home page after successful login
        router.push("/admin");
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };
  const handleAdminLogin = async (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        // Redirect to dashboard or home page after successful login
        router.push("/admin");
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-xl flex-grow max-w-md w-full p-5">
      <div className="flex justify-center items-center flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-orange-600 font-bold text-xl"
        >
          <Logo className="w-8 h-8" />
          StreetBites
        </Link>
        <div className="flex lg:flex-row md:flex-row flex-col gap-1 lg:gap-2 md:gap-2">
          <Button
            className="cursor-pointer"
            onClick={() => handleAdminLogin("admin@gmail.com", "AdminPassword")}
          >
            Admin Login
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => handleAdminLogin("alam12@gmail.com", "alamalam")}
          >
            Premium User Login
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => handleAdminLogin("shuvo@gmail.com", "shuvo@gmail")}
          >
            {" "}
            User Login
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4 my-4">
        <div>
          <h1 className="text-xl font-semibold">Login</h1>
          <p className="font-extralight text-sm text-gray-600">Welcome back!</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-5 w-full bg-orange-600 hover: hover:text-orange-600 cursor-pointer"
          >
            {isSubmitting ? "Logging...." : "Login"}
          </Button>
        </form>
        <div className="my-4 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
        <Button
          onClick={() =>
            signIn("google", {
              callbackUrl: `${config.public_url}/${redirect || "admin"}`,
            })
          }
          variant="outline"
          className="w-full"
        >
          <FcGoogle />
          Login with Google
        </Button>
      </Form>
      <p className="text-sm text-gray-600 text-center my-3">
        {"Don't have an account? "}
        <Link href="/signup" className="text-primary">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
