export { Canister } from './canister';

export { replicaCanister } from './canister/replica';
export { devCanister } from './canister/dev';
export { mockCanister } from './canister/mock';

export default (await import('./canister/replica')).replicaCanister;
