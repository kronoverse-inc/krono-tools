import { IStorage, IUTXO } from './interfaces';
import { LRUCache } from './lru-cache';
import { SignedMessage } from './signed-message';
import { create } from 'domain';
import { NotFound } from 'http-errors';

const createError = require('http-errors');
const fetch = require('node-fetch');

const { Transaction } = require('bsv-legacy');

export class RestBlockchain {
    constructor(
        private apiUrl: string,
        public network: string,
        private cache: IStorage<any> = new LRUCache(10000000)
    ) { }

    get bsvNetwork(): string {
        switch (this.network) {
            case 'stn':
                return 'stn';
            case 'main':
                return 'mainnet';
            default:
                return 'testnet';
        }
    }

    async broadcast(tx) {
        const rawtx = typeof tx === 'string' ? tx : tx.toString();
        const resp = await fetch(`${this.apiUrl}/broadcast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawtx })
        });
        if (!resp.ok) throw createError(resp.status, await resp.text());
        const hash = await resp.json();
        console.log('Broadcast:', hash);
        await this.cache.set(`tx:${hash}`, rawtx);
        return tx.hash;
    }

    async populateInputs(tx) {
        await Promise.all(tx.inputs.map(async input => {
            const outTx = await this.fetch(input.prevTxId.toString('hex'));
            input.output = outTx.outputs[input.outputIndex];
        }));
    }

    async fetch(txid: string, force?: boolean, asRaw = false) {
        try {
            let rawtx = await this.cache.get(`tx://${txid}`);
            if (!rawtx) {
                for (let i = 0; i < 3; i++) {
                    try {
                        const resp = await fetch(`${this.apiUrl}/tx/${txid}`);
                        if (resp.ok) {
                            rawtx = await resp.text();
                            await this.cache.set(`tx://${txid}`, rawtx);
                            break;
                        }
                        throw createError(resp.status, await resp.text());
                    } catch (e) {
                        if (e.status === 404 || i >= 2) throw e;
                    }
                }
            }

            if (asRaw) return rawtx;
            const tx = new Transaction(Buffer.from(rawtx, 'hex'));
            const locs = tx.outputs.map((o, i) => `${txid}_o${i}`);

            let spends = [];
            if (force) {
                for (let i = 0; i < 3; i++) {
                    const resp = await fetch(`${this.apiUrl}/spent`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ locs })
                    });
                    if (resp.ok) {
                        spends = await resp.json();
                        break;
                    }
                    if (i >= 2) throw createError(resp.status, await resp.text());
                }
            }

            tx.outputs.forEach((o: any, i) => {
                o.spentTxId = spends[i] || null;
                o.spentIndex = null;
            });

            return tx;
        } catch (e) {
            console.log(`Fetch error: ${txid} - ${e.message}`);
            throw e;
        }
    };

    async utxos(address): Promise<IUTXO[]> {
        if (typeof address !== 'string') {
            address = address.toAddress(this.bsvNetwork).toString();
        }
        const resp = await fetch(`${this.apiUrl}/utxos/${address}`);
        if (!resp.ok) throw new Error(await resp.text());
        return resp.json();
    };

    async isSpent(loc) {
        const resp = await fetch(`${this.apiUrl}/spent/${loc}`);
        if (!resp.ok) throw new Error(await resp.text());
        const spentTxId = await resp.text();
        return !!spentTxId;
    }

    async jigIndex(address) {
        const resp = await fetch(`${this.apiUrl}/jigs/${address}`);
        if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
        return resp.json();
    }

    async kindHistory(kind: string, query: any) {
        const resp = await fetch(`${this.apiUrl}/jigs/kind/${kind}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        });
        if (!resp.ok) throw createError(resp.status, await resp.text());
        return resp.json();
    }

    async originHistory(origin: string, query: any) {
        const resp = await fetch(`${this.apiUrl}/jigs/origin/${origin}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        });
        if (!resp.ok) throw createError(resp.status, await resp.text());
        return resp.json();
    }

    async fund(address: string, satoshis?: number) {
        const resp = await fetch(`${this.apiUrl}/fund/${address}${satoshis ? `?satoshis=${satoshis}` : ''}`);
        if (!resp.ok) throw createError(resp.status, await resp.text());
        return resp.json();
    }

    async loadMessage(messageId): Promise<SignedMessage> {
        const resp = await fetch(`${this.apiUrl}/messages/${messageId}`);
        if (!resp.ok) throw createError(resp.status, await resp.text());
        return new SignedMessage(await resp.json());
    }

    async sendMessage(message: SignedMessage, postTo?: string): Promise<void> {
        const resp = await fetch(postTo || `${this.apiUrl}/messages`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(message)
        });
        if (!resp.ok) throw createError(resp.status, await resp.text());
    }
}
