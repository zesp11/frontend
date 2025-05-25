import NavbarSwitcher from "@/components/clientSideComponents/creator/navBarSwitcher";

export default function Layout({ children }) {
  return (
    <>
      <NavbarSwitcher />
      {children}
    </>
  );
}
