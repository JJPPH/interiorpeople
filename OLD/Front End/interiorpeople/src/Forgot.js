import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  // 현재 유저가 어떤 유저인지 판별
  const forgotHanlder = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("/api/account/forgot", {
          id: id,
        })
        .then((result) => {
          alert(
            `새로운 비밀번호가 발급되었습니다. : ${result.data.newPassword}`
          );
          // 홈으로 이동
          navigate("/");
        });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div class="login">
      <h2>비밀번호 찾기</h2>
      <form onSubmit={forgotHanlder}>
        {/* 아이디 입력 */}
        <br />
        <div>
          <span style={{ float: "left", marginRight: 10 }}>
            찾고자 하는 아이디를 입력하세요
          </span>
          <div class="id" style={{ float: "right" }}>
            <input
              type="text"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
              }}
              placeholder="아이디"
            />
          </div>
          <br />
          <div class="submit">
            <button type="submit">비밀번호 찾기</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
