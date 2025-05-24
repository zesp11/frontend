import NavBar from "@/components/generalComponents/NavBar";

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
