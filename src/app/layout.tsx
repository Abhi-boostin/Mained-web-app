import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mained - Music Discovery & Player",
  description: "Discover and play your favorite music with lyrics, recommendations, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
