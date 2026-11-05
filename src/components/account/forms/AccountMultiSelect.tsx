"use client";

import { useId, useMemo } from "react";
import Select, {
  components,
  type MultiValue,
  type OptionProps,
  type MenuListProps,
} from "react-select";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountFieldShell } from "./AccountFieldShell";
import {
  accountReactSelectTheme,
  createAccountReactSelectStyles,
} from "./accountReactSelectStyles";

export type AccountMultiSelectOption = { value: string; label: string };

type AccountMultiSelectProps = {
  id?: string;
  label: string;
  options: AccountMultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  /** When true, shows a Select all option at the top. */
  selectAll?: boolean;
  selectAllLabel?: string;
  className?: string;
};

function OptionWithCheck(
  props: OptionProps<AccountMultiSelectOption, true>
) {
  return (
    <components.Option {...props}>
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
            props.isSelected
              ? "border-[#f97316] bg-[#f97316] text-white"
              : "border-[#e5e5e5]"
          )}
          aria-hidden
        >
          {props.isSelected ? <Check className="h-3 w-3" /> : null}
        </span>
        <span className="min-w-0">{props.label}</span>
      </span>
    </components.Option>
  );
}

export function AccountMultiSelect({
  id: idProp,
  label,
  options,
  value,
  onChange,
  required,
  error,
  helperText,
  placeholder = "Select",
  disabled,
  selectAll = true,
  selectAllLabel = "Select all",
  className,
}: AccountMultiSelectProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const styles = useMemo(
    () =>
      createAccountReactSelectStyles<AccountMultiSelectOption, true>(
        Boolean(error)
      ),
    [error]
  );

  const selected = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const allSelected =
    options.length > 0 && options.every((o) => value.includes(o.value));

  function MenuListWithSelectAll(
    props: MenuListProps<AccountMultiSelectOption, true>
  ) {
    return (
      <components.MenuList {...props}>
        {selectAll && options.length > 0 ? (
          <button
            type="button"
            className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-body-sm font-medium text-[#404040] transition-colors hover:bg-[#fff3e8] hover:text-[#f97316]"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(allSelected ? [] : options.map((o) => o.value));
            }}
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                allSelected
                  ? "border-[#f97316] bg-[#f97316] text-white"
                  : "border-[#e5e5e5]"
              )}
              aria-hidden
            >
              {allSelected ? <Check className="h-3 w-3" /> : null}
            </span>
            {selectAllLabel}
          </button>
        ) : null}
        {props.children}
      </components.MenuList>
    );
  }

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
      <div className={cn("w-full", className)}>
        <Select<AccountMultiSelectOption, true>
          inputId={id}
          instanceId={`${id}-${autoId}`}
          aria-label={label}
          options={options}
          value={selected}
          onChange={(opts: MultiValue<AccountMultiSelectOption>) =>
            onChange(opts.map((o) => o.value))
          }
          placeholder={placeholder}
          isDisabled={disabled}
          isMulti
          isSearchable
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          menuPlacement="auto"
          menuPortalTarget={portalTarget}
          menuPosition="fixed"
          theme={accountReactSelectTheme}
          styles={styles}
          classNamePrefix="account-multi-select"
          components={{
            Option: OptionWithCheck,
            MenuList: MenuListWithSelectAll,
          }}
        />
      </div>
    </AccountFieldShell>
  );
}
