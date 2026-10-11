import { describe, it, expect } from "vitest";
import { mergeLocks, extractValues } from "./crud-factory";

describe("mergeLocks", () => {
  it("adds new, keeps old, unique", () => {
    expect(mergeLocks(["name_es"], ["name_es", "name_fr"])).toEqual(["name_es", "name_fr"]);
  });
  it("preserves old locks absent from new", () => {
    expect(mergeLocks(["description_ar"], ["name_en"])).toEqual(["description_ar", "name_en"]);
  });
  it("handles empty inputs", () => {
    expect(mergeLocks([], [])).toEqual([]);
  });
});

describe("extractValues", () => {
  it("separates data and lock fields", () => {
    const fd = new FormData();
    fd.set("id", "x1");
    fd.set("name_zh", "义乌");
    fd.set("lock_name_en", "on");
    fd.set("name_en", "Yiwu");
    const { values, locks, id } = extractValues(fd);
    expect(values).toEqual({ name_zh: "义乌", name_en: "Yiwu" });
    expect(locks).toEqual(["name_en"]);
    expect(id).toBe("x1");
  });
  it("id is null when absent and empty values dropped from locks", () => {
    const fd = new FormData();
    fd.set("name_zh", "a");
    const { values, locks, id } = extractValues(fd);
    expect(id).toBeNull();
    expect(locks).toEqual([]);
    expect(values).toEqual({ name_zh: "a" });
  });
  it("collects multiple lock_ checkboxes", () => {
    const fd = new FormData();
    fd.set("lock_name_es", "on");
    fd.set("lock_description_fr", "on");
    const { locks, values } = extractValues(fd);
    expect(locks).toEqual(["name_es", "description_fr"]);
    expect(values).toEqual({});
  });
});
