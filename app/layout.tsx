import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ProvidersWrapper from "./ProvidersWrapper";
import CommandPalette from "@/components/search/command-palette";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const APP_URL = process.env.NEXTAUTH_URL ?? "https://task.nvdy.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Taskly — Smart Task Management",
    template: "%s | Taskly",
  },
  description:
    "Taskly is a full-stack task manager with Google Calendar sync, priority tracking, analytics, and ⌘K search — all in one clean dark UI.",
  keywords: ["task manager", "productivity", "google calendar", "todo", "nextjs"],
  authors: [{ name: "Taskly" }],

  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Taskly",
    title: "Taskly — Smart Task Management",
    description:
      "Manage tasks with priority, due dates, Google Calendar sync, and an analytics dashboard.",
    images: [
      {
        url: "/taskly.png",
        width: 1200,
        height: 630,
        alt: "Taskly — Task Management App",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Taskly — Smart Task Management",
    description:
      "Manage tasks with priority, due dates, Google Calendar sync, and an analytics dashboard.",
    images: ["/taskly.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/taskly.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProvidersWrapper>
          {children}
          <CommandPalette />
        </ProvidersWrapper>
      </body>
    </html>
  );
}
