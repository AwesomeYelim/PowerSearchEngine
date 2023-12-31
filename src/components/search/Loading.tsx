import { styled } from "styled-components";
import jung from "../../asset/image/jung.svg";
import bun from "../../asset/image/bun.svg";
import carrot from "../../asset/image/carrot.svg";

// import "./Loading.scss";

const LoadingWrap = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(105, 105, 105, 0.401);
  z-index: 99;
  .img_wrap {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 100px;
    height: 100px;
    img {
      position: absolute;
      transition: all 0.2s;
      width: 60px;
      height: 60px;
      &.jung {
        top: 60px;
        left: 10px;
        width: 50px;
        height: 50px;
        animation: jun_ani 2.5s ease-in-out 0s infinite normal;
      }
      &.carrot {
        top: 30px;
        left: -60px;
        animation: carrot_ani 2.5s ease-in-out 0s infinite normal;
      }
      &.bun {
        top: 0px;
        left: 0px;
        animation: bun_ani 2.5s ease-in-out 0s infinite normal;
      }
    }

    @keyframes jun_ani {
      0% {
        width: 50px;
        height: 50px;
      }
      15% {
        width: 0px;
        height: 0px;
      }
      30% {
        top: 10px;
        left: 10px;
        width: 50px;
        height: 50px;
      }
      45% {
        width: 0px;
        height: 0px;
      }
      60% {
        top: 40px;
        left: -50px;
        width: 50px;
        height: 50px;
      }
      75% {
        width: 0px;
        height: 0px;
      }
      100% {
        width: 50px;
        height: 50px;
      }
    }
    @keyframes carrot_ani {
      0% {
        width: 60px;
        height: 60px;
      }
      15% {
        width: 0px;
        height: 0px;
      }
      30% {
        top: 60px;
        left: 10px;
        width: 60px;
        height: 60px;
      }
      45% {
        width: 0px;
        height: 0px;
      }
      60% {
        top: 0px;
        left: 0px;
        width: 60px;
        height: 60px;
      }
      75% {
        width: 0px;
        height: 0px;
      }
      100% {
        width: 60px;
        height: 60px;
      }
    }
    @keyframes bun_ani {
      0% {
        width: 60px;
        height: 60px;
      }
      15% {
        width: 0px;
        height: 0px;
      }
      30% {
        top: 30px;
        left: -60px;
        width: 60px;
        height: 60px;
      }
      45% {
        width: 0px;
        height: 0px;
      }
      60% {
        top: 60px;
        left: 10px;
        width: 60px;
        height: 60px;
      }
      75% {
        width: 0px;
        height: 0px;
      }
      100% {
        width: 60px;
        height: 60px;
      }
    }
  }
`;
export const Loading = (): JSX.Element => {
  //
  return (
    <LoadingWrap className="loading_wrap">
      <div className="img_wrap">
        <img className="jung" src={jung} alt="jung" />
        <img className="bun" src={bun} alt="bun" />
        <img className="carrot" src={carrot} alt="carrot" />
      </div>
    </LoadingWrap>
  );
};
