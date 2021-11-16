import { SigningRequest } from 'eosio-signing-request';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'; 
import { Linking } from 'react-native'; 
import fetch from "node-fetch";
import { Deal, newDeal } from '../interfaces/Services';
import axios, { CancelTokenSource } from 'axios';
import ServerConstants from '../constants/Server';

const CHAIN_ENDPOINT = "https://jungle3.cryptolions.io:443"
const EOS_MARKETPLACE_PK =  "5JHK9gTN4XTK1vgJBAShEpnfLdVUkQy7L2rZVd31okHNcdB9Nz4"
const signatureProvider = new JsSignatureProvider([EOS_MARKETPLACE_PK])

const rpc = new JsonRpc(CHAIN_ENDPOINT,{fetch})
export class ContractAPI{
    private opts:any
    private api:Api
    private rpc:JsonRpc
    constructor(){
        this.rpc = new JsonRpc('https://jungle3.cryptolions.io:443', { fetch });

        this.api = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        this.opts = {
          
          // Customizable ABI Provider used to retrieve contract data
          abiProvider: {
            getAbi: async (account:any) => (await this.api.getAbi(account))
          }
        }
    }

    private async signingRequest(actions:any):Promise<SigningRequest>{
        return  SigningRequest.create({ actions,chainId:"2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840" }, this.opts )
    }
    // async getDealId(){
    //   rpc.history_get_transaction("28ef17bf37881f84df3d281b1d0cf269f7df8f83ee0ef4d6981f6c34207d071e").then((res)=>{
    //     console.log(res.traces[res.traces.length-1].act.data.deal_id)
    //   })
    // }

    async createDeal(deal:newDeal){
        return axios.post(ServerConstants.local+"contract",deal)
    }
    async acceptDeal(deal:Deal){
        const actions = [{
             account: 'eosmarktplce',
             name: 'accept',
             authorization: [{
               actor:deal.buyer,
               permission: 'active',
             }],
             data: {
                 party:deal.buyer,
                 deal_id:deal.dealId
             },
           },{
             account: 'eosio.token',
             name: 'transfer',
             authorization: [{
               actor: deal.buyer,
               permission: 'active',
             }],
             data: {
               from: deal.buyer,
               to: "eosmarktplce",
               quantity: deal.amount+" EOS",
               memo: deal.dealId
             },
           }]
        this.signingRequest(actions)
    }

}
