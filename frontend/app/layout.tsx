import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Counsel OS",
  description: "An agentic product-counsel workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
