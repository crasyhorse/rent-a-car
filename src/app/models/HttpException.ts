class HttpException extends Error {
    constructor(
        public errorCode: number,
        public readonly message: string
    ) {
        super(message);
        this.errorCode = errorCode;
    }
}

export default HttpException;
