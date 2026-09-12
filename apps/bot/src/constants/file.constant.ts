import { join } from "@std/path";

export const UNKNOWN_IMAGE_ATTACHMENT_NAME = "unknown.png";
export const UNKNOWN_IMAGE_ATTACHMENT_URL = `attachment://${UNKNOWN_IMAGE_ATTACHMENT_NAME}`;
export const UNKNOWN_IMAGE_PATH = join(import.meta.dirname ?? "", `../../assets/${UNKNOWN_IMAGE_ATTACHMENT_NAME}`);