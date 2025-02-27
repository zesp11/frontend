import "./globals.css";
import NavbarSwitcher from "@/components/clientSideComponents/creator/navBarSwitcher";
export const metadata = {
  title: "GoTale",
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
