import { devCanister } from './canister/devCanister';
import { mockCanister } from './canister/mockCanister';
import { deferredReplica, replica } from './replica';
import { Canister, Network, Replica } from './types';

const ic = deferredReplica('https://ic0.app');
const local = deferredReplica('http://localhost:4943');

// Configure exports for TS, CommonJS, and ESM
const defaultExport = ic;
Object.assign(defaultExport, {
    default: defaultExport,
    ic,
    local,
    replica,
    devCanister,
    mockCanister,
    __esModule: true, // Recognize as ES Module
});
module.exports = defaultExport;
export default defaultExport;
export { ic, local, replica, devCanister, mockCanister };
export type { Canister, Network, Replica };
