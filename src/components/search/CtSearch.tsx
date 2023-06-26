import React, { useCallback, useEffect, useRef, useState } from "react";
import cheerio, { AnyNode, BasicAcceptedElems } from "cheerio";
import axios from "axios";
import Logo from "../../asset/image/logo.png";
import search from "../../asset/image/search.svg";
import { Item } from "./SearchItem";
import "./CtSearch.scss";

export type List<T extends keyof Data = keyof Data> = {
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

const CtSearch = (): JSX.Element => {
  const [data, setData] = useState<List[]>();
  const divRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  let pageCount = 1;

  const scroll = async (pageNum: number) => {
    const target = (formRef.current as HTMLFormElement & { name: { value: string } }).name.value;

    try {
      const bunjang = await axios.get(
        `https://api.bunjang.co.kr/api/1/find_v2.json?q=${target}&/order=date&page=${pageNum}&request_id=2023620203531&stat_device=w&n=100&stat_category_required=1&req_ref=search&version=4`
      );
      const jungna = await axios.post("https://search-api.joongna.com/v3/category/search", {
        categoryFilter: [{ categoryDepth: 0, categorySeq: 0 }],
        firstQuantity: 80,
        jnPayYn: "ALL",
        keywordSource: "INPUT_KEYWORD",
        osType: 2,
        page: pageNum,
        parcelFeeYn: "ALL",
        priceFilter: { maxPrice: 2000000000, minPrice: 0 },
        maxPrice: 2000000000,
        minPrice: 0,
        productFilterType: "ALL",
        quantity: 80,
        registPeriod: "ALL",
        saleYn: "SALE_N",
        searchWord: target,
        sort: "RECENT_SORT",
      });

      let num = pageNum;
      let dangStr = "";

      const { data } = await axios.get(`https://www.daangn.com/search/${target}/more/flea_market?page=${num}`);

      // const daangn = async (num: number) => {
      //   /** 한번 호출당 list 12개씩옴  */
      //   const { data } = await axios.get(`https://www.daangn.com/search/${target}/more/flea_market?page=${num}`);
      //   if (num < 20) {
      //     dangStr += data;
      //     num++;
      //     await daangn(num);
      //   }

      //   return dangStr;
      // };

      // const $ = cheerio.load(await daangn(num));
      const $ = cheerio.load(data);

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
          region: $(element).find("a.flea-market-article-link p.article-region-name").text(),
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
          const time = el.img.match("/\\d{6}/");
          const calcT = time && (time as RegExpMatchArray)[0];
          const date = calcT && new Date(+calcT.slice(1, 5), +calcT.slice(5, 7) - 1, 1, 12, 0, 0, 0);

          return {
            ...el,
            link: `https://www.daangn.com${el.link}`,
            time: date ? date.getTime() / 1000 : 0,
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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setData([]);

    try {
      const bunjang = await axios.get(
        `https://api.bunjang.co.kr/api/1/find_v2.json?q=${
          (e.target as HTMLFormElement & { name: { value: string } }).name.value
        }&/order=date&page=0&request_id=2023620203531&stat_device=w&n=100&stat_category_required=1&req_ref=search&version=4`
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
        searchWord: (e.target as HTMLFormElement & { name: { value: string } }).name.value,
        sort: "RECENT_SORT",
      });

      let num = 1;
      let dangStr = "";
      const daangn = async (num: number) => {
        /** 한번 호출당 list 12개씩옴  */
        const { data } = await axios.get(
          `https://www.daangn.com/search/${
            (e.target as HTMLFormElement & { name: { value: string } }).name.value
          }/more/flea_market?page=${num}`
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
          region: $(element).find("a.flea-market-article-link p.article-region-name").text(),
          price: $(element).find("a.flea-market-article-link p.article-price").text().replace(/\s/g, ""),
        };
      });

      const priceComma = (price: number) => new Intl.NumberFormat("ko-KR").format(price);

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
            price: `${priceComma(+price)}원`,
            time: update_time,
          };
        }),
        daangn: ulList.map((el) => {
          const time = el.img.match("/\\d{6}/");
          const calcT = time && (time as RegExpMatchArray)[0];
          const date = calcT && new Date(+calcT.slice(1, 5), +calcT.slice(5, 7) - 1, 1, 12, 0, 0, 0);

          return {
            ...el,
            link: `https://www.daangn.com${el.link}`,
            time: date ? date.getTime() / 1000 : 0,
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
            price: `${priceComma(+price)}원`,
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

  const handScroll = useCallback(() => {
    const [scrollH, scrollY] = [(divRef.current as HTMLDivElement).scrollHeight, window.scrollY];

    if (scrollH - scrollY > 100 && scrollH - scrollY < 1000) {
      pageCount++;
      // console.log(pageCount);

      scroll(pageCount);

      window.scrollTo(0, window.scrollY - 500);
      // submitHandler();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handScroll);
  }, [handScroll]);

  return (
    <div className="wrap">
      <form onSubmit={submitHandler} ref={formRef}>
        <label htmlFor="name">
          <img src={Logo} alt="logo" />
        </label>
        <div className="input_wrap">
          <input type="text" id="name" name="name" autoComplete="name" required placeholder="검색어를 입력하세요." />
          <button type="submit">
            <img className="search_i" src={search} alt="search" />
          </button>
        </div>
      </form>
      <div className="data_list" ref={divRef}>
        {!!data?.length &&
          data.map((item) => {
            return <Item key={item.rank} {...item} />;
          })}
      </div>
    </div>
  );
};

export default CtSearch;
