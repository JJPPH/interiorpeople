// cSpell:ignore : mypost,postlist
/** 메인 페이지 */
import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <Link to="mypost/write">
      <button style={{ marginTop: "20px", marginLeft: "5%", width: "90%", height: 30, background: "#203864", 
        color: "white",height: "35px", borderRadius: "10px" }}>글쓰기</button>
      </Link>
      <Link to="mypost">
      <button style={{ marginTop: "10px", marginLeft: "5%", width: "90%", height: 30, background: "#203864", 
        color: "white",height: "35px", borderRadius: "10px" }}>나의글</button>
      </Link>

      <Link to="postlist">
      <button style={{ marginTop: "10px", marginLeft: "5%", width: "90%", height: 30, background: "#203864", 
        color: "white",height: "35px", borderRadius: "10px" }}>포스트리스트</button>
      </Link>
    </div>
  );
};

export default MainPage;
