import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
// import GoogleProvider from "@/components/GoogleProvider";
import GoogleProvider from "../components/GoogleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConceptIdentify",
  description: "AI-supported course concept identification and assessment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* <body className="min-h-full flex flex-col"><AuthProvider>{children}</AuthProvider></body> */}
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-gray-900">
        <GoogleProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </GoogleProvider>
        {/* <AuthProvider>
          {children}
        </AuthProvider> */}
      </body>
    </html>
  );
}
