import Navbar from "@/components/generalComponents/navBar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
