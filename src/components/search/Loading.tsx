import React from "react";
import jung from "../../asset/image/jung.svg";
import bun from "../../asset/image/bun.svg";
import carrot from "../../asset/image/carrot.svg";
import "./Loading.scss";

interface Props {
  data?: number;
}

export const Loading = (): JSX.Element => {
  //
  return (
    <div className="loading_wrap">
      <div className="img_wrap">
        <img className="jung" src={jung} alt="jung" />
        <img className="bun" src={bun} alt="bun" />
        <img className="carrot" src={carrot} alt="carrot" />
      </div>
    </div>
  );
};
