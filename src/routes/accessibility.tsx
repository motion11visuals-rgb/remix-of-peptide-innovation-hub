import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { ACCESSIBILITY_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/accessibility")({
  staticData: { sitemap: true },
  head: () => policyHead(ACCESSIBILITY_POLICY),
  component: () => <PolicyPage policy={ACCESSIBILITY_POLICY} />,
});
