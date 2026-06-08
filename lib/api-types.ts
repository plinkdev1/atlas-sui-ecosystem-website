// Shared API response types for consistent error handling and responses across the application

/**
 * Standard API error response interface
 * All API routes should return errors in this format
 */
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: Record<string, unknown>
}

/**
 * Standard API success response wrapper
 * Provides consistent response structure across all endpoints
 */
export interface ApiSuccessResponse<T> {
  data: T
  meta?: {
    timestamp?: string
    version?: string
  }
}

/**
 * Paginated API response for list endpoints
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    hasMore: boolean
  }
}

/**
 * Type-safe error extraction helper
 * Converts any error to a string message with proper type checking
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  if (error && typeof error === "object" && "message" in error) {
    const err = error as Record<string, unknown>
    return String(err.message)
  }
  return "An unknown error occurred"
}

/**
 * Type-safe API error response builder
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = "An error occurred",
): ApiErrorResponse {
  return {
    error: getErrorMessage(error) || defaultMessage,
  }
}

/**
 * Type-safe success response builder
 */
export function createSuccessResponse<T>(data: T, meta?: ApiSuccessResponse<T>["meta"]): ApiSuccessResponse<T> {
  return {
    data,
    meta: meta || {
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Type-safe paginated response builder
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number = 1,
  pageSize: number = 10,
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    },
  }
}

/**
 * Common HTTP status codes for API responses
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Type for HTTP status codes
 */
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
