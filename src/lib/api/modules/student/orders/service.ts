import { apiGet, apiPost } from "@/lib/api/client";
import { mapOrderAddons } from "@/lib/api/modules/addons/mapper";
import type { OrderAddonApi } from "@/lib/api/modules/addons/types";
import { buildApiQuery } from "@/lib/api/query";
import type {
  AccountOrder,
  AccountOrderStatus,
  AccountPaymentStatus,
} from "@/lib/account/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import { websiteCategoryHeaders } from "@/lib/api/website-category";

interface OrderItemApi {
  title?: string;
  packageTitle?: string;
  package?: { bannerImageUrl?: string | null; slug?: string } | null;
  course?: { bannerImageUrl?: string | null } | null;
  listPrice?: number | null;
  salePrice?: number | null;
  payableAmount?: number;
  /** `ASSIGNED` | `FAILED` | … */
  graphyAssignStatus?: string | null;
  addons?: OrderAddonApi[] | null;
}

interface OrderApi {
  id: number | string;
  orderNumber?: string;
  status?: string;
  payableAmount?: number;
  subtotalAmount?: number;
  discountAmount?: number;
  paidAt?: string | null;
  createdAt?: string;
  items?: OrderItemApi[];
  invoices?: Array<{
    invoiceNumber?: string;
    pdfUrl?: string | null;
  }>;
  payments?: Array<{
    status?: string;
  }>;
}

interface OrdersDataApi {
  items?: OrderApi[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

function mapOrderStatus(status: string | undefined): AccountOrderStatus {
  switch ((status || "").toUpperCase()) {
    case "PAID":
    case "FREE":
      return "completed";
    case "PENDING":
      return "pending";
    case "FAILED":
    case "CANCELLED":
      return "expired";
    default:
      return "pending";
  }
}

function mapPaymentStatus(
  orderStatus: string | undefined,
  payments: OrderApi["payments"]
): AccountPaymentStatus {
  const payment = payments?.[0]?.status?.toUpperCase();
  if (payment === "CAPTURED") return "paid";
  if (payment === "FAILED") return "failed";
  const status = (orderStatus || "").toUpperCase();
  if (status === "PAID" || status === "FREE") return "paid";
  if (status === "FAILED") return "failed";
  return "pending";
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function mapStudentOrder(order: OrderApi): AccountOrder {
  const first = order.items?.[0];
  const title =
    first?.title ||
    first?.packageTitle ||
    order.orderNumber ||
    "Order";
  const status = mapOrderStatus(order.status);
  const paymentStatus = mapPaymentStatus(order.status, order.payments);
  const orderItems = order.items ?? [];
  const addons = orderItems.flatMap((item) => mapOrderAddons(item.addons));
  // Buying add-ons for an owned package zeroes every package price.
  const addonsOnly =
    addons.length > 0 &&
    orderItems.every((item) => item.listPrice === 0 && item.salePrice === 0);
  const deliveryFailed =
    paymentStatus === "paid" &&
    orderItems.some(
      (item) => (item.graphyAssignStatus || "").toUpperCase() === "FAILED"
    );

  return {
    id: String(order.id),
    orderNumber: order.orderNumber || String(order.id),
    title,
    productType: "course",
    purchasedAt: order.paidAt || order.createdAt || "",
    purchasedAtLabel: formatDate(order.paidAt || order.createdAt),
    status,
    statusLabel: (order.status || status).replace(/_/g, " "),
    paymentStatus,
    paymentStatusLabel:
      paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1),
    amount: typeof order.payableAmount === "number" ? order.payableAmount : 0,
    thumbnail:
      first?.package?.bannerImageUrl ||
      first?.course?.bannerImageUrl ||
      COURSE_IMAGE_FALLBACK,
    href: order.invoices?.[0]?.pdfUrl || undefined,
    addons,
    addonsOnly,
    deliveryFailed,
  };
}

export async function getStudentOrders(
  accessToken: string,
  page = 1,
  limit = 20,
  websiteCategoryId?: number | string | null
): Promise<{ items: AccountOrder[]; totalPages: number; page: number }> {
  const qs = buildApiQuery({ page, limit });
  const data = await apiGet<OrdersDataApi>(
    `api/website/student/orders${qs}`,
    {
      accessToken,
      cache: "no-store",
      headers: websiteCategoryHeaders(websiteCategoryId),
    }
  );
  return {
    items: (data.items ?? []).map(mapStudentOrder),
    page: data.pagination?.page ?? page,
    totalPages: data.pagination?.totalPages ?? 1,
  };
}

/** Repeats only what failed. 409 = refunded or access removed. */
export async function retryOrderFulfillment(
  accessToken: string,
  orderId: string
): Promise<void> {
  await apiPost<unknown, Record<string, never>>(
    `api/website/student/orders/${encodeURIComponent(orderId)}/retry-fulfill`,
    {},
    { accessToken, headers: websiteCategoryHeaders() }
  );
}
