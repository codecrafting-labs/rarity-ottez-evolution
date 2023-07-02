/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

import axios from 'axios'

const makeReqest = async (query) => {
  return axios.post(`${process.env.VUE_APP_OBJKT_API_URL}/v3/graphql`, { query: query })
}

const FA2_ADDRESS = process.env.VUE_APP_FA2_ADRESS;

export default {

  async getActiveSales () {
    const queryFn = (offset) => `query ActiveSales {
  fa(where: {contract: {_eq: "${FA2_ADDRESS}"}}) {
    listings(
      where: {status: {_eq: "active"}, currency_id: {_eq: "1"}}
      order_by: {price: asc}
      limit: 500
      offset: ${offset}
    ) {
      status
      price
      timestamp
      token {
        token_id
        holders(where: {quantity: {_eq: "1"}}) {
          holder_address
        }
      }
      seller_address
    }
    english_auctions(
      where: {status: {_eq: "active"}, currency_id: {_eq: "1"}}
      limit: 500
      offset: ${offset}
    ) {
      status
      reserve
      price_increment
      hash
      end_time
      extension_time
      token {
        token_id
      }
      bids(limit: 1, order_by: {amount: desc}) {
        amount
      }
    }
    dutch_auctions(
      where: {status: {_eq: "active"}, currency_id: {_eq: "1"}}
      limit: 500
      offset: ${offset}
    ) {
      end_price
      end_time
      hash
      token {
        token_id
      }
      start_price
      start_time
      status
    }
  }
}`;

    let r = { asks: [], english_auctions: [], dutch_auctions: [] };

    let offset = 0;
    while (true) {
      const res = await makeReqest(queryFn(offset));
      if (res.data && res.data.data && res.data.data.fa.length) {
        const r2 = res.data.data.fa[0];
        r.english_auctions.push.apply(r.english_auctions, r2.english_auctions);
        r.asks.push.apply(r.asks, r2.listings.filter(el =>
          el.token.holders[0].holder_address === "KT1FvqJwEDWb1Gwc55Jd1jjTHRVWbYKUUpyq" ||
          el.token.holders[0].holder_address === el.seller_address
        ));
        r.dutch_auctions.push.apply(
          r.dutch_auctions,
          r2.dutch_auctions.filter(el => new Date(el.end_time) > new Date())
        );

        if (r2.listings.length < 500 && r.english_auctions.length < 500 && r2.dutch_auctions.length < 500) {
          break;
        }

        offset += 500;
      } else {
        break;
      }
    }

    return r;
  }

}
