import { useEffect, useState } from 'react';
import ic from 'ic0';

function App() {
    const [value, setValue] = useState<any>();

    const canisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
    const method = 'name';
    const args: any[] = [];

    const canister = ic(canisterId);

    useEffect(() => {
        canister.call(method, ...args).then(setValue);
    }, []);

    return (
        <div style={{ width: '100vw', textAlign: 'center' }}>
            <div>{canisterId}</div>
            {JSON.stringify(value)}
        </div>
    );
}

export default App;
