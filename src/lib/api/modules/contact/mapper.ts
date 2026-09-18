import type {
  ContactSubmitApi,
  ContactSubmitRequest,
  ContactSubmitViewModel,
} from "@/lib/api/modules/contact/types";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function mapContactRequest(input: {
  name: string;
  phone: string;
  email?: string;
  websiteCategoryId?: number;
  message?: string;
}): ContactSubmitRequest {
  let phone = input.phone.trim();
  let countryCode = "+91";

  if (phone.startsWith("+")) {
    const match = phone.match(/^(\+\d{1,4})/);
    if (match) {
      countryCode = match[1];
      phone = phone.slice(match[1].length);
    }
  }

  phone = digitsOnly(phone);

  const payload: ContactSubmitRequest = {
    fullName: input.name.trim(),
    countryCode,
    phone,
  };

  if (input.email?.trim()) payload.email = input.email.trim();
  if (input.websiteCategoryId != null) {
    payload.websiteCategoryId = input.websiteCategoryId;
  }
  if (input.message?.trim()) payload.message = input.message.trim();

  return payload;
}

export function mapContactResponse(
  data: ContactSubmitApi | null | undefined
): ContactSubmitViewModel | null {
  if (!data?.id) return null;
  return { id: String(data.id) };
}
