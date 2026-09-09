import type { Metadata } from "next";
import "./globals.css";
import { XRayProvider } from "@/components/xray-provider";

export const metadata: Metadata = {
  title: "Compound — the founder's view",
  description:
    "A working product surface and the operating philosophy underneath it. An independent study of the compound-startup thesis, built as software.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-50 text-ink antialiased">
        <XRayProvider>{children}</XRayProvider>
      </body>
    </html>
  );
}
