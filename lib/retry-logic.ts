import { WalletError } from "@/lib/errors"

export interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
}

export async function retryAsync<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null
  let delay = config.initialDelayMs

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`[v0] Attempt ${attempt + 1}/${config.maxRetries + 1}`)
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry if it's not a retryable error or if we've exhausted retries
      if (!(error instanceof WalletError) || !error.retryable || attempt === config.maxRetries) {
        console.error(`[v0] Retry failed after ${attempt + 1} attempts:`, lastError.message)
        throw error
      }

      // Wait before retrying
      console.log(`[v0] Retrying in ${delay}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Exponential backoff
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs)
    }
  }

  throw lastError || new Error("Operation failed")
}
