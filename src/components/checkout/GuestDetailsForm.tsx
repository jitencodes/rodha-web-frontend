"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";
import { AccountTextField } from "@/components/account/forms/AccountTextField";
import {
  accountFormSelectTriggerClassName,
  accountInputClassName,
  accountLabelClassName,
} from "@/components/account/forms/accountFieldStyles";
import { StateSelectField } from "@/components/forms/StateSelectField";
import type { PurchaseIdentifyViewModel } from "@/lib/api/modules/auth/types";
import { getGoogleMapsApiKey } from "@/lib/constants";
import {
  EMAIL_MAX_LENGTH,
  isBlockedPhoneKey,
  NAME_MAX_LENGTH,
  PHONE_LENGTH,
  sanitizeNameInput,
  sanitizePhoneInput,
  validateEmail,
  validateIndianMobile,
  validateName,
} from "@/lib/form-validation";
import { detectCurrentState } from "@/lib/geo/detect-current-state";
import { cn } from "@/lib/utils";

export type GuestDetails = {
  fullName: string;
  email: string;
  mobile: string;
  stateId: string;
  stateName: string;
};

export const EMPTY_GUEST_DETAILS: GuestDetails = {
  fullName: "",
  email: "",
  mobile: "",
  stateId: "",
  stateName: "",
};

type FieldErrors = Partial<
  Record<"fullName" | "email" | "mobile" | "stateName", string>
>;

type GuestDetailsFormProps = {
  /** Submitted by the drawer footer button. */
  formId: string;
  packageId: number;
  details: GuestDetails;
  onChange: (patch: Partial<GuestDetails>) => void;
  onPendingChange: (pending: boolean) => void;
  onIdentified: (identity: PurchaseIdentifyViewModel) => void;
};

/** Guest checkout step 1: name, email, mobile and state (auto-detected). */
export function GuestDetailsForm({
  formId,
  packageId,
  details,
  onChange,
  onPendingChange,
  onIdentified,
}: GuestDetailsFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPendingState] = useState(false);
  const [locating, setLocating] = useState(false);
  const stateTouchedRef = useRef(Boolean(details.stateId));
  const detectStartedRef = useRef(false);

  function setPending(next: boolean) {
    setPendingState(next);
    onPendingChange(next);
  }

  function update(patch: Partial<GuestDetails>, field: keyof FieldErrors) {
    onChange(patch);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError("");
  }

  async function detectState(manual: boolean) {
    setLocating(true);
    try {
      const location = await detectCurrentState();
      if (location?.stateId != null && location.stateName) {
        // Never overwrite a state the guest picked while GPS was resolving.
        if (manual || !stateTouchedRef.current) {
          update(
            { stateId: String(location.stateId), stateName: location.stateName },
            "stateName"
          );
        }
      } else if (manual) {
        setErrors((prev) => ({
          ...prev,
          stateName: "We could not find your state. Please select it.",
        }));
      }
    } finally {
      setLocating(false);
    }
  }

  useEffect(() => {
    if (detectStartedRef.current || stateTouchedRef.current) return;
    detectStartedRef.current = true;
    void detectState(false);
    // Runs once when the form opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;

    const next: FieldErrors = {
      fullName: validateName(details.fullName),
      email: validateEmail(details.email),
      mobile: validateIndianMobile(details.mobile),
      stateName: details.stateName ? undefined : "Please select your state.",
    };
    setErrors(next);
    setFormError("");
    if (Object.values(next).some(Boolean)) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/purchase/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: details.fullName,
          email: details.email,
          mobile: details.mobile,
          stateName: details.stateName,
          packageId,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors;
        identity?: PurchaseIdentifyViewModel;
      } | null;
      if (!res.ok || !data?.ok || !data.identity) {
        if (data?.errors) setErrors(data.errors);
        setFormError(data?.error || "Unable to continue right now.");
        return;
      }
      onIdentified(data.identity);
    } catch {
      setFormError("Something went wrong. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id={formId} onSubmit={submit} noValidate className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--account-text)]">
          Your details
        </h3>
        <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
          We use these to set up your course access.
        </p>
      </div>

      <AccountTextField
        id={`${formId}-name`}
        label="Full name"
        value={details.fullName}
        onChange={(value) =>
          update({ fullName: sanitizeNameInput(value) }, "fullName")
        }
        placeholder="Enter your full name"
        maxLength={NAME_MAX_LENGTH}
        required
        disabled={pending}
        error={errors.fullName}
      />
      <AccountTextField
        id={`${formId}-email`}
        label="Email"
        type="email"
        inputMode="email"
        value={details.email}
        onChange={(email) => update({ email }, "email")}
        placeholder="you@example.com"
        maxLength={EMAIL_MAX_LENGTH}
        required
        disabled={pending}
        error={errors.email}
      />
      <div>
        <label htmlFor={`${formId}-mobile`} className={accountLabelClassName}>
          Mobile number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-body text-[var(--account-text-muted)]">
            +91
          </span>
          <input
            id={`${formId}-mobile`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={details.mobile}
            maxLength={PHONE_LENGTH}
            onChange={(e) =>
              update({ mobile: sanitizePhoneInput(e.target.value) }, "mobile")
            }
            onKeyDown={(e) => {
              if (isBlockedPhoneKey(e.key)) e.preventDefault();
            }}
            placeholder="10-digit mobile number"
            disabled={pending}
            aria-invalid={Boolean(errors.mobile)}
            className={cn(accountInputClassName, "!pl-12")}
          />
        </div>
        {errors.mobile ? (
          <p className="mt-1.5 text-caption text-red-500" role="alert">
            {errors.mobile}
          </p>
        ) : null}
      </div>

      <div>
        <StateSelectField
          value={details.stateId}
          onChange={(stateId) => {
            stateTouchedRef.current = true;
            update({ stateId }, "stateName");
          }}
          onSelect={(option) =>
            onChange({ stateName: option?.name || option?.code || "" })
          }
          error={errors.stateName}
          disabled={pending}
          required
          variant="account"
          placeholder={locating ? "Detecting your state…" : "Select your state"}
          triggerClassName={accountFormSelectTriggerClassName}
        />
        {getGoogleMapsApiKey() ? (
          <button
            type="button"
            onClick={() => void detectState(true)}
            disabled={locating || pending}
            className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-[var(--account-accent)] disabled:cursor-wait disabled:opacity-60"
          >
            <LocateFixed className="size-3.5" strokeWidth={1.75} aria-hidden />
            {locating ? "Finding your location…" : "Use current location"}
          </button>
        ) : null}
      </div>

      {formError ? (
        <p className="text-[12px] text-red-500" role="alert">
          {formError}
        </p>
      ) : null}
    </form>
  );
}
