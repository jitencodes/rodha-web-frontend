import { redirect } from "next/navigation";

/** Cart is replaced by single-package Checkout. */
export default function AccountCartPage() {
  redirect("/account/checkout");
}
