"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bsv_1 = require("bsv");
const rest_blockchain_1 = require("@kronoverse/lib/dist/rest-blockchain");
const run_1 = __importDefault(require("@kronoverse/run"));
const worker_1 = require("threads/worker");
const PORT = process.env.PORT || 8082;
const network = 'mock';
const apiUrl = `http://localhost:${PORT}`;
const blockchain = new rest_blockchain_1.RestBlockchain(apiUrl, network);
const run = new run_1.default({
    network,
    blockchain,
    timeout: 30000,
    trust: '*',
});
async function indexJig(loc) {
    if (!loc)
        return;
    try {
        console.log('Indexing:', loc);
        const jig = await run.load(loc).catch(e => {
            if (e.message.includes('Jig does not exist') ||
                e.message.includes('Not a run transaction'))
                return;
            throw e;
        });
        if (!jig)
            return;
        console.log('JIG:', jig.constructor.name, jig.location);
        const jigData = {
            location: jig.location,
            kind: jig.constructor && jig.constructor.origin,
            type: jig.constructor.name,
            origin: jig.origin,
            owner: jig.owner,
            ts: Date.now(),
            isOrigin: jig.location === jig.origin,
            value: JSON.parse(JSON.stringify(jig.toObject ? jig.toObject() : jig) || '{}')
        };
        return jigData;
    }
    catch (e) {
        console.error('INDEX ERROR:', e);
        // throw e;
    }
}
worker_1.expose({
    index: async (rawtx) => {
        const tx = bsv_1.Tx.fromHex(rawtx);
        const txid = tx.id();
        let payload;
        try {
            payload = run.payload(rawtx);
        }
        catch (e) {
            if (e.message.includes('Bad payload structure') || e.message.includes('Not a run transaction'))
                return;
            throw e;
        }
        const locs = payload.out.map((x, i) => `${txid}_o${i + 1}`);
        const jigs = [];
        if (locs.length) {
            jigs.push(await indexJig(locs.shift()));
            jigs.push(...(await Promise.all(locs.map((loc) => indexJig(loc)))));
        }
        return jigs;
    }
});
//# sourceMappingURL=indexer.js.map