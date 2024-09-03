import "./globals.css";
import NavigationLinks from "@/app/ui/navigation-links";
import { Provider } from "@/components/Provider/Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
    <body className="h-full">
    <>
        <div className="min-h-full">
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <Provider>
                        <NavigationLinks />
                        {children}
                    </Provider>
                </div>
            </main>
        </div>
    </>
    </body>
    </html>
  );
}
