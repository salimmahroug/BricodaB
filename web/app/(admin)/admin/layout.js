import "@/app/admin.css";
import { AdminProvider } from "@/components/admin/AdminContext";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Tableau de bord — Brico Dab Zarzis",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/img/favicon.svg" }
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AdminProvider>
          <AdminShell>{children}</AdminShell>
        </AdminProvider>
      </body>
    </html>
  );
}
