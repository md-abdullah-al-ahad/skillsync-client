export default function AdminLayout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
}) {
  return <>{admin || children}</>;
}
