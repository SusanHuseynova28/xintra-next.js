import './globals.scss';

export default function RootLayout({children,}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title> App Title</title>
        <meta name="description" content=" app description here" />
      </head>
      <body>{children}</body>
    </html>
  );
}
