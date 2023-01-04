import { Actor, ActorSubclass, HttpAgent, fetchCandid } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

export interface Canister {
    call(method: string, ...args: any[]): Promise<any>;
}

class DevCanister implements Canister {
    public readonly alias: string;
    public readonly host: string;

    constructor(alias: string, host: string) {
        this.alias = alias;
        this.host = host;
    }

    async call(method: string, ...args: any[]): Promise<any> {
        const response = await fetch(
            `${this.host}/alias/${this.alias}/${method}`,
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

class ReplicaCanister implements Canister {
    public readonly id: string;
    public readonly agent: HttpAgent;

    private _actor: ActorSubclass | undefined;

    constructor(id: string, agent: HttpAgent) {
        this.id = id;
        this.agent = agent;
    }

    private async _fetchActor() {
        if (this._actor) {
            return this._actor;
        }
        const source = await fetchCandid(this.id, this.agent);
        const didJsCanisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
        const didJsInterface: IDL.InterfaceFactory = ({ IDL }) =>
            IDL.Service({
                did_to_js: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
            });
        const didJs: ActorSubclass = Actor.createActor(didJsInterface, {
            canisterId: didJsCanisterId,
            agent: this.agent,
        });
        const js = ((await didJs.did_to_js(source)) as [string])[0];
        const candid = await eval(
            `import("data:text/javascript;charset=utf-8,${encodeURIComponent(
                js,
            )}")`,
        );
        const actor = Actor.createActor(candid.idlFactory, {
            agent: this.agent,
            canisterId: this.id,
        });
        this._actor = actor;
        return actor;
    }

    async call(method: string, ...args: any[]): Promise<any> {
        const actor = await this._fetchActor();
        const result = await actor[method](...args);

        // Convert to JSON-like object
        return JSON.parse(
            JSON.stringify(result, (_key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                // TODO: Principal, Blob, etc.
                return value;
            }),
        );
    }
}

type Mocks = Record<string, (...args: any[]) => Promise<any>>;

class MockCanister implements Canister {
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

export function devCanister(
    alias: string,
    host = 'http://localhost:7700',
): DevCanister {
    return new DevCanister(alias, host);
}

export function replicaCanister(
    id: string,
    agent: HttpAgent | undefined = undefined,
): ReplicaCanister {
    if (!agent) {
        agent = new HttpAgent();
        if (agent.isLocal()) {
            agent.fetchRootKey();
        }
    }
    return new ReplicaCanister(id, agent);
}

export function mockCanister(mocks: Mocks, parent?: Canister) {
    return new MockCanister(mocks, parent);
}

export default replicaCanister;
