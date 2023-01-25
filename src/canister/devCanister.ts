import { Canister } from '../types';

export class DevCanister implements Canister {
    public readonly alias: string;
    public readonly host: string;

    constructor(alias: string, host: string) {
        this.alias = alias;
        this.host = host;
    }

    async call(method: string, ...args: any[]): Promise<any> {
        const response = await fetch(
            new URL(`/call/${this.alias}/${method}`, this.host),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    args,
                }),
            },
        );
        if (!response.ok) {
            throw new Error(
                `Error while calling ${this.alias}.${method}(${args
                    .map((a) => typeof a)
                    .join(', ')}): ${
                    (await response.text()) ||
                    response.statusText ||
                    `status code ${response.status}`
                }`,
            );
        }
        const body = await response.json();
        return body?.value;
    }
}

export function devCanister(
    alias: string,
    host = 'http://localhost:7700',
): DevCanister {
    return new DevCanister(alias, host);
}
