import Header from "@/app/components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 모든 하위 페이지 최상단에 고정적으로 표시됨 */}
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}