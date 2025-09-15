'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ApolloProvider } from '@apollo/client/react';
import { SessionProvider } from 'next-auth/react';
import { apolloClient } from '@/lib/apollo-client';
import { theme } from '@/lib/theme';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
