import { mockCanister } from '../src';

describe('mockCanister', () => {
    test('basic example', async () => {
        const mock = mockCanister({
            async echo(value: number) {
                return value;
            },
        });
        expect(await mock.call('echo', 123)).toEqual(123);
    });

    test('fallback', async () => {
        const mockEcho = mockCanister({
            async echo(value: number) {
                return value;
            },
        });
        const mock = mockCanister(
            {
                async runMock() {
                    return this.call('echo', 123);
                },
            },
            mockEcho,
        );
        expect(await mock.call('runMock')).toEqual(123);
    });
});
