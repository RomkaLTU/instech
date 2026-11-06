"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type RefObject } from "react";
import {
  formatEuroCents,
  monthlyPremiumCents,
  validatePremiumInput,
  type PremiumErrors,
  type PremiumInput,
} from "@/lib/premium";

const inputClass =
  "block w-full rounded-md bg-white px-3 py-2 text-base text-zinc-950 outline-1 -outline-offset-1 outline-zinc-300 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-950 aria-invalid:outline-red-600 dark:bg-white/5 dark:text-zinc-50 dark:outline-white/15 dark:focus:outline-zinc-50 dark:aria-invalid:outline-red-400";

export function PremiumCalculator() {
  const [input, setInput] = useState<PremiumInput>({ carValue: "", driverAge: "" });
  const [errors, setErrors] = useState<PremiumErrors>({});
  const [premiumCents, setPremiumCents] = useState<number | null>(null);
  const carValueRef = useRef<HTMLInputElement>(null);
  const driverAgeRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as keyof PremiumInput;
    setInput((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPremiumCents(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validatePremiumInput(input);
    if (!result.ok) {
      setErrors(result.errors);
      setPremiumCents(null);
      (result.errors.carValue ? carValueRef : driverAgeRef).current?.focus();
      return;
    }
    setErrors({});
    setPremiumCents(monthlyPremiumCents(result.carValue, result.driverAge));
  }

  return (
    <div className="flex flex-col gap-8">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Field
          id="carValue"
          label="Car value (€)"
          hint="Whole euros from €1 to €1,000,000."
          value={input.carValue}
          error={errors.carValue}
          inputRef={carValueRef}
          onChange={handleChange}
        />
        <Field
          id="driverAge"
          label="Driver's age"
          hint="Whole years from 18 to 100."
          value={input.driverAge}
          error={errors.driverAge}
          inputRef={driverAgeRef}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="h-11 w-full rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 sm:w-auto sm:self-start dark:hover:bg-zinc-300 dark:focus-visible:outline-zinc-50"
        >
          Calculate
        </button>
      </form>

      <div role="status">
        {premiumCents !== null && (
          <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-white/15 dark:bg-white/5">
            <h2 className="text-sm/6 font-medium text-zinc-600 dark:text-zinc-400">
              Estimated monthly premium
            </h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50">
              {formatEuroCents(premiumCents)}
              <span className="text-base font-normal text-zinc-600 dark:text-zinc-400"> per month</span>
            </p>
            <p className="mt-2 text-sm/6 text-zinc-600 dark:text-zinc-400">
              This is an illustrative estimate, not an insurance quote.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

type FieldProps = {
  id: keyof PremiumInput;
  label: string;
  hint: string;
  value: string;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Field({ id, label, hint, value, error, inputRef, onChange }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm/6 font-medium text-zinc-950 dark:text-zinc-50">
        {label} <span className="font-normal text-zinc-600 dark:text-zinc-400">(required)</span>
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        className={inputClass}
      />
      <p id={hintId} className="text-sm/6 text-zinc-600 dark:text-zinc-400">
        {hint}
      </p>
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm/6 font-medium text-red-700 dark:text-red-400">
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="size-4 shrink-0">
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
