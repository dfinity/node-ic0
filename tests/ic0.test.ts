import ic0 from '../src';

describe('mainnet (https://ic0.app)', () => {
    test('Candid UI', async () => {
        const candidUI = ic0('a4gq6-oaaaa-aaaab-qaa4q-cai');

        expect(await candidUI.call('did_to_js', '')).toEqual('');
    });
});
