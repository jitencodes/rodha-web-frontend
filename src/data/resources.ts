/**
 * Resource hub types now live with the listing API module.
 * Listing pages must not read the old static catalog.
 */
export {
  RESOURCE_TYPES,
  RESOURCE_TYPE_LABELS,
  isResourceType,
  type ResourceType,
  type ResourceViewModel,
} from "@/lib/api/modules/resources/types";
