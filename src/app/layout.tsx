import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Navbar from "./components/Navbar";
import AuthProvider from "./components/AuthProvider";
import QueryWrapper from "./components/QueryWrapper";
import Search from "./components/Search";
import { headers } from "next/headers";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X clone",
  description: "X clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          <QueryWrapper>
            <div className="grid grid-cols-12 md:px-20 justify-center">
              <Navbar />
              {children}
              <Search />
            </div>
          </QueryWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
