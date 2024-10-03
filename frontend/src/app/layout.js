import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";
import { Pixelify_Sans } from "next/font/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const pixelifySans = Pixelify_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap", // Optional, controls font swapping behavior
});

export const metadata = {
  title: "Pawgress",
  description: "Improve yourself a step at a time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${pixelifySans.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
