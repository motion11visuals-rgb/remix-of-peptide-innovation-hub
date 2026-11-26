import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { RETURN_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/return-policy")({
  staticData: { sitemap: true },
  head: () => policyHead(RETURN_POLICY, "/return-policy"),
  component: () => <PolicyPage policy={RETURN_POLICY} />,
});
