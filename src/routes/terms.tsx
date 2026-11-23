import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { TERMS_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/terms")({
  head: () => policyHead(TERMS_POLICY),
  component: () => <PolicyPage policy={TERMS_POLICY} />,
});
