import { PocketChrome } from "@/components/pocket-ui";

export const metadata = {
  title: "Compound Pocket",
  description: "Three flagship flows on one employee graph: onboard, offboard, ask.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PocketChrome>{children}</PocketChrome>;
}
