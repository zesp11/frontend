import "./globals.css";
import NavbarSwitcher from "@/clientComponents/navBarSwitcher";
export const metadata = {
  title: "GoAdventure",
  description: "Create your own real life adventure!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <nav>
          <NavbarSwitcher />
        </nav>
        {children}
      </body>
    </html>
  );
}
