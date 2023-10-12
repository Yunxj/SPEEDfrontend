"use client";
import ModeratorReview from "@/app/ModeratorReview/page";

export default function Home() {
  return <ModeratorReview {...{ isAll: true }}></ModeratorReview>;
}
