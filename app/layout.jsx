import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kasana Watches | Timeless Elegance",
  description: "Discover luxury timepieces for men, women, and couples.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <CartProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  );
}
