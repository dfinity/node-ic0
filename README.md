
# `ic0` &nbsp;[![npm version](https://img.shields.io/npm/v/ic0.svg?logo=npm)](https://www.npmjs.com/package/ic0) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dfinity/ic0/issues)

> ### An easy-to-use JavaScript API for the [Internet Computer](https://internetcomputer.org/).

---

The `ic0` package is a simple, straightfoward way to interact with canisters running on the [Internet Computer](https://internetcomputer.org/) (IC). 

## Installation

```sh
npm i --save ic0
```

## Quick Start

Try running the following code from Node.js or a web application:

```ts
import ic from 'ic0';

const ledger = ic('ryjl3-tyaaa-aaaaa-aaaba-cai'); // Ledger canister

console.log(await ledger.call('name')); // Call the `name()` method
```

Easily call any Internet Computer canister using the following syntax:

```ts
import ic from 'ic0';

ic(canisterId).call(method, ...args); // IC mainnet

ic.local(canisterId).call(method, ...args); // Local replica
```

## Local Canisters

The [`dfx start`](https://internetcomputer.org/docs/current/references/cli-reference/dfx-start) command hosts a local execution environment for developing canister smart contracts. Here is an example of how to call a local canister:

```ts
const backend = ic.local('rrkah-fqaaa-aaaaa-aaaaq-cai'); // Access a local canister

backend.call('myFunction', 123); // Call `myFunction(123)`
```

### Basic usage:

```ts
const ledger = ic('ryjl3-tyaaa-aaaaa-aaaba-cai'); // Principal for the IC ledger

console.log(await ledger.call('name')); // => { name: 'Internet Computer' }
```

### Advanced usage:

Replica canisters use [agent-js](https://github.com/dfinity/agent-js) behind the scenes.

```ts
import { replica, HttpAgent } from 'ic0';

const ic = replica(new HttpAgent({ ... })); // Use a custom agent from `@dfinity/agent`

const ledger = ic('ryjl3-tyaaa-aaaaa-aaaba-cai');

console.log(await ledger.call('name')); // => { name: 'Internet Computer' }
```

## Mock Canisters

A **mock canister** makes it easy to [mock](https://stackoverflow.com/a/2666006) the behavior of a canister.

### Basic usage:

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

### Advanced usage:

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

## Related Projects

Check out the following GitHub repositories for more IC-related npm packages:

- [agent-js](https://github.com/dfinity/agent-js): a collection of npm packages for building on the Internet Computer
- [node-motoko](https://github.com/dfinity/node-motoko): run Motoko programs directly in the browser
- [mo-dev](https://npmjs.com/package/mo-dev): a live-reload server for local Motoko dapp development
- [@infu/icblast](https://github.com/infu/icblast): a community-built library for exploring the IC and writing integration tests
