import { BackstageShell } from "@/components/backstage-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BackstageShell>{children}</BackstageShell>;
}
