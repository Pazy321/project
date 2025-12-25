
export function jsonPayload<T>(payload: T): RequestInit {
    return {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    } as RequestInit;
  }
