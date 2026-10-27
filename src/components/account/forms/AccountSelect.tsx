"use client";

import { useId, useMemo } from "react";
import Select, { type SingleValue } from "react-select";
import { AccountFieldShell } from "./AccountFieldShell";
import {
  accountReactSelectTheme,
  createAccountReactSelectStyles,
} from "./accountReactSelectStyles";

type Option = { value: string; label: string };

type AccountSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function AccountSelect({
  id,
  label,
  value,
  onChange,
  options,
  required,
  error,
  helperText,
  placeholder = "Select",
  disabled,
}: AccountSelectProps) {
  const reactId = useId();
  const styles = useMemo(
    () => createAccountReactSelectStyles<Option, false>(Boolean(error)),
    [error]
  );
  const selected = options.find((o) => o.value === value) ?? null;
  const portalTarget =
    typeof document !== "undefined" ? document.body : undefined;

  return (
    <AccountFieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <Select<Option, false>
        inputId={id}
        instanceId={`${id}-${reactId}`}
        aria-label={label}
        options={options}
        value={selected}
        onChange={(opt: SingleValue<Option>) => onChange(opt?.value ?? "")}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable
        isClearable={false}
        menuPlacement="auto"
        menuPortalTarget={portalTarget}
        menuPosition="fixed"
        theme={accountReactSelectTheme}
        styles={styles}
        classNamePrefix="account-select"
      />
    </AccountFieldShell>
  );
}
