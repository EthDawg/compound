import { notFound } from "next/navigation";
import { INSTANCE_SKINS, skinById } from "@/lib/vendors/skins";
import { VendorShell } from "@/components/vendor/shell";

export function generateStaticParams() { return INSTANCE_SKINS.map((s) => ({ vendor: s.id })); }

export async function generateMetadata({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const s = skinById(vendor);
  return { title: s ? `${s.name} — a design study` : "Instance" };
}

export default async function Instance({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const skin = skinById(vendor);
  if (!skin || skin.id === "rippling") notFound();
  return <VendorShell skin={skin} />;
}
