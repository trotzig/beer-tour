import "./globals.css";

export const metadata = {
  title: "Öltouren",
  description: "Ledartavlan för Öltouren på Stockholms Golfklubb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
