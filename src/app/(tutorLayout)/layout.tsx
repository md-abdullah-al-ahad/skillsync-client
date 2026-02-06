export default function TutorLayout({
  children,
  tutor,
}: {
  children: React.ReactNode;
  tutor: React.ReactNode;
}) {
  return <>{tutor || children}</>;
}
