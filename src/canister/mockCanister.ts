import { Canister } from '../types';

export type Mocks = Record<string, (...args: any[]) => Promise<any>>;

export class MockCanister implements Canister {
    public readonly mocks: Mocks;
    public readonly fallback: Canister | undefined;

    constructor(mocks: Mocks, fallback: Canister | undefined) {
        this.mocks = mocks;
        this.fallback = fallback;
    }

    async call(method: string, ...args: any[]): Promise<any> {
        if (this.mocks.hasOwnProperty(method)) {
            return this.mocks[method].apply(this, args);
        }
        if (this.fallback) {
            return this.fallback.call(method, ...args);
        }
        throw new Error(`Unmocked canister method: \`${method}\``);
    }
}

export function mockCanister(mocks: Mocks, parent?: Canister) {
    return new MockCanister(mocks, parent);
}
