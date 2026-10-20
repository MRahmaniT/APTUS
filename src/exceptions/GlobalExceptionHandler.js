export class ApiError extends Error {
    status;
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}
export const handleGlobalError = (error) => {
    console.error("[Global Exception]:", error);
    if (error instanceof ApiError) {
        // Handle specific API errors
        return { error: true, message: error.message, status: error.status };
    }
    return { error: true, message: "An unexpected error occurred", status: 500 };
};
