// Base errors for business rules. The HTTP layer turns them into 404 / 400 responses
export class NotFoundError extends Error {}
export class ValidationError extends Error {}
