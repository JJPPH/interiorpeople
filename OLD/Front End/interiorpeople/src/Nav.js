import React, { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import "./fonts/nav.css";

/** 유저 인증 관련 컨텍스트 */
import { AuthContext } from "./context/AuthContext";

function Nav() {
  const [user, setUser] = useContext(AuthContext);
  const cookies = new Cookies();
  const logoutHandler = async () => {
    try {
      // 두번째 인자는 req.body이고 세번째 인자는 설정임
      await axios.get("/api/account/logout");
      setUser();
      cookies.remove("loginData");
      // alert("로그아웃되었습니다.");
      window.location.replace("/");
    } catch (err) {
      // console.error(err);
      alert(err.message);
    }
  };

  return (
    <div>
      <div class="home">Interior People</div>
      <div class="btn_group" style={{ paddingBottom: "20px" }}>
        {/* 로그인이 되어있으면 로그아웃만 보임 */}
        {/* 로그인이 되어 있지 않으면 로그인,회원가입이 보임 */}
        {user ? (
          <button class="btn_logout"
            onClick={logoutHandler}
            style={{ float: "right" }}
          >
            로그아웃
          </button>
        ) : (
          <>
            <Link to="./signup">
              <button class="btn2" style={{ float: "right" }}>
                회원가입
              </button>
            </Link>
            <Link to="./login">
              <button class="btn1" style={{ float: "right" }}>
                로그인{user}
              </button>
            </Link>
          </>
        )}
      </div>
      <ul style={{ fontSize: " 14px" }}>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
        <li>
          <Link to="/interior/upload">인테리어 추천</Link>
        </li>
        <li>
          <Link to="/community">커뮤니티</Link>
        </li>
        <li>
          <Link to="/support">고객센터</Link>
        </li>
      </ul>
      <hr />
    </div>
  );
}

export default Nav;
