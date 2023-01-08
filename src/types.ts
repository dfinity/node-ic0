export interface Network {
    name: string;
    host: string;
}

export interface Replica {
    (id: string): Canister;
}

export interface Canister {
    call(method: string, ...args: any[]): Promise<any>;
}
