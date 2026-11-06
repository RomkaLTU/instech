import type { Metadata } from "next";
import Link from "next/link";
import { PremiumCalculator } from "./premium-calculator";

export const metadata: Metadata = {
  title: "Car insurance calculator",
  description: "Estimate an illustrative monthly car insurance premium.",
};

export default function CalculatorPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 sm:px-6 sm:py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <Link
          href="/"
          className="self-start rounded-sm text-sm/6 font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus-visible:outline-zinc-50"
        >
          ← Back to welcome page
        </Link>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-zinc-950 dark:text-zinc-50">
            Car insurance calculator
          </h1>
          <p className="text-base/7 text-pretty text-zinc-600 dark:text-zinc-400">
            Enter the car value and the driver&apos;s age to see an estimated monthly premium. Prices
            are illustrative examples only and are not an insurance quote.
          </p>
          <p className="text-sm/6 text-pretty text-zinc-600 dark:text-zinc-400">
            Driver age 18–100 in whole years; car value €1–€1,000,000 in whole euros.
          </p>
        </div>
        <PremiumCalculator />
      </main>
    </div>
  );
}
