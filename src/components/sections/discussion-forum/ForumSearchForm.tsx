import { Search } from "lucide-react";

type ForumSearchFormProps = {
  /** Page the GET form submits to (keeps the result URL shareable). */
  action: string;
  defaultValue?: string;
  placeholder: string;
  /** Extra params to keep (e.g. current sort). */
  hidden?: Record<string, string>;
};

/** Plain GET search form — works without JS, maps to the API `search` param. */
export function ForumSearchForm({
  action,
  defaultValue = "",
  placeholder,
  hidden,
}: ForumSearchFormProps) {
  return (
    <form action={action} method="get" role="search" className="flex min-w-0 flex-1 gap-2">
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{placeholder}</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-body-sm text-neutral-900 placeholder:text-neutral-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </label>
      <button
        type="submit"
        className="h-9 shrink-0 rounded-lg border border-orange-500 bg-orange-500 px-3 text-body-sm font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Search
      </button>
    </form>
  );
}
