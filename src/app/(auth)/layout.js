import Navbar from "@/components/generalComponents/NavBar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
