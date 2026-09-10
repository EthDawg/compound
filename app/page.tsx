import { Atlas } from "@/components/atlas";

export const metadata = {
  title: "Atlas — the software board, drawn four ways",
  description:
    "Ten sectors, forty-odd categories and a hundred-plus vendors, plotted under four incompatible definitions of relevance. Zoom from sector to category to vendor.",
};

export default function Page() {
  return <Atlas />;
}
