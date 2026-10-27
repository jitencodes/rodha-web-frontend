import type { GroupBase, StylesConfig, ThemeConfig } from "react-select";

const ACCENT = "#f97316";
const ACCENT_SOFT = "#fff3e8";
const TEXT = "#171717";
const TEXT_SECONDARY = "#404040";
const TEXT_MUTED = "#737373";
const BORDER = "#e5e5e5";
const SURFACE = "#ffffff";
const RADIUS = 12;

/** Orange-accent react-select theme for account registration forms. */
export const accountReactSelectTheme: ThemeConfig = (theme) => ({
  ...theme,
  borderRadius: RADIUS,
  colors: {
    ...theme.colors,
    primary: ACCENT,
    primary75: "#fb923c",
    primary50: "#fdba74",
    primary25: ACCENT_SOFT,
    danger: "#dc2626",
    dangerLight: "#fee2e2",
    neutral0: SURFACE,
    neutral5: "#fafafa",
    neutral10: "#f5f5f5",
    neutral20: BORDER,
    neutral30: "#d4d4d4",
    neutral40: TEXT_MUTED,
    neutral50: TEXT_MUTED,
    neutral60: TEXT_SECONDARY,
    neutral70: TEXT_SECONDARY,
    neutral80: TEXT,
    neutral90: TEXT,
  },
});

export function createAccountReactSelectStyles<
  Option,
  IsMulti extends boolean = false,
>(hasError = false): StylesConfig<Option, IsMulti, GroupBase<Option>> {
  return {
    container: (base) => ({
      ...base,
      width: "100%",
      fontSize: "15px",
      lineHeight: 1.6,
    }),
    control: (base, state) => ({
      ...base,
      minHeight: 46,
      borderRadius: RADIUS,
      borderColor: hasError
        ? "#dc2626"
        : state.isFocused
          ? ACCENT
          : BORDER,
      backgroundColor: SURFACE,
      boxShadow: state.isFocused
        ? `0 0 0 2px ${ACCENT}33`
        : "none",
      "&:hover": {
        borderColor: hasError ? "#dc2626" : `${ACCENT}99`,
      },
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? 0.6 : 1,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "6px 12px",
    }),
    placeholder: (base) => ({
      ...base,
      color: TEXT_MUTED,
      margin: 0,
    }),
    singleValue: (base) => ({
      ...base,
      color: TEXT,
      margin: 0,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: ACCENT_SOFT,
      borderRadius: 8,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: ACCENT,
      fontWeight: 500,
      fontSize: "13px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: ACCENT,
      borderRadius: 8,
      ":hover": {
        backgroundColor: ACCENT,
        color: "#ffffff",
      },
    }),
    input: (base) => ({
      ...base,
      color: TEXT,
      margin: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      paddingRight: 6,
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: TEXT_MUTED,
      padding: 6,
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
      transition: "transform 120ms ease",
      ":hover": { color: ACCENT },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: TEXT_MUTED,
      padding: 6,
      ":hover": { color: ACCENT },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: RADIUS,
      border: `1px solid ${BORDER}`,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      overflow: "hidden",
      zIndex: 1100,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 1100,
    }),
    menuList: (base) => ({
      ...base,
      padding: 4,
      maxHeight: 240,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 8,
      padding: "10px 12px",
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? ACCENT_SOFT
        : state.isFocused
          ? ACCENT_SOFT
          : "transparent",
      color: state.isSelected || state.isFocused ? ACCENT : TEXT_SECONDARY,
      fontWeight: state.isSelected ? 600 : 400,
      ":active": {
        backgroundColor: ACCENT_SOFT,
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: TEXT_MUTED,
      fontSize: "13px",
    }),
  };
}
