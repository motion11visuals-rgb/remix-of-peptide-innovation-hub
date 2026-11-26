import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { SHIPPING_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/shipping-policy")({
  staticData: { sitemap: true },
  head: () => policyHead(SHIPPING_POLICY, "/shipping-policy"),
  component: () => <PolicyPage policy={SHIPPING_POLICY} />,
});
