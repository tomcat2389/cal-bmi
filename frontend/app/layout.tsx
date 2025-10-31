import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Secure BMI Calculator",
  description: "Fully privacy-preserving BMI calculation service based on FHEVM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-[#fafafa] relative text-gray-900 antialiased">
        {/* Diagonal Grid with Electric Orange */}
        <div
          className="absolute inset-0 z-0 pointer-events-none min-w-[850px]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <main className="flex flex-col max-w-screen-lg mx-auto pb-20 min-w-[850px] relative z-10">
          <nav className="flex w-full px-3 md:px-0 h-fit py-10 justify-start items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
                Secure BMI Calculator
              </h1>
              <p className="text-sm md:text-base text-neutral-700">
                Fully privacy-preserving BMI calculation service based on FHEVM
              </p>
            </div>
          </nav>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
