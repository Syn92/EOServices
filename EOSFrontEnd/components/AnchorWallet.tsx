import * as transit from 'eos-transit';
import AnchorLinkProvider from 'eos-transit-anchorlink-provider';
import { Component } from 'react';

export class AnchorLickService {

    accessContext: transit.WalletAccessContext;

    constructor() {
        this.accessContext = transit.initAccessContext({
            appName: 'my_first_dapp',
            network: {
                host: 'api.pennstation.eosnewyork.io',
                port: 7001,
                protocol: 'http',
                chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
            },
            walletProviders: [
                AnchorLinkProvider('eos-marketplace')
            ]
        });


    }

    linkWallet() {
        const wallet = this.getWallet();
        wallet.login().then(accountInfo => {
            console.log(`Successfully logged in as ${accountInfo.name}!`);
          });
    }

    getWallet() {
        const walletProvider = this.accessContext.getWalletProviders()[0];
        const wallet = this.accessContext.initWallet(walletProvider);

        if (!wallet.connected) {
            wallet.connect()
                .then(() => {
                    console.log('Successfully connected!')
                });
        }

        return wallet;
    }
}

