export class BlockchainConnectionError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BlockchainConnectionError.prototype);
    }

    sayHello() {
        return "hello " + this.message;
    }
}