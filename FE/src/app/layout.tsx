import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import GoogleAnalytics from "../components/Googleanalytics";
import Head from "next/head";
import MaintenancePage from "./bao-tri/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quốc Lâm Tự",
  description: "Xem phim sex miễn phí, top phim sex không che, phim sex hay",
  icons: {
    icon: "/favicon.png", // favicon ở public/favicon.png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  if(isMaintenanceMode){
    return(
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <MaintenancePage /> 
      </body>
    </html>
    )
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col `}
      ><Navbar />
      <GoogleAnalytics />
        <main className="flex-1">   
          {children}
          {/* <Banner /> */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
