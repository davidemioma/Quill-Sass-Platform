import "./globals.css";

import Navbar from "@/components/nav/Navbar";
import { Nunito_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn, constructMetadata } from "@/lib/utils";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata = constructMetadata();

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
          <Toaster />

          <Navbar />

          <div className="px-2.5 md:px-0">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
