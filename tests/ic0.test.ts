import ic from '../src';

describe('mainnet', () => {
    test.skip('ledger', async () => {
        const ledger = ic('ryjl3-tyaaa-aaaaa-aaaba-cai');

        expect(await ledger.call('name')).toStrictEqual({
            name: 'Internet Computer',
        });
    });
});
