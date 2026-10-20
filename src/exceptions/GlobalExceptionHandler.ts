export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const handleGlobalError = (error: any) => {
  console.error("[Global Exception]:", error);
  if (error instanceof ApiError) {
    // Handle specific API errors
    return { error: true, message: error.message, status: error.status };
  }
  return { error: true, message: "An unexpected error occurred", status: 500 };
};
