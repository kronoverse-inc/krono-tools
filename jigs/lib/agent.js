class Agent {
    constructor(wallet, blockchain, handlers, channelHandlers) {
        this.wallet = wallet;
        this.blockchain = blockchain;
        this.address = wallet.address;
        this.pubkey = wallet.pubkey;
        this.purse = wallet.purse;

        /// TODO: remove
        this.handlers = handlers;
        this.channelHandlers = channelHandlers;

        this.eventHandlers = new Map();
        this.jigHandlers = new Map();
        this.kindSubHandlers = new Map();
        this.originSubHandlers = new Map();
        this.channelSubHandlers = new Map();
    }

    initialize() { }
    async onJig(jigData) {
        let handler = this.jigHandlers.get(jigData.kind);
        if(!handler) return;
        const jig = await this.wallet.loadJig(jigData.location);
        if (!jig) {
            console.log(`JIG: ${jigData.type} ${jigData.location} missing`);
            return;
        }
        await jig.sync();
        if (jig.location !== jigData.location) {
            console.log(`JIG: ${jigData.type} ${jigData.location} spent`);
        }
        await handler.bind(this)(jig);
    }
    async onChannel(channe) {}
    
    async onKindSub(jigData) {
        let handler = this.kindSubHandlers.get(jigData.kind);
        if(!handler) return;
        const jig = await this.wallet.loadJig(jigData.location);
        if (!jig) {
            console.log(`JIG: ${jigData.type} ${jigData.location} missing`);
            return;
        }
        await jig.sync();
        if (jig.location !== jigData.location) {
            console.log(`JIG: ${jigData.type} ${jigData.location} spent`);
        }
        await handler.bind(this)(jig);
    }
    async onOriginSub(jigData) {
        let handler = this.kindSubHandlers.get(jigData.kind);
        if(!handler) return;
        const jig = await this.wallet.loadJig(jigData.location);
        if (!jig) {
            console.log(`JIG: ${jigData.type} ${jigData.location} missing`);
            return;
        }
        await jig.sync();
        if (jig.location !== jigData.location) {
            console.log(`JIG: ${jigData.type} ${jigData.location} spent`);
        }
        await handler.bind(this)(jig);
    }
    async onChannelSub(channel) {
        let handler = this.channelSubHandlers.get(channel.loc);
        if(!handler) return;
        await this.wallet.loadChannelTransaction(channel.loc, channel.seq, async jig => {
            if(jig.constructor.origin !== Battle.origin) return;
            return handler.bind(this)(jig);
        });
    }
    
    async onEvent(event, payload) {
        let handler = this.eventHandlers.get(event);
        if (!handler) throw new Error('Invalid handler');
        return handler.bind(this)(payload);
    }

    static hexToBytes(hex) {
        let bytes = new Uint8Array(32);
        for (let i = 0; i < 64; i += 2) {
            bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
        }
        return bytes;
    }

    generateHashchain(size) {
        const hashchain = {};
        // const hashchain = new Array(size);
        let hash = hashchain[size - 1] = this.wallet.randomBytes(32);
        for (let i = size - 2; i >= 0; i--) {
            hash = hashchain[i] = Sha256.hashToHex(Agent.hexToBytes(hash));
        }
        return hashchain
    }
}

Agent.asyncDeps = {
    Sha256: "lib/sha256.js"
}

module.exports = Agent;