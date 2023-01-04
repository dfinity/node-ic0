
# `ic0` &nbsp;[![npm version](https://img.shields.io/npm/v/ic0.svg?logo=npm)](https://www.npmjs.com/package/ic0) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dfinity/ic0/issues)

> ### An easy-to-use JavaScript API for the [Internet Computer](https://internetcomputer.org/).

---

The `ic0` npm package makes it easier to interact with Internet Computer canisters
from development and testing environments. 

## Installation:

```sh
npm i --save ic0
```

## Examples:

### Replica Canister

A **replica canister** represents a live canister running on the Internet Computer (or local replica), identified by a unique
[Principal](https://medium.com/dfinity/internet-computer-basics-part-1-principals-and-identities-215e8f239da4). 

#### Basic usage:

```ts
import { replicaCanister } from 'ic0';

const principal = 'ryjl3-tyaaa-aaaaa-aaaba-cai'; // Canister ID (Principal)
const ledger = replicaCanister(principal);

console.log(await ledger.call('name')) // => { name: 'Internet Computer' }
```

#### Advanced usage:

Replica canisters use [agent-js](https://github.com/dfinity/agent-js) behind the scenes. 

```ts
import { replicaCanister } from 'ic0';
import { HttpAgent } from '@dfinity/agent';

const principal = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const agent = new HttpAgent({ host: ... }); // Use a custom agent from `agent-js`

const ledger = replicaCanister(principal, agent);

console.log(await ledger.call('name')); // => { name: 'Internet Computer' }
```

### Dev Canister

A **dev canister** makes it possible to interact with canisters provided by a live-reload development environment
such as the [Motoko Dev Server](https://github.com/dfinity/motoko-dev-server).

#### Basic usage:

```ts
import { devCanister } from 'ic0';

const backend = devCanister('backend'); // Canister alias specified in your `dfx.json` file

console.log(await backend.call('getValue')); // Call the `getValue()` method on your `backend` canister
```

#### Advanced usage:

This package makes it possible to seamlessly switch between `devCanister` and `replicaCanister` depending on the environment.

For example, you can use the `import.meta.env` property available in [Vite](https://vitejs.dev/):

```ts
import { devCanister, replicaCanister } from 'ic0';

const backend = import.meta.env.DEV
    ? devCanister('backend')
    : replicaCanister('rrkah-fqaaa-aaaaa-aaaaq-cai'); // Deployed canister Principal

console.log(await backend.call('getValue')); // Call the `getValue()` method on the deployed canister when in production
```

### Mock Canister

A **mock canister** makes it easy to mock the behavior of your canisters for unit tests. 

#### Basic usage:

```ts
import { mockCanister } from 'ic0';

const mock = mockCanister({
    // Mock canister method named `echo()`
    async echo(x: number) {
        return x;
    }
});

console.log(await mock.call('echo', 123)); // => 123
```

#### Advanced usage:

Provide a fallback canister and/or compose several mocks by passing a second argument to the `mockCanister()` function:

```ts
import { mockCanister, replicaCanister } from 'ic0';

const ledger = replicaCanister(principal, agent);

const mockLedger = mockCanister({
    async echo(x: number) {
        return x;
    }
}, ledger); // Fall back to the deployed `ledger` canister

const mock = mockCanister({
    async runMock() {
        return this.call('echo', 456); // Call the mocked `echo()` function
    }
}, mockLedger); // Fall back to another mock canister

console.log(await mock.call('runMock')); // => 456
```
