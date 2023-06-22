import React, { useState } from "react";
import cheerio, { AnyNode, BasicAcceptedElems } from "cheerio";
import axios from "axios";
import classNames from "classnames";
import { titleCondition } from "./ellipsis";
import { elapsedTime } from "./timeCalc";
import "./App.scss";

type List<T extends keyof Data = keyof Data> = {
  rank: `${T} ${number}`;
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
  bunjang: List[];
  daangn: List[];
  jungna: List[];
}

const Item: React.FC<List> = (props) => {
  const { content, img, link, price, rank, region, title, time } = props;

  return (
    <a href={link} className={classNames([rank])} target="_blank" rel="noreferrer">
      <img src={img} alt={title} style={{ width: 150, height: "50%" }} />
      <h3 {...titleCondition}>{title}</h3>
      <span>{price}</span>
      <span className="region" {...titleCondition}>
        {region}
      </span>
      <span>{elapsedTime(time as number)}</span>
    </a>
  );
};
const App = (): JSX.Element => {
  const [data, setData] = useState<List[]>();
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

      let num = 1;
      let dangStr = "";
      const daangn = async (num: number) => {
        /** 한번 호출당 list 12개씩옴  */
        const { data } = await axios.get(
          `https://www.daangn.com/search/${e.target.name.value}/more/flea_market?page=${num}`
        );
        if (num < 10) {
          dangStr += data;
          num++;
          await daangn(num);
        }

        return dangStr;
      };

      const $ = cheerio.load(await daangn(num));

      const lists = $("article.flat-card");

      let ulList: List[] = [];

      lists.map((i: number, element: BasicAcceptedElems<AnyNode>) => {
        ulList[i] = {
          rank: `daangn ${i + 1}`,
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
      const eachData = {
        bunjang: bunjang.data.list.map((el: Obj, i: number) => {
          const { name, tag, update_time, price, location, product_image, pid } = el;
          return {
            rank: `bunjang ${i + 1}`,
            title: name,
            content: tag,
            link: `https://m.bunjang.co.kr/products/${pid}`,
            img: product_image,
            region: location,
            price: `${price}원`,
            time: update_time,
          };
        }),
        daangn: ulList.map((el) => {
          const time = el?.img?.match("/\\d{6}/");
          const calcT = (time as RegExpMatchArray)[0];
          const date = new Date(+calcT.slice(1, 5), +calcT.slice(5, 7) - 1, 1, 12, 0, 0, 0);
          return {
            ...el,
            link: `https://www.daangn.com${el.link}`,
            time: date.getTime() / 1000,
          };
        }),
        jungna: jungna.data.data.items.map((el: Obj, i: number) => {
          const { title, sortDate, price, locationNames, url, seq } = el;
          const [local] = locationNames as string[];
          return {
            rank: `jungna ${i + 1}`,
            title,
            content: title,
            link: `https://web.joongna.com/product/${seq}`,
            img: url,
            region: local,
            price: `${price}원`,
            time: new Date(sortDate as string).getTime() / 1000,
          };
        }),
      };

      setData(
        [...eachData.bunjang, ...eachData.daangn, ...eachData.jungna].sort((a, b) => {
          return b.time - a.time;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className="data_list">
        {data?.map((item) => {
          return <Item {...item} />;
        })}
      </div>
    </>
  );
};

export default App;
