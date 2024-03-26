import { Constants, Utils, WBPrivateAPI, WBProduct } from "./wb-private-api";
const fs = require("node:fs");

const keywords = ["HotWheels"];

/*
 * Select destination and init WBPrivateAPI with it
 * You can find more destionations in Constants.DESTINATIONS
 */
const destination = Constants.DESTINATIONS.MOSCOW;
const wbapi = new WBPrivateAPI({ destination });

const initiate = async () => {
  let result: ParsedData = {
    searches: [],
  };
  for (const keyword of keywords) {
    const searchResult: Search = {
      keyword,
    };
    result.searches.push(searchResult);

    try {
      /*
       * Search and Grab first 2 pages
       * with specified keyword
       */
      let catalog = await wbapi.search(keyword);
      if (catalog.pages > 1) {
        catalog = await wbapi.search(keyword, catalog.pages);
      }

      searchResult.products = catalog.products;
      searchResult.productCount = catalog.products?.length;

      // const product = catalog.products[0];
      // const stocks = await product.getStocks();
      // const feedbacks = await product.getFeedbacks();
    } catch (ex) {}
  }
  fs.writeFileSync("result.json", JSON.stringify(result, undefined, "\t"));
};

initiate();

interface ParsedData {
  searches: Search[];
}

interface Search {
  keyword: string;
  products?: WBProduct[];
  productCount?: number;
}
