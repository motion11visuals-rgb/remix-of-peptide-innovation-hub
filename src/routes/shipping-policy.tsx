import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/site/PolicyPage";
import { SHIPPING_POLICY } from "@/lib/policy-content";

export const Route = createFileRoute("/shipping-policy")({
  head: () => policyHead(SHIPPING_POLICY),
  component: () => <PolicyPage policy={SHIPPING_POLICY} />,
});
