import { useEffect, useState } from 'react';
import ic from 'ic0';

function App() {
    const [loaded, setLoaded] = useState(false);
    const [value, setValue] = useState<any>();

    const canisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
    const method = 'name';
    const args: any[] = [];

    const canister = ic(canisterId);

    useEffect(() => {
        canister.call(method, ...args).then((value) => {
            setValue(value);
            setLoaded(true);
        });
    }, []);

    return (
        <div style={{ width: '100vw', textAlign: 'center', fontSize: 20 }}>
            <code>
                {canisterId} : {method}(
                {args.map((arg) => JSON.stringify(arg)).join(', ')})
            </code>
            <br />
            <br />
            <code>{loaded ? JSON.stringify(value) : '...'}</code>
        </div>
    );
}

export default App;
