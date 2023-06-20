import axios from "axios";
import cheerio, { AnyNode, BasicAcceptedElems } from "cheerio";
import puppeteer from "puppeteer";

// const getHtml = async () => {
//   try {
//     // 1
//     const html = await axios.get("https://www.genie.co.kr/chart/top200");
//     const daangn = await axios.get("https://www.daangn.com/region");
//     let ulList = [];
//     // 2

//     const $ = cheerio.load(daangn.data);
//     // 3
//     // const bodyList = $("tr.list");

//     const daangnList = $("article.card-top");
//     // console.log(bunList);
//     // console.log(bunList);
//     // console.log(daangnList);
//     daangnList.map((i, element) => {
//       console.log();
//       ulList[i] = {
//         rank: i + 1,
//         // 4
//         title: $(element).find("a.card-link div.card-desc h2.card-title").text().replace(/\s/g, ""),
//         // artist: $(element).find("td.info a.artist").text().replace(/\s/g, ""),
//       };
//     });
//     console.log("bodyList : ", ulList);
//   } catch (error) {
//     console.error(error);
//   }
// };

// getHtml();
type List = { rank: number; title: string; link: string };
// 번개장터
(async () => {
  // Launch a headless browser instance

  try {
    const bunjang = await axios.get(
      "https://api.bunjang.co.kr/api/1/find_v2.json?q=%ED%9C%B4%EB%A8%BC%EB%A9%94%EC%9D%B4%EB%93%9C&order=date&page=1&request_id=2023620203531&stat_device=w&n=100&stat_category_required=1&req_ref=search&version=4"
    );
    const jung = await axios.post("https://search-api.joongna.com/v3/category/search", {
      categoryFilter: [{ categoryDepth: 0, categorySeq: 0 }],
      firstQuantity: 80,
      jnPayYn: "ALL",
      keywordSource: "INPUT_KEYWORD",
      osType: 2,
      page: 1,
      parcelFeeYn: "ALL",
      priceFilter: { maxPrice: 2000000000, minPrice: 0 },
      maxPrice: 2000000000,
      minPrice: 0,
      productFilterType: "ALL",
      quantity: 80,
      registPeriod: "ALL",
      saleYn: "SALE_N",
      searchWord: "휴먼메이드",
      sort: "RECENT_SORT",
    });
    const dang = await axios.get(
      "https://www.daangn.com/search/%EC%B2%AD%EC%A3%BC%20%EC%9E%90%EC%A0%84%EA%B1%B0/more/flea_market?page=2"
    );
    console.log(
      { bunjang: bunjang.data.list.map((el: { [key in string]: string | boolean | null | [] | number }) => el.name) },
      { dang: dang.data },
      { jung: jung.data.data.items }
    );
  } catch (error) {
    console.log(error);
  }
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to your app's URL
  // await page.goto("https://www.daangn.com/region");
  await page.goto("https://m.bunjang.co.kr/search/products?order=date&q=%ED%9C%B4%EB%A8%BC%EB%A9%94%EC%9D%B4%EB%93%9C");
  // Perform interactions and extract data

  const html = await page.content();
  const $ = cheerio.load(html);
  const lists = $("div.sc-exkUMo > div.sc-kcDeIU");

  let ulList: List[] = [];

  lists.map((i: number, element: BasicAcceptedElems<AnyNode>) => {
    ulList[i] = {
      rank: i + 1,
      // 4
      title: $(element).find("a.sc-kasBVs div.sc-eInJlc .sc-gtfDJT").text().replace(/\s/g, ""),
      link: $(element).find("a.sc-kasBVs").attr("href") as string,
    };
  });
  // console.log("bodyList : ", ulList);

  const title = await page.title();

  await browser.close();
})();

// // 중고나라
// (async () => {
//   // Launch a headless browser instance
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   // Navigate to your app's URL
//   // await page.goto("https://www.daangn.com/region");

//   // Perform interactions and extract data

//   await page.goto("https://web.joongna.com/search/%ED%9C%B4%EB%A8%BC%EB%A9%94%EC%9D%B4%EB%93%9C?sort=RECENT_SORT");

//   const html = await page.content();
//   const $ = cheerio.load(html);
//   const lists = $("ul.grid > li");

//   let ulList: List[] = [];

//   lists.map((i: number, element: BasicAcceptedElems<AnyNode>) => {
//     ulList[i] = {
//       rank: i + 1,
//       // 4
//       title: $(element).find("a.group div.w-full h2.text-heading").text().replace(/\s/g, ""),
//       link: $(element).find("a.group").attr("href") as string,
//     };
//   });
//   console.log("bodyList : ", ulList);

//   const title = await page.title();
//   // const etc = await page.target();
//   // console.log("Page title:", title);
//   // console.log("Page :", lists);

//   // Continue crawling and interacting with your app as needed
//   // ...

//   // Close the browser
//   await browser.close();
// })();

// // 당근마켓
// (async () => {
//   // Launch a headless browser instance
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto("https://www.daangn.com/search/%EC%A0%A0%ED%8B%80%EB%AA%AC%EC%8A%A4%ED%84%B0");

//   const html = await page.content();
//   const $ = cheerio.load(html);
//   const lists = $("div#flea-market-wrap > article.flea-market-article");

//   let ulList: List[] = [];

//   lists.map((i: number, element: BasicAcceptedElems<AnyNode>) => {
//     ulList[i] = {
//       rank: i + 1,
//       // 4
//       title: $(element)
//         .find("a.flea-market-article-link div.article-info div.article-title-content span.article-title")
//         .text()
//         .replace(/\s/g, ""),
//       link: $(element).find("a.flea-market-article-link").attr("href") as string,
//     };
//   });
//   console.log("bodyList : ", ulList);

//   const title = await page.title();
//   // const etc = await page.target();
//   // console.log("Page title:", title);
//   // console.log("Page :", lists);

//   // Continue crawling and interacting with your app as needed
//   // ...

//   // Close the browser
//   await browser.close();
// })();
