import { Component } from 'react';
import * as anchor from "./Anchor"
import {Action} from "scatter-ts"
import {LinkSession} from 'anchor-link'
import * as storage from "./storage";

export interface Wallet {
    actor: string;
    permission: string;
    publicKey: string;
    wallet: string;
    protocol: string;
    chain: string;
  }
  
//   async function handleScatter( actions: Action[] ) {
//     console.log('common/wallet::handleScatter', { actions });
//     await scatter.login();
//     return scatter.transact( actions );
//   }
  export async function SignInAnchor(){
    const session = await anchor.login();
    return session
  }

  async function handleAnchor( actions: Action[],session:LinkSession  ) {
    if ( !session ) return "";
    const { transaction } = await session.transact({ actions });
    return transaction;
  }
  
  export function pushTransaction( actions: Action[], walletProtocol = "anchor",session:LinkSession ) {
  
    // input validation
    if ( !walletProtocol ) throw new (Error as any)('common/wallet::pushTransaction:', { err: "[walletProtocol] is required" });
    if ( !actions ) throw new (Error as any)('common/wallet::pushTransaction:', { err: "[actions] is required" });
    if ( !actions.length ) throw new (Error as any)('common/wallet::pushTransaction:', { err: "[actions] is empty" });
  
    // handle different wallet protocols
    if ( walletProtocol == "anchor" ) return handleAnchor( actions,session );
    // else if ( walletProtocol == "scatter" ) return handleScatter( actions );
    throw new (Error as any)('common/wallet::pushTransaction:', { err: "[walletProtocol] must be 'scatter|anchor'" });
  }
