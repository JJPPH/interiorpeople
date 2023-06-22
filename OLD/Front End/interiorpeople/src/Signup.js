import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();

  const signUpHandler = async (e) => {
    const regEngAndNum = /^[a-zA-Z0-9]*$/;
    try {
      e.preventDefault();
      // TODO: 추후에 로그인 관련
      if (!regEngAndNum.test(id)) {
        setId("");
        alert("id를 다시 입력해 주세요");
        throw new Error();
      }
      if (!regEngAndNum.test(password)) {
        setId("");
        alert("id를 다시 입력해 주세요");
        throw new Error();
      }
      // if (password.length < 8) {
      //   alert("8자의 이상의 비밀번호를 사용해야 합니다.");
      //   throw new Error();
      // }
      // 비밀번호랑 비밀번호 확인이 다를 경우
      if (password !== passwordCheck) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        throw new Error();
      }
      // TODO: 추후에 로그인 관련 여기까지
      await axios.post("/api/account/register", { id: id, password: password });
      navigate("/");
      alert("회원가입이 완료되었습니다.");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <div class="login">
      <h2>회원가입</h2>
      <form onSubmit={signUpHandler}>
        <div class="login_id">
          <input
            type="text"
            name="input_id"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
            placeholder="아이디"
          />
        </div>
        <div class="login_pw">
          <input
            type="password"
            name="input_pw"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="비밀번호"
          />
        </div>
        <div class="login_pw">
          <input
            type="password"
            name="input_pw_check"
            value={passwordCheck}
            onChange={(e) => {
              setPasswordCheck(e.target.value);
            }}
            placeholder="비밀번호 확인"
          />
        </div>
        <div class="submit">
          <button type="submit">회원가입</button>
        </div>
      </form>
      <div class="sns_etc">SNS계정으로 간편 회원가입</div>
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

export default Signup;
