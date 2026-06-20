import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Instantiate elegant Google fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://food-net-opal.vercel.app"),
  
  title: {
    default: "FoodNet | Online Food Ordering & Best Food Delivery Near Me",
    template: "%s | FoodNet - Fast Food & Restaurant Delivery App",
  },
  
  description: "Experience effortless online food ordering with FoodNet, your premier food delivery near me. Get hot meals, local specialties like Akabenz & Isombe, and swift service via our interactive restaurant delivery app.",
  
  keywords: [
    "online food ordering",
    "food delivery near me",
    "restaurant delivery app",
    "FoodNet Rwanda",
    "order food online",
    "fast kitchen delivery",
    "Kirehe Rwanda food delivery",
    "traditional food delivery near me",
    "Akabenz cooking live",
    "interactive food streaming",
    "best local restaurant app",
    "Kigali food delivery",
  ],
  
  authors: [{ name: "FoodNet Culinary Team" }],
  creator: "FoodNet",
  publisher: "FoodNet Rwanda",
  
  alternates: {
    canonical: "./",
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://food-net-opal.vercel.app",
    title: "FoodNet | Online Food Ordering & Food Delivery Near Me",
    description: "Craving hot food? Order on FoodNet—the top-rated restaurant delivery app. Stream traditional cooking recipes live, chat with master chefs, and get meals delivered to your doorstep in minutes.",
    siteName: "FoodNet",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "FoodNet - Express Food Delivery and Video Live Cooking App",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "FoodNet | Online Food Ordering & Restaurant Delivery App",
    description: "Craving delicious dishes? Use FoodNet, your ultimate restaurant delivery app for instant food delivery near you.",
    images: ["/logo.png"],
    creator: "@FoodNet",
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-sans bg-[#fdfaf6] text-gray-950">
        {children}
      </body>
    </html>
  );
}
