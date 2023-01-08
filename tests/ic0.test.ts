import ic from '../src';

describe('mainnet (https://ic0.app)', () => {
    test.skip('ledger', async () => {
        const ledger = ic('ryjl3-tyaaa-aaaaa-aaaba-cai');

        expect(await ledger.call('name')).toStrictEqual({
            name: 'Internet Computer',
        });
    });
});
