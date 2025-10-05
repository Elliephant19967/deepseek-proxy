export const metadata = {
  title: "DeepSeek Proxy",
  description: "Proxy server for DeepSeek API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
