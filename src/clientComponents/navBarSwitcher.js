"use client";
import { usePathname } from "next/navigation";
import CreatorNavBar from "@/components/creatorComponents/creatorNavBar";
import NavBar from "@/components/navbar";

export default function NavbarSwitcher() {
  const pathname = usePathname();

  return pathname.startsWith("/creator") ? <CreatorNavBar /> : <NavBar />;
}
