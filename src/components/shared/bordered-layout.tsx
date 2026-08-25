export function BorderedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-4 border border-gray-200 mt-6 bg-white rounded-md">
      {children}
    </div>
  );
}
