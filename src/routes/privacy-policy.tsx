import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { PRIVACY_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/privacy-policy")({
  head: () => policyHead(PRIVACY_POLICY),
  component: () => <PolicyPage policy={PRIVACY_POLICY} />,
});
