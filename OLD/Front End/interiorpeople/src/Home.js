import React from "react";

// 홈화면에는 메인 이미지 하나만
// 하단에 뭐 @all rights reserved 같은 거 넣고 싶으면 넣고 아님 말고

const Home = () => {
  return (
    <div>
      <img alt="" src={require("./img/main.png").default} width="100%" />
    </div>
  );
};

export default Home;
