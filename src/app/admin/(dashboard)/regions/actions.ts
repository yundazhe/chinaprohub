"use server";

import { makeSaveHandler, deleteRow } from "@/lib/crud-factory";
import { REGIONS } from "@/app/admin/entities";

const saveHandler = makeSaveHandler(REGIONS);

export async function save(fd: FormData): Promise<{ ok?: boolean; err?: string }> {
  return saveHandler(fd);
}

export async function remove(id: string): Promise<{ err?: string }> {
  return deleteRow(REGIONS, id);
}
