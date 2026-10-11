"use server";

import { makeSaveHandler, deleteRow } from "@/lib/crud-factory";
import { CATEGORIES } from "@/app/admin/entities";

// "use server" 要求导出的是 async 函数声明：工厂结果放模块级 const，导出薄包装。
const saveHandler = makeSaveHandler(CATEGORIES);

export async function save(fd: FormData): Promise<{ ok?: boolean; err?: string }> {
  return saveHandler(fd);
}

export async function remove(id: string): Promise<{ err?: string }> {
  return deleteRow(CATEGORIES, id);
}
