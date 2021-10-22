import AnchorLink, { LinkSession } from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';


import fetch from 'isomorphic-fetch';
import { EOSIO_CHAIN_ID, EOSIO_RPC } from '../constants/AnchorConfig';

(global as any).fetch = fetch;

export const link = new AnchorLink({
  transport: new AnchorLinkBrowserTransport(),
  chains: [
    {
      chainId: EOSIO_CHAIN_ID,
      nodeUrl: EOSIO_RPC,
    },
  ],
});

export async function getAccount() {
  console.log('anchor::getAccount');
  return sessionToAccount(await login());
}

export async function disconnect() {
  console.log('anchor::disconnect');
  try {
    await link.clearSessions('app.io');
  } catch (err) {
    console.log('anchor::disconnect', { err });
  }
}

function sessionToAccount(session: LinkSession | null) {
  console.log('anchor::sessionToAccount');
  if (!session) return {};
  const { auth, publicKey } = session;
  const { actor, permission } = auth;
  return {
    actor: actor.toString(),
    permission: permission.toString(),
    publicKey: publicKey.toString(),
    authorization: auth.toString(),
  };
}

export async function login() {
    // console.log('anchor::login');
    // const sessions = await link.listSessions('pomelo.io');
    // if (sessions.length) return await link.restoreSession('pomelo.io');
    // else return (await link.login('pomelo.io')).session;
    return (await link.login('eos-marketplace')).session
  }
