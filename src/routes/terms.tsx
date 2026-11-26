import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { TERMS_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => policyHead(TERMS_POLICY, "/terms"),
  component: () => <PolicyPage policy={TERMS_POLICY} />,
});
