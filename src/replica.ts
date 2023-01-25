import { HttpAgent } from '@dfinity/agent';
import fetch from 'cross-fetch';
import { agentCanister, AgentCanister } from './canister/agentCanister';
import { Replica } from './types';

export type AgentReplica = Replica<AgentCanister>;

// Define an IC replica from the given hostname (e.g. `https://ic0.app`)
export const replica = (
    host?: string | HttpAgent | undefined,
    options: { local?: boolean } = {},
): AgentReplica => {
    let agent: HttpAgent;
    if (!host) {
        agent = new HttpAgent({ fetch });
    } else if (typeof host === 'string') {
        agent = new HttpAgent({ host, fetch });
    } else if (host instanceof HttpAgent) {
        agent = host;
    } else {
        throw new Error(
            `Invalid host (expected \`string\` or \`HttpAgent\`, received \`${typeof host}\`)`,
        );
    }
    // Fetch root key for local replica
    if (options.local) {
        agent.fetchRootKey().catch((err) => {
            console.warn(
                'Unable to fetch root key (check to ensure that your local replica is running)',
            );
            console.error(err);
        });
    }
    return (id: string) => agentCanister(agent, id);
};

// Defer creating the agent for built-in replica values
export const deferredReplica = (
    ...args: Parameters<typeof replica>
): AgentReplica => {
    let deferred: AgentReplica | undefined;
    return (...replicaArgs) => {
        if (!deferred) {
            deferred = replica(...args);
        }
        return deferred(...replicaArgs);
    };
};
