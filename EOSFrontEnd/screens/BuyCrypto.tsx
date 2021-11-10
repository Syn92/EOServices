// import OnramperWidget from "@onramper/widget";
import React from "react";
import {WebView} from "react-native-webview"

export default function BuyCrypto() {
  const wallets = {
    BTC: { address: "btcAddr" },
    BNB: { address: "bnbAddress", memo: "cryptoTag" },
  };

  return (
    <WebView 
      source={{ uri: "https://widget.onramper.com?color=04b388&apiKey=pk_test_x5M_5fdXzn1fxK04seu0JgFjGsu7CH8lOvS9xZWzuSM0&onlyGateways=Moonpay&onlyCryptos=EOS&onlyFiat=CAD"}}
    ></WebView>
//     <div
//       style={{
//         width: "440px",
//         height: "595px",
//       }}
//     >
//        <OnramperWidget
// //         API_KEY={"TestKey"}
// //         color={"white"}
// //         fontFamily={"Arial"}
// //         defaultAddrs={wallets}
// //         defaultAmount={100}
// //         defaultCrypto={"EOS"}
// //         defaultFiat={"CAD"}
// //         defaultFiatSoft={"USD"}
// //         defaultPaymentMethod={"creditCard"}
// //         filters={{
// //           onlyCryptos: ["EOS"],
// //           onlyFiat: ["CAD"],
// //         }}
// //         isAddressEditable={true}
// //         //amountInCrypto={amountInCrypto}
// //         //redirectURL={redirectURL}
//       />
//      </div>
  );
}