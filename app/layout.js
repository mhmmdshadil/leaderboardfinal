import { Anton, Dancing_Script, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

const anton = Anton({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-anton',
});

const dancingScript = Dancing_Script({
    subsets: ['latin'],
    variable: '--font-dancing',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata = {
    title: "Kalastra Arts Fest Leaderboard",
    description: "Live scores for Kalastra Arts Fest",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${anton.variable} ${dancingScript.variable} ${inter.variable} font-sans antialiased bg-white`}
            >
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
