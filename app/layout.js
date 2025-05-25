// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";
import Providers from "./providers"; // Make sure the path is correct

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Scrum Box",
  description: "Manage projects with agile efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="animated-dotted-background">
              <Header />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
              <Footer />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
