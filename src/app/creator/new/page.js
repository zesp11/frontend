"use client";
import FlowComponent from "@/components/clientSideComponents/creator/flowComponent";
import SearchField from "@/components/clientSideComponents/creator/searchField";
import { useSearchParams } from "next/navigation";
export default function New() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return (
    <>
      <FlowComponent id={id} />
    </>
  );
}
