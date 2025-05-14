"use client";
import { usePathname } from "next/navigation";
import CreatorNavBar from "@/components/clientSideComponents/creator/creatorNavBar";
import NavBar from "@/components/generalComponents/navbar";

//Component which determines which navbar should be rendered. It has to be on client side, because of usePathname hook.
export default function NavbarSwitcher() {
  const pathname = usePathname();
  return pathname.endsWith("/creator") ? (
    <CreatorNavBar />
  ) : (
    !pathname.startsWith("/creator") && <NavBar />
  );
}
