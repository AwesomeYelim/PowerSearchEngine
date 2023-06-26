/**
 * 1. 컴포넌트 : powersearch\src\components\search\searchItem.tsx
 * 2. 작성일 : 2023.06.23 / 11시 09분 19초
 * 3. 작성자 : 홍예림
 * 4. 설명 : search list item
 */

import classNames from "classnames";
import { titleCondition } from "../../common/ellipsis";
import { elapsedTime } from "../../common/timeCalc";
import { List } from "./CtSearch";

export const Item: React.FC<List> = (props) => {
  const { content, img, link, price, rank, region, title, time } = props;

  return (
    <a href={link} className={classNames([rank])} target="_blank" rel="noreferrer">
      <img src={img} alt={title} />
      <h3 {...titleCondition}>{title}</h3>
      <span>{price}</span>
      <span className="region" {...titleCondition}>
        {region ? region : "위치 정보 없음"}
      </span>
      <div className="item_footer">
        <i />
        <span className="before_time">{elapsedTime(time as number)}</span>
      </div>
    </a>
  );
};
