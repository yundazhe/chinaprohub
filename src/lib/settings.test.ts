import { describe, it, expect } from "vitest";
import { mergeSiteConfig, validateBookingUrl, DEFAULT_SITE_CONFIG } from "./settings";

describe("mergeSiteConfig", () => {
  it("returns defaults when nothing stored", () => {
    expect(mergeSiteConfig(null)).toEqual(DEFAULT_SITE_CONFIG);
  });

  it("applies stored values over defaults", () => {
    const stored = { booking_price: "US$400", booking_url: "https://paypal.me/abc" };
    expect(mergeSiteConfig(stored)).toEqual(stored);
  });

  it("ignores non-string fields", () => {
    expect(mergeSiteConfig({ booking_price: 123, booking_url: null })).toEqual(DEFAULT_SITE_CONFIG);
  });
});

describe("validateBookingUrl", () => {
  it("accepts empty (means mailto fallback)", () => {
    expect(validateBookingUrl("")).toBeUndefined();
    expect(validateBookingUrl(undefined)).toBeUndefined();
  });

  it("accepts http/https URLs", () => {
    expect(validateBookingUrl("https://paypal.me/abc")).toBeUndefined();
    expect(validateBookingUrl("http://example.com/pay")).toBeUndefined();
  });

  it("rejects non-http schemes and garbage", () => {
    expect(validateBookingUrl("javascript:alert(1)")).toBe("链接必须以 http:// 或 https:// 开头");
    expect(validateBookingUrl("not a url")).toBe("链接必须以 http:// 或 https:// 开头");
  });
});
