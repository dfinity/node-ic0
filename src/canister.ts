export interface Canister {
    call(method: string, ...args: any[]): Promise<any>;
}
