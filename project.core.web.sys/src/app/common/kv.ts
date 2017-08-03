export class KV<T>{
    constructor(
        public Key: string,
        public Value: T
    ) { }
}