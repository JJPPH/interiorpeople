import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

/** 유저 인증 관련 컨텍스트 */
import { AuthContext } from "./context/AuthContext";

function Login() {
  const cookies = new Cookies();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [, setUser] = useContext(AuthContext);

  // 현재 유저가 어떤 유저인지 판별
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/account/login",
        {
          id: id,
          password: password,
        },
        { withCredentials: true }
      );

      // 홈으로 이동
      alert(`로그인되었습니다.`);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    } finally {
      setUser(cookies.get("user"));
    }
  };

  return (
    <div class="login">
      <h2>로그인</h2>
      <form onSubmit={loginHandler}>
        {/* 아이디 입력 */}
        <div class="login_id">
          <input
            type="text"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
            placeholder="아이디"
          />
        </div>
        {/* 비밀번호 입력 */}
        <div class="login_pw">
          <input
            type="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="비밀번호"
          />
        </div>
        {/* !!!!!! 이 밑으로 수정 필요 !!!!!! */}
        <div class="submit">
          <button type="submit">로그인</button>
        </div>
      </form>
      <div class="login_etc"></div>
      <div class="sns_etc">SNS계정으로 간편 로그인/회원가입</div>
      <div class="login_sns">
        <li>
          <a href="">
            <img src="img/facebook.png" width="67px" />
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>
        <li>
          <a href="">
            <img src="img/kakao.png" width="63px" />
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>
        <li>
          <a href="">
            <img src="img/naver.png" width="61px" />
            <i class="fab fa-twitter"></i>
          </a>
        </li>
      </div>
    </div>
  );
}

export default Login;
