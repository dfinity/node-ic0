const ic = require('../lib');

(async () => {
    const ledger = ic('ryjl3-tyaaa-aaaaa-aaaba-cai');
    const result = await ledger.call('name');

    console.log(result);
})();
