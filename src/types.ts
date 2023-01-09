export interface Network {
    name: string;
    host: string;
}

export interface Replica<T extends Canister> {
    (id: string): T;
}

export interface Canister {
    call(method: string, ...args: any[]): Promise<any>;
}
