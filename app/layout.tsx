import type { Metadata, Viewport } from "next";
import "./globals.css";
import { XRayProvider } from "@/components/xray-provider";
import { PWARegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "Compound — a field guide to technology",
  description:
    "Explore technology companies, delivery ecosystems, global dependencies and the ideas behind them. An independent, interactive field guide.",
  applicationName: "Compound",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Compound",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-50 text-ink antialiased">
        <XRayProvider>{children}</XRayProvider>
        <PWARegister />
      </body>
    </html>
  );
}
