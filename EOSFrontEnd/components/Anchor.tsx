import { Api, JsonRpc, RpcError } from 'eosjs';
import {SigningRequest} from "eosio-signing-request"
import 'text-encoding-polyfill'
import { Linking } from 'react-native';

export async function transact() {
  const rpc = new JsonRpc('https://eos.greymass.com', { fetch });

  const api = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  const opts = {
    
    // Customizable ABI Provider used to retrieve contract data
    abiProvider: {
      getAbi: async (account:any) => (await api.getAbi(account))
    }
  }
  
  const actions = [{
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: '............1',
      permission: '............2'
    }],
    data: {
      from: "............1",
      to: "bar",
      quantity: "42.0000 EOS",
      memo: "Don't panic" }
}]
console.log("got hre")

  const request = await SigningRequest.create({ actions }, opts );
  Linking.openURL(request.encode())
}
  
