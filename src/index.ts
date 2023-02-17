import { HttpAgent } from '@dfinity/agent';
import { agentCanister, AgentCanister } from './canister/agentCanister';
import { devCanister, DevCanister } from './canister/devCanister';
import { mockCanister, MockCanister, Mocks } from './canister/mockCanister';
import { deferredReplica, replica } from './replica';
import { Canister, Network, Replica } from './types';

const ic = deferredReplica('https://icp-api.io');
const local = deferredReplica('http://localhost:4943', { local: true });

// Configure exports for TS, CommonJS, and ESM
const defaultExport = ic;
Object.assign(defaultExport, {
    default: defaultExport,
    ic,
    local,
    replica,
    agentCanister,
    devCanister,
    mockCanister,
    HttpAgent,
    __esModule: true, // Recognize as ES Module
});
module.exports = defaultExport;
export default defaultExport;
export {
    ic,
    local,
    replica,
    agentCanister,
    devCanister,
    mockCanister,
    HttpAgent,
};
export type {
    Canister,
    Network,
    Replica,
    AgentCanister,
    DevCanister,
    MockCanister,
    Mocks,
};

