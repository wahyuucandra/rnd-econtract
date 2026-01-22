import type { Metadata } from "next";

import "./globals.css";
import { CameraProvider } from "@/providers/CameraProvider";

export const metadata: Metadata = {
  title: "RND - Liveness Detection",
  description: "Belajar implementasi liveness detection menggunakan face-api.js",
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
