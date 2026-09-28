import "@/app/globals.css";
import { StoreProvider } from "@/components/StoreContext";
import Shell from "@/components/Shell";

export const metadata = {
  title: "Brico Dab Zarzis | Quincaillerie en ligne en Tunisie",
  description: "Brico Dab Zarzis : quincaillerie, outillage, matériaux de construction, ciment colle Deutsch Color, peinture, plomberie et électricité. Livraison partout en Tunisie, paiement à la livraison.",
  icons: { icon: "/assets/img/favicon.svg" }
};

export const viewport = { themeColor: "#f5c518" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@700;800&family=Cairo:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
