import "../globals.css";

export const metadata = {
  title: "ChinaProHub 后台",
};

// 后台区域为中文单语言，不走 [locale] 前缀路由；
// 根 layout 是透传、<html> 由 [locale]/layout 提供，因此 /admin 段需自带 html/body。
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
