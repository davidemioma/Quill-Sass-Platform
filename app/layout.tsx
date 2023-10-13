import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Nunito_Sans } from "next/font/google";
import Providers from "@/components/Providers";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quill",
  description: "Quill Saas Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          font.className
        )}
      >
        <Providers>
          <Navbar />

          {children}
        </Providers>
      </body>
    </html>
  );
}
