import NavBar from "../../components/navbar";
import "./globals.css";
export const metadata = {
  title: "GoAdventure",
  description: "Create your own real life adventure!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <nav>
          <NavBar />
        </nav>
        {children}
      </body>
    </html>
  );
}
