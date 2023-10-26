import { getUserSubscriptionPlan } from "@/app/actions/getUserSubscriptionPlan";
import BillingForm from "@/components/BillingForm";

export default async function Billing() {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
}
