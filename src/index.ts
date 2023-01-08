import { HttpAgent } from '@dfinity/agent';
import { agentCanister } from './canister/agentCanister';
import { Canister, Network, Replica } from './types';
import fetch from 'cross-fetch';

export { devCanister } from './canister/devCanister';
export { mockCanister } from './canister/mockCanister';
export { Network, Replica, Canister };

export const replica = (host?: string | HttpAgent | undefined): Replica => {
    let agent: HttpAgent;
    if (!host) {
        agent = new HttpAgent({ fetch });
    }
    if (typeof host === 'string') {
        agent = new HttpAgent({ host, fetch });
    } else if (host instanceof HttpAgent) {
        agent = host;
    } else {
        throw new Error(
            `Invalid host (expected \`string\` or \`HttpAgent\`, received \`${typeof host}\`)`,
        );
    }
    // Fetch root key for local replica
    if (agent.isLocal()) {
        agent.fetchRootKey().catch((err) => {
            console.warn(
                'Unable to fetch root key (check to ensure that your local replica is running)',
            );
            console.error(err);
        });
    }
    return (id: string) => agentCanister(agent, id);
};

export default replica('https://ic0.app');
