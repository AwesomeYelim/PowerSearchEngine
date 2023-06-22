import React, { useState } from "react";
import cheerio, { AnyNode, BasicAcceptedElems } from "cheerio";
import axios from "axios";

type List = {
  rank: number;
  title: string;
  content: string;
  link: string;
  img: string;
  region: string;
  price: string;
  time?: number;
};

type Obj = List & { [key in string]: string | boolean | null | [] | number };
interface Data {
  bunjang: Obj[];
  daangn: List[];
  jungna: Obj[];
}

const Item: React.FC<List> = (props) => {
  const { content, img, link, price, rank, region, title } = props;
  return (
    <a href={link}>
      <img src={img} alt={title} />
    </a>
  );
};
const App = (): JSX.Element => {
  const [data, setData] = useState<Data>();
  const submitHandler = async (e: any) => {
    e.preventDefault();

    try {
      const bunjang = await axios.get(
        `https://api.bunjang.co.kr/api/1/find_v2.json?q=${e.target.name.value}&/order=date&page=1&request_id=2023620203531&stat_device=w&n=100&stat_category_required=1&req_ref=search&version=4`
      );
      const jungna = await axios.post("https://search-api.joongna.com/v3/category/search", {
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
        searchWord: e.target.name.value,
        sort: "RECENT_SORT",
      });
      const daangn = await axios.get(`https://www.daangn.com/search/${e.target.name.value}/more/flea_market?page=1`);

      const $ = cheerio.load(daangn.data);
      const lists = $("article.flat-card");

      let ulList: List[] = [];

      lists.map((i: number, element: BasicAcceptedElems<AnyNode>) => {
        ulList[i] = {
          rank: i + 1,
          // 4
          title: $(element)
            .find("a.flea-market-article-link div.article-info div.article-title-content span.article-title")
            .text()
            .replace(/\s/g, ""),
          content: $(element)
            .find("a.flea-market-article-link div.article-info div.article-title-content span.article-content")
            .text()
            .replace(/\s/g, ""),
          link: $(element).find("a.flea-market-article-link").attr("href") as string,
          img: $(element).find("a.flea-market-article-link div.card-photo img").attr("src") as string,
          region: $(element).find("a.flea-market-article-link p.article-region-name").text().replace(/\s/g, ""),
          price: $(element).find("a.flea-market-article-link p.article-price").text().replace(/\s/g, ""),
        };
      });

      console.log(ulList);
      setData({ bunjang: bunjang.data.list, daangn: ulList, jungna: jungna.data.data.items });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: 300,
          border: "1px solid black",
        }}
        onSubmit={submitHandler}>
        <label htmlFor="name" className="mb-2 italic">
          검색창
        </label>
        <input type="text" id="name" name="name" autoComplete="name" required />
        <button type="submit">검색</button>
      </form>
      {data?.bunjang.map((item) => {
        return <Item {...item} />;
      })}
      {data?.daangn.map((item) => {
        return <Item {...item} />;
      })}
      {data?.jungna.map((item) => {
        return <Item {...item} />;
      })}
    </>
  );
};

export default App;
