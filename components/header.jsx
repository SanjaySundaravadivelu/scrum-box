import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";
import { getUser } from "@/actions/getPlan";

async function Header() {
  const user = await getUser();

  await checkUser();

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold" style={{ cursor: "pointer" }}>
            <Image
              src={"/logo2.png"}
              alt="Zscrum Logo"
              width={200}
              height={76}
              className="h-14 w-auto object-contain"
            />
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu user={user} />
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
}

export default Header;
