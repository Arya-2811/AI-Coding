export async function health(): Promise<boolean> {
  try {
    const res = await fetch("/health", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getJSON<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
