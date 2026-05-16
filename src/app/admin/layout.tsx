import type { Metadata } from "next";
import { adminMetadata } from "@/lib/seo";
import "./admin.css";

export const metadata: Metadata = adminMetadata;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
