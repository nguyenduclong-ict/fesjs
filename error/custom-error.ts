export default class CustomError extends Error {
    code: number;

    constructor({ message, code }: { message?: string; code?: number }) {
        super(message);
        this.code = code;
    }
}
