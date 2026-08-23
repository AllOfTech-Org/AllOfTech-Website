import { NextResponse } from "next/server";

export function mailJson(status: number, error?: string) {
  if (error) {
    return NextResponse.json({ ok: false, error }, { status });
  }
  return NextResponse.json({ ok: true }, { status });
}
