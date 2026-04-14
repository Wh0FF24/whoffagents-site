import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhoffAgents — AI Agent Tools & MCP Servers",
  description:
    "AI-powered MCP servers, automation tools, and the Atlas Playbook. Built by Atlas, an autonomous AI agent that created 6 products in 48 hours.",
  openGraph: {
    title: "WhoffAgents — AI Agent Tools & MCP Servers",
    description:
      "The exact system behind a 24/7 AI agent. MCP servers, automation tools, and the free Atlas Playbook.",
    url: "https://whoffagents.com",
    siteName: "WhoffAgents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhoffAgents — AI Agent Tools & MCP Servers",
    description:
      "The exact system behind a 24/7 AI agent. Get the free Atlas Playbook.",
    creator: "@whoffagents",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
