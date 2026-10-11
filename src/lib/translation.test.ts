import { describe, it, expect } from "vitest";
import { fieldsToTranslate, parseLlmJson, slugify, maskSecret } from "./translation";

describe("fieldsToTranslate", () => {
  it("skips filled and locked cols", () => {
    const row = { name_zh: "义乌", name_es: "Ya", name_fr: "", translation_locks: ["name_ru"], description_zh: "x" };
    const cols = fieldsToTranslate(row);
    expect(cols).not.toContain("name_es");
    expect(cols).toContain("name_fr");
    expect(cols).not.toContain("name_ru");
    expect(cols).toContain("description_fr"); // 源描述存在且目标为空
  });
  it("no description source → no description targets", () => {
    expect(fieldsToTranslate({ name_zh: "a" })).toEqual(expect.arrayContaining(["name_es"]));
    expect(fieldsToTranslate({ name_zh: "a" })).not.toEqual(expect.arrayContaining(["description_es"]));
  });
});

describe("parseLlmJson", () => {
  it("strips code fences and parses", () => {
    expect(parseLlmJson('```json\n{"1":{"name_en":"A"}}\n```')).toEqual({ "1": { name_en: "A" } });
  });
  it("throws on garbage", () => {
    expect(() => parseLlmJson("not json")).toThrow();
  });
});

it("slugify", () => {
  expect(slugify("Xuchang Crown Hair Products!")).toBe("xuchang-crown-hair-products");
  expect(slugify("")).toBe("");
});

it("maskSecret", () => {
  expect(maskSecret("sk-abcdefghijklmnop")).toBe("sk-***mnop");
  expect(maskSecret("short")).toBe("***");
});
