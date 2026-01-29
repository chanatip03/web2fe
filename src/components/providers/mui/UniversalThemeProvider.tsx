import ClientThemeProvider from "./ClientThemeProvider";

export default function UniversalThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientThemeProvider>{children}</ClientThemeProvider>;
}
