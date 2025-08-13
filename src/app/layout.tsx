import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "File Upload Test",
  description: "File Upload Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
