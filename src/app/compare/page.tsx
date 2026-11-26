import type { Metadata } from "next";
import { Compare } from "@/components/Compare";

export const metadata: Metadata = {
  title: "Compare two cloud services side by side",
  description:
    "Pick any two services from AWS, Google Cloud or Azure and compare them side by side: what each does, the pros and cons, and the gotchas.",
  alternates: { canonical: "/compare" },
  openGraph: { title: "Compare two cloud services side by side · samebut", url: "/compare" },
};

export default function ComparePage() {
  return <Compare />;
}
