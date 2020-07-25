import { RestBlockchain } from './rest-blockchain';

const { Transaction } = require('bsv-legacy');

export class RunTransaction {
    private transaction;
    private blockchain: RestBlockchain;
    constructor(run) {
        this.blockchain = run.blockchain;
        this.transaction = run.transaction;
    }

    get actions() {
        return this.transaction.actions;
    }

    begin() {
        return this.transaction.begin();
    }

    end() {
        return this.transaction.end();
    }

    async commit() {
        let jig = this.transaction.actions[0] && this.transaction.actions[0].target;
        if (!jig) return this.rollback();
        this.end();
        await jig.sync({ forward: false });
    }

    export(): any {
        return this.transaction.export().toString();
    }

    async import(rawtx: string): Promise<void> {
        const tx = new Transaction(rawtx);
        await Promise.all(tx.inputs.map(async input => {
            const outTx = await this.blockchain.fetch(input.prevTxId.toString('hex'));
            input.output = outTx.outputs[input.outputIndex];
        }));
        return this.transaction.import(tx);
    }

    rollback() {
        return this.transaction.rollback();
    }

    pay() {
        return this.transaction.pay();
    }

    sign() {
        return this.transaction.sign();
    }
}