"use client";
import { usePathname } from "next/navigation";
import CreatorNavBar from "@/components/clientComponents/creatorNavBar";
import NavBar from "@/components/navbar";

//Component which determines which navbar should be rendered. It has to be on client side, because of usePathname hook.
export default function NavbarSwitcher() {
  const pathname = usePathname();

  return pathname.startsWith("/creator") ? <CreatorNavBar /> : <NavBar />;
}
