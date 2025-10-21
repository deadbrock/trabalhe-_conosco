import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/logo-fg.png" />
        <link rel="apple-touch-icon" href="/logo-fg.png" />
      </Head>
      <body className="antialiased text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
