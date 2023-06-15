# Service Ledger

The Service Ledger (SL) is a software tool developed for the [CyberKit4SME](https://cyberkit4sme.eu/) European H2020 project. It is a blockchain-based platform that allows SMEs to store and share their _Cyber Threat Intelligence_ (CTI) data securely.

To deal with CTI data, SL integrates the [STIX and TAXII standards](https://oasis-open.github.io/cti-documentation/). The STIX is a data modelling language for representing CTI data in a structured way. The TAXII is a client-server application protocol for exchanging STIX objects over HTTPS. SL employs the [InterPlanetary File System (IPFS)](https://ipfs.tech/) as decentralised protocol to store data over a peer-to-peer network. IPFS assigns a file with a unique identifier, called _Content Identifier_ (CID), and then cryptographically split the file into smaller chunks distributed on the network nodes. As privacy-preserving property, SL relies on [HashiCorp Vault](https://www.vaultproject.io/) to create and maintain criptographic keys for each participating SME. When a user of an organisation wants to store CTI information, SL retrieves the associated SME's public key and then encrypts any file before sending it to the IPFS network. Once a file is stored on IPFS, SL relies on the [Algorand](https://www.algorand.com/) blockchain to represent its corresponding CID as a _Non-Fungible Token_ (NFT), making it tamper-proof, verifiable and traceable.

## SL installation

Software requirements:

- Docker and Docker Compose
- NodeJS 18
- npm

### Step 1: Setting up the Algorand network

In order for SL to connect with the Algorand blockchain and send transactions to it, the [Algorand Sandbox](https://github.com/algorand/sandbox) needs to be downloaded as it is not included in the repository. After pulling it from Github, the Algorand Sandbox has to be started in the `testnet` mode:

```bash
git clone https://github.com/algorand/sandbox.git
cd sandbox
./sandbox up testnet
```

### Step 2: Launching the SL's services

Each service used by SL is embedded within a docker container, and all of them are listed in a docker compose file (`docker-compose.yml`). To launch SL's services, run the following commands from the main directory of this repo:


```bash
cd docker/compose/sl
docker compose up
```

This triggers the services as docker containers and attach them to the `sandbox-default` docker network created in _Step 1_. Note that the `sl-servers` docker container is a NodeJS app for the SL's servers (both TAXII Server and Authentication Server), which are dormant until activated.

_Hint-1._ Do not run the `docker compose up` in detach mode with the flag `-d`, because it will launch the containers in the backgroud and will not display their output.

_Hint-2._ Wait until the `sl-servers` docker container outputs:

```bash
Tasks:		8 successful, 8 total
Cached:		0 cached, 8 total
Time:		X.Ys
```
This indicates that the NodeJS app has been built correctly, and you can then start the SL's servers. 

### Step 3: Activating the SL's servers

To bring the SL's servers listening and ready to receive API requests, run the following command from the main directory of this repo:

```bash
./sl.sh
```

## SL usage

With Service Ledger, you have the flexibility to use it either via _web app_ by connecting to `https://${HOSTNAME}:6022`, or via _API calls_ to be transmitted to the endpoint `https://${HOSTNAME}:6023`.

The web app makes it easy to register an organisation and its members in SL. Once a member authenticates in the web app, she/he can easily store CTI data by uploading a STIX object (in json format) or by copying-and-pasting its content on the dedicated web page. A member can inspect all the organisation’s STIX objects and, if authorised, those belonging to other organisations. Additionally, the web app offers a user-friendly way to filter the STIX objects with a drop-down list of parameters to be selected.

The HTTPS APIs allow direct interaction with the SL servers, according to the traditional request/response model. Specifically, an organisation can integrate APIs into its existing infrastructure (e.g., a local client), automating the CTI data processing and improving efficiency. With SL’s API calls, you have full control over how you share your STIX objects and inspect those stored in the SL repository, and can easily merge them into your workflows.

For a comprehensive guide on how to use all SL APIs, see the [documentation](/documentation/SL-APIs.md) folder.

## Useful Links

- [Algorand Dispenser for funding testnet accounts](https://bank.testnet.algorand.network/)
- [Algo Explorer](https://testnet.algoexplorer.io/)
