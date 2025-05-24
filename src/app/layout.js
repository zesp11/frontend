import "./globals.css";

// Separate viewport export as per Next.js recommendation
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata = {
  title: "GoTale",
  description: "Create your own real life adventure!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>{/* Any additional head elements can go here if needed */}</head>
      <body>
        <main className="app-main">{children}</main>
      </body>
    </html>
  );
}
