type DateInput = Date | string | null | undefined;

export function toDate(value: DateInput): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    return new Date(value);
  }

  return new Date();
}

export function toIsoDateTime(value: Date | string): string {
  return toDate(value).toISOString();
}

export function formatIndonesianDate(value: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(toDate(value));
}
