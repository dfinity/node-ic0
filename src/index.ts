import { replicaCanister } from './canister/replica';
import { devCanister } from './canister/dev';
import { mockCanister } from './canister/mock';

export { Canister } from './canister';
export { replicaCanister, devCanister, mockCanister };
export default replicaCanister;
