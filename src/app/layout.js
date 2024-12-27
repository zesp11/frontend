import "./globals.css";
export const metadata = {
  title: "GoAdventure",
  description: "Create your own real life adventure!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
