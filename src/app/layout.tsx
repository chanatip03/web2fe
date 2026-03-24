import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import UniversalThemeProvider from "@/components/providers/mui/UniversalThemeProvider";
import appIcon from "./WLogo.png";
import { AuthProvider } from "./authcontext";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WEB2",
  icons: {
    icon: appIcon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoThai.variable}>
      <body className="antialiased">
        <UniversalThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </UniversalThemeProvider>
      </body>
    </html>
  );
}
