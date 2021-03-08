"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deployer = void 0;
const crypto_1 = require("crypto");
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const promise_1 = __importDefault(require("simple-git/promise"));
const CHAIN_FOLDER_NAME = 'chains';
class Deployer {
    //private envRegExp: RegExp;
    constructor(apiUrl, /* see krono-coin postDeploy */ userId, /* see krono-coin postDeploy */ keyPair, /* see krono-coin postDeploy */ run, rootPath, env, useChainFiles = false, modulePath = path.join(rootPath, 'node_modules'), debug = true) {
        this.apiUrl = apiUrl;
        this.userId = userId;
        this.keyPair = keyPair;
        this.run = run;
        this.rootPath = rootPath;
        this.env = env;
        this.useChainFiles = useChainFiles;
        this.modulePath = modulePath;
        this.debug = debug;
        this.cache = new Map();
        this.fs = fs;
        this.path = path;
        this.git = promise_1.default(rootPath.split(path.sep).reduce((s, c, i, a) => c && i < a.length - 1 ? `${s}${path.sep}${c}` : s));
        this.blockchain = run.blockchain;
        this.networkKey = run.blockchain.network;
        //this.envRegExp = new RegExp(`[\\|\/]{1}${env}[\\|\/]{1}`, 'i');
    }
    log(msg) {
        if (this.debug) {
            console.log(msg);
        }
    }
    async deploy(source, crumbs = 'root', depth = 0) {
        if (this.cache.has(source))
            return this.cache.get(source);
        const hash = crypto_1.createHash('sha256');
        // this.log(sourcePath);
        depth = (depth || 0);
        let sourcePath = path.isAbsolute(source) ? source : path.join(this.rootPath, source);
        crumbs = `${crumbs} > ${source.split(path.sep).pop()}`;
        this.log(crumbs);
        //Load the code from the blockchain
        if (source.endsWith('.chain.json')) {
            this.log(`HAS CHAIN DEPENDENCY`);
            //if (!this.envRegExp.test(source)) throw `Mismatched environments in dependency.`;
            const deployed = await this.loadChainFile(source);
            //deployed could be null or undefined
            if (!deployed)
                throw new Error('Chain dependency could not be found.');
            this.log(`${deployed.name}: ${deployed.location}: ${deployed.hash}`);
            return deployed;
        }
        // if (!await fs.pathExists(sourcePath)) {
        //     const dep = require(source);
        //     if (!dep[`location${this.networkKey}`]) throw new Error(`${source} not deployed`);
        //     const deployed = this.run.load(dep[`location${this.networkKey}`]);
        //     this.cache.set(source, deployed);
        //     return deployed;
        // }
        const resource = require(sourcePath);
        const commitId = this.useChainFiles ?
            await this.getLastCommitId(sourcePath) :
            sourcePath;
        //Add the last git commit hash for this file to the hash buffer
        //Git root is the repo this is running in
        hash.update(commitId);
        // run build method
        if (typeof resource.preDeps === 'function') {
            await resource.preDeps(this);
            delete resource.preDeps;
        }
        let deployed = resource;
        const nonDeployedDeps = resource.deps;
        //If there are asyncDeps, recursively load and deploy those as necessary
        const asyncDeps = resource.asyncDeps || {};
        if (Object.keys(asyncDeps).length) {
            let deps = {};
            for (let [key, depPath] of Object.entries(asyncDeps)) {
                //Resolve code file path to dependency
                depPath = depPath.replace('{env}', this.env);
                if (depPath.startsWith('.')) {
                    depPath = path.join(path.dirname(source), depPath);
                }
                //Check the cache for dependency
                const dep = await this.deploy(depPath, crumbs, depth + 1);
                //Add to dependency object
                deps[key] = dep;
            }
            //Push dependency hashes into buffer for this resource
            Object.entries(deps).forEach(([key, dep]) => {
                // console.log('DEP:', key, !!dep);
                hash.update(dep.hash || '');
            });
            //Apply dependency artifacts to resource deps
            deployed.deps = Object.assign(Object.assign({}, nonDeployedDeps), deps);
            const parent = Object.getPrototypeOf(deployed);
            const dep = deployed.deps[parent.name];
            if (dep && dep !== parent) {
                Object.setPrototypeOf(deployed, dep);
            }
        }
        //Finalize hash for this resource
        deployed.hash = hash.digest('hex');
        delete deployed.asyncDeps;
        //Check to see if this resource needs to be deployed
        let mustDeploy = true;
        //Derive the chain file path
        let chainFilePath = this.deriveChainFilePath(sourcePath);
        let chainData = {};
        let presets = {};
        //Does the chain file exist; If not, then must deploy
        if (this.useChainFiles && fs.existsSync(chainFilePath)) {
            //Is there data for this network; If not, then must deploy
            chainData = fs.readJSONSync(chainFilePath);
            presets = chainData[this.networkKey];
            if (presets) {
                let jigLocation = presets.location;
                //Download artifact from chain based on location in chain file
                //If this fails, then either Run is not compatible or the chainfile
                //  is bad and so we will just deploy it again.
                this.log(`RUN.LOAD ${jigLocation} ${chainFilePath}`);
                let chainArtifact = await this.run.load(jigLocation).catch((ex) => {
                    // if (ex.statusCode === 404) {
                    this.log(`Error: ${ex.message}`);
                    this.log(`## Jig could not be loaded from ${jigLocation}`);
                    return { hash: 'DEPLOY_AGAIN' };
                    // }
                    // throw (ex);
                });
                //If the hashes match then there is no need to deploy
                if (resource.hash === chainArtifact.hash) {
                    //Can use the previously deployed artifact
                    mustDeploy = false;
                    //We can use the artifact from the chain for this resource
                    deployed = chainArtifact;
                }
            }
        }
        if (mustDeploy) {
            try {
                //PreDeploy support for resource to bootstrap anything else it wants
                if (deployed.hasOwnProperty('preDeploy')) {
                    //Allow Jig Class to configure itself with its deps
                    await deployed.preDeploy(this);
                    //Remove preDeploy before putting on chain
                    if (deployed.preDeploy) {
                        delete deployed.preDeploy;
                    }
                }
                let postDeploy;
                if (deployed.hasOwnProperty('postDeploy')) {
                    //Allow Jig Class to configure itself with its deps
                    postDeploy = deployed.postDeploy;
                    //Remove preDeploy before putting on chain
                    delete deployed.postDeploy;
                }
                //Upload the resource to the chain
                this.log(`RUN.DEPLOY ${deployed.name}`);
                if (!deployed.name) {
                    this.log(chainFilePath);
                }
                deployed = this.run.deploy(deployed);
                //Wait for the transaction to be accepted
                this.log(`RUN.SYNC`);
                await this.run.sync();
                if (postDeploy) {
                    deployed = await this.run.load(deployed.location);
                    this.log(`RUN.POST-DEPLOY ${deployed.name}`);
                    await postDeploy.bind(deployed)(this);
                }
                //Put the artifact presets into the chain file
                if (this.useChainFiles) {
                    this.log(`WRITE: ${chainFilePath}`);
                    await this.writeChainFile(chainFilePath, deployed);
                }
            }
            catch (ex) {
                console.error(`ERROR: `, ex);
                throw ex;
            }
        }
        this.cache.set(source, deployed);
        this.log(`READY: ${deployed.name}: ${deployed.location}: ${deployed.hash}`);
        return deployed;
    }
    async getLastCommitId(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File path does not exist: \n${filePath}`);
        }
        const status = await this.git.log({
            "file": filePath,
            "max-count": "1",
        });
        if ((status.latest || {}).hash) {
            return status.latest.hash;
        }
        return Promise.reject(new Error('Source file is not under source control.'));
    }
    deriveChainFilePath(sourcePath) {
        const { rootPath, env } = this;
        const chainFilePath = path.parse(sourcePath);
        let relativePath = chainFilePath.dir.replace(rootPath, '');
        chainFilePath.base = `${chainFilePath.name}.chain.json`;
        chainFilePath.dir = rootPath.slice(0, rootPath.lastIndexOf(path.sep)) + `/${CHAIN_FOLDER_NAME}/${env}${relativePath}`;
        return path.format(chainFilePath);
    }
    async loadChainFile(chainFileReference) {
        const { run, cache, env, rootPath, modulePath } = this;
        const network = run.blockchain.network;
        const chainFile = chainFileReference.replace('{env}', env);
        if (cache.has(chainFile))
            return cache.get(chainFile);
        let sourcePath = path.join(rootPath, chainFile);
        //Don't know if it is relative to the root or a node_modules dependency
        if (!fs.pathExistsSync(sourcePath)) {
            sourcePath = path.join(modulePath, chainFile);
            if (!fs.pathExistsSync(sourcePath))
                return;
        }
        const chainData = fs.readJSONSync(sourcePath);
        //chainData must match current run environment in order to be relevant
        //you can't mix main(net) jigs with test(net) jigs
        if (!chainData[network])
            return;
        const jig = await run.load(chainData[network].location);
        if (jig) {
            cache.set(chainFile, jig);
        }
        return jig;
    }
    async writeChainFile(chainFilePath, jig) {
        const { networkKey } = this;
        if (!jig.origin && !jig.location) {
            throw new Error(`Resource didn't have an origin or location`);
        }
        let { origin, location, nonce, owner, satoshis } = jig;
        let chainData = {};
        chainData[networkKey] = { origin, location, nonce, owner, satoshis };
        await fs.outputFileSync(chainFilePath, JSON.stringify(chainData, null, 4));
    }
}
exports.Deployer = Deployer;
//# sourceMappingURL=deployer.js.map