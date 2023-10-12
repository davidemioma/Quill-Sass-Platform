import React from "react";
import Link from "next/link";
import Container from "./Container";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 bg-white/75 h-14 z-30 border-b border-gray-200 backdrop-blur-lg transition-all">
      <Container>
        <div className="h-14 flex items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Quill.</span>
          </Link>

          {/* Add mobile Navbar */}

          <div className="hidden sm:flex items-center gap-4">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>

              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Sign In
              </LoginLink>

              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </RegisterLink>
            </>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
