import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import '@smastrom/react-rating/style.css'
import { Toaster } from "sonner";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "StreetBite",
  description: "Find all exotic street food places in your city!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={` ${inter.variable} ${poppins.variable} antialiased`}>
        <Toaster richColors position="top-center" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
