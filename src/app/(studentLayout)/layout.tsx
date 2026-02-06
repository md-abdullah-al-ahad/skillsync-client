export default function StudentLayout({
  children,
  student,
}: {
  children: React.ReactNode;
  student: React.ReactNode;
}) {
  return <>{student || children}</>;
}
