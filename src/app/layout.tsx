import type { Metadata } from "next";

import "./globals.css";
import { CameraProvider } from "@/providers/CameraProvider";

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
      <body><CameraProvider>{children}</CameraProvider></body>
    </html>
  );
}
