import { HttpAgent } from '@dfinity/agent';
import fetch from 'cross-fetch';
import { agentCanister } from './canister/agentCanister';
import { devCanister } from './canister/devCanister';
import { mockCanister } from './canister/mockCanister';
import { Canister, Network, Replica } from './types';

type AgentReplica = Replica<ReturnType<typeof agentCanister>>;

const replica = (host?: string | HttpAgent | undefined): AgentReplica => {
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

// Defer creating the agent for built-in replica values
const deferredReplica = (...args: Parameters<typeof replica>): AgentReplica => {
    let deferred: AgentReplica | undefined;
    return (...replicaArgs) => {
        if (!deferred) {
            deferred = replica(...args);
        }
        return deferred(...replicaArgs);
    };
};

const ic = deferredReplica('https://ic0.app');
const local = deferredReplica('http://localhost:4943');

const defaultExport = ic;
Object.assign(defaultExport, {
    default: defaultExport,
    ic,
    local,
    replica,
    devCanister,
    mockCanister,
    __esModule: true, // Import as ES Module
});

module.exports = defaultExport;
export default defaultExport;
export { ic, local, replica, devCanister, mockCanister };
export type { Canister, Network, Replica };
