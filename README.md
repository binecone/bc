<p align="center">
    <img align="center" src="/src/logo.png" width="175"></img>
</p>

<h1 align="center">Binecone dApp</h1>

## What is Binecone?

Binecone - Blockchain based Vector Database.

Binecone is an innovative service that combines blockchain and vector database to safely manage and quickly retrieve data.

- Architecture


<p align="center">
    <img align="center" src="/public/binecone_architecture.png" width="600"></img>
</p>


## Binecone project progress

- Idea concept -> Website -> FVM dapp -> Serverless cloud -> Basic Vector Database -> Vector DB Connection -> Store -> Search

- Service website is completed. 
  Please check [Binecone](https://binecone.com)

## How it works

Binecone dApp with React & Hardhat to develop, deploy, and test Solidity smart contracts on the FEVM network.

## Preview Demo

<div align="center">
  <img src="/binecone_demo.gif" />
</div>

## Installation guide

### clone this repository

Open up your terminal (or command prompt) and type the following command:

```sh
git clone https://github.com/binecone/bc

# cd into the directory
cd bc
```


### Update private key

Ensure you create a `.env` file in the `root` directory. Then paste your Metamask private key in `.env` with the variable name `PRIVATE_KEY` as follows:

```sh
PRIVATE_KEY=1234
```

### Compile

Now, you can write your contracts in `./contracts/` directory, and type the following command:

```sh
npx hardhat compile

# for testing the smart contracts
npx hardhat test
```


### Deploy

Also, make changes in `./scripts/deploy.js`

For deploying the smart contracts to FEVM network, type the following command:

```sh
npx hardhat run --network calibnet scripts/deploy.js

# mainnet: npx hardhat run --network filecoin_mainnet scripts/deploy.js
```

Copy-paste the deployed contract address:

```sh
Contract deployed to: 0x...
```

### React client

start react app

```sh
npm start
# Starting the development server...
```

Please read the [hardhat documentation](https://hardhat.org/hardhat-runner/docs/getting-started#quick-start) and [FVM documentation](https://docs.filecoin.io/developers/smart-contracts/filecoin-virtual-machine/) for more details.

## License

Binecone is licensed under the [MIT License](https://github.com/akhileshthite/create-fvm-dapp/blob/main/LICENSE).

