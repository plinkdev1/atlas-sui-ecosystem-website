/**
 * Helper function to safely extract error message from unknown error type
 * Use this in catch blocks to properly handle errors without using 'any'
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as Record<string, unknown>).message)
  }
  return "Unknown error occurred"
}

/**
 * Helper function to get HTTP status code from error
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof Error) {
    if ("status" in error) {
      const status = (error as Record<string, unknown>).status
      if (typeof status === "number") return status
    }
    if (error.message.includes("Unauthorized")) return 401
    if (error.message.includes("Forbidden")) return 403
    if (error.message.includes("not found")) return 404
  }
  return 500
}

/**
 * Helper function to log error with context
 */
export function logError(context: string, error: unknown): void {
  console.error(`[v0] ${context}:`, error)
}
