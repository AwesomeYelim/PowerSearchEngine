/**
 * 1. 컴포넌트 : powersearch\src\ellipsis.ts
 * 2. 작성일 : 2023.06.22 / 16시 55분 40초
 * 3. 작성자 : 홍예림
 * 4. 설명 : 말줄임표 (...) ellipsis 가 적용된 태그에만 title을 표시
 */

export type TitleEl = {
  clientWidth: number;
  scrollWidth: number;
  title: string;
  innerText: string;
  children: HTMLCollectionOf<Element>;
};

export type TitleType<T = { display?: "block" }> = {
  onFocus: (e: React.FocusEvent<TitleEl>) => void;
  onMouseOver: (e: React.MouseEvent<TitleEl>) => void;
  style?: React.CSSProperties & T;
};

export const titleCondition: TitleType = {
  style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", width: "100%" },
  onFocus: (e) => {
    e.stopPropagation();
  },
  onMouseOver: (e) => {
    e.stopPropagation();
    if (
      !e.currentTarget.children.length &&
      e.currentTarget.innerText &&
      e.currentTarget.clientWidth < e.currentTarget.scrollWidth
    ) {
      e.currentTarget.title = e.currentTarget.innerText;
    }
  },
};
