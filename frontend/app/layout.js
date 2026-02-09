import './globals.css';
import Navbar from '../components/Navbar';
import Container from '../components/Container';
import { ThemeProvider } from '../components/theme-provider';

export const metadata = {
  metadataBase: new URL('https://example.com'),
  title: 'WANG LIN | Ascendant GOD',
  description: 'Personal portfolio of Wang Lin — modern fullstack profile, projects, and contact.',
  openGraph: {
    title: 'WANG LIN | Ascendant GOD',
    description: 'Modern and premium personal portfolio.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <Container className="py-8 sm:py-10">{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
