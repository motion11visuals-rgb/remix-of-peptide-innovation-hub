import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { RESEARCH_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/research-use-only")({
  head: () => policyHead(RESEARCH_POLICY),
  component: () => <PolicyPage policy={RESEARCH_POLICY} />,
});
