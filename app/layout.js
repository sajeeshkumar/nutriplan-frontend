import "./globals.css";

export const metadata = {
  title: "Nutrition Plan Generator App",
  description: "Nutrition plan generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Nutrition Plan Generator</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2024 KodingKrafters Inc.</p>
        </footer>
      </body>
    </html>
  );
}
