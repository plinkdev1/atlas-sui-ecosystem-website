// Enhanced error handling with specific error codes and categories
export enum ErrorCode {
  // Wallet errors
  WALLET_NOT_CONNECTED = "ERR_WALLET_NOT_CONNECTED",
  WALLET_CONNECTION_FAILED = "ERR_WALLET_CONNECTION_FAILED",
  WALLET_REJECTION = "ERR_WALLET_REJECTION",
  WALLET_TIMEOUT = "ERR_WALLET_TIMEOUT",
  WALLET_UNSUPPORTED = "ERR_WALLET_UNSUPPORTED",

  // Transaction errors
  INSUFFICIENT_BALANCE = "ERR_INSUFFICIENT_BALANCE",
  GAS_ESTIMATION_FAILED = "ERR_GAS_ESTIMATION_FAILED",
  SIGNATURE_REJECTED = "ERR_SIGNATURE_REJECTED",
  TRANSACTION_FAILED = "ERR_TRANSACTION_FAILED",
  TRANSACTION_TIMEOUT = "ERR_TRANSACTION_TIMEOUT",

  // Validation errors
  INVALID_ADDRESS = "ERR_INVALID_ADDRESS",
  INVALID_AMOUNT = "ERR_INVALID_AMOUNT",
  INSUFFICIENT_GAS = "ERR_INSUFFICIENT_GAS",

  // API errors
  API_UNAVAILABLE = "ERR_API_UNAVAILABLE",
  API_RATE_LIMIT = "ERR_API_RATE_LIMIT",
  API_ERROR = "ERR_API_ERROR",
}

export interface ErrorMetadata {
  code: ErrorCode
  originalError?: Error
  retryable: boolean
  retryCount?: number
  maxRetries?: number
}

export class WalletError extends Error {
  code: ErrorCode
  retryable: boolean
  originalError?: Error

  constructor(message: string, code: ErrorCode, retryable = false, originalError?: Error) {
    super(message)
    this.name = "WalletError"
    this.code = code
    this.retryable = retryable
    this.originalError = originalError
    Object.setPrototypeOf(this, WalletError.prototype)
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof WalletError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof WalletError) {
    return error.retryable
  }
  return false
}

export function getErrorGuidance(code: ErrorCode): string {
  const guidance: Record<ErrorCode, string> = {
    [ErrorCode.WALLET_NOT_CONNECTED]: "Please connect your wallet to proceed.",
    [ErrorCode.WALLET_CONNECTION_FAILED]: "Connection failed. Please try again or try a different wallet.",
    [ErrorCode.WALLET_REJECTION]: "You rejected the action in your wallet. Please approve to continue.",
    [ErrorCode.WALLET_TIMEOUT]: "Wallet connection timed out. Please check your wallet and try again.",
    [ErrorCode.WALLET_UNSUPPORTED]: "This wallet is not supported. Please use a different wallet.",
    [ErrorCode.INSUFFICIENT_BALANCE]: "You don't have enough balance to complete this transaction.",
    [ErrorCode.GAS_ESTIMATION_FAILED]: "Could not estimate gas. Please check network and try again.",
    [ErrorCode.SIGNATURE_REJECTED]: "Signature was rejected by the wallet.",
    [ErrorCode.TRANSACTION_FAILED]: "Transaction failed. Please check your balance and gas.",
    [ErrorCode.TRANSACTION_TIMEOUT]: "Transaction took too long. It may still complete - check your wallet.",
    [ErrorCode.INVALID_ADDRESS]: "The wallet address is not valid.",
    [ErrorCode.INVALID_AMOUNT]: "Please enter a valid amount.",
    [ErrorCode.INSUFFICIENT_GAS]: "Not enough gas for this transaction. Add more funds.",
    [ErrorCode.API_UNAVAILABLE]: "API service is unavailable. Please try again later.",
    [ErrorCode.API_RATE_LIMIT]: "Too many requests. Please wait a moment and try again.",
    [ErrorCode.API_ERROR]: "An API error occurred. Please try again.",
  }
  return guidance[code] || "An error occurred. Please try again."
}
