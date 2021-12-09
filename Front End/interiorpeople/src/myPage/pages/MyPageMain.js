/** 마이 페이지 메인 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../fonts/MyPageMain.css";
import Cookies from "universal-cookie";

const MyPageMain = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    if (!cookies.get("sid")) {
      window.location.replace("/login");
    } else {
      try {
        axios.get(`/api/mypage`).then((result) => {
          setUserName(result.data.name);
          setUserId(result.data.id);
          setUserProfilePhoto(result.data.s3_profilephoto_img_url);
        });
      } catch (err) {
        alert("오류가 발생했습니다.");
      }
    }
  }, []);

  return (
    <div>
      {userName || userId ? (
        <div>
          {userProfilePhoto !== "" ? (
            <img
              alt=""
              src={`/uploads/${userProfilePhoto}`}
              style={{
                height: "90px",
                left: "0",
                marginLeft: "20%",
                marginTop: "40px",
                float: "left",
              }}
            />
          ) : (
            // 나의 프로필 사진 불러오기
            <img
              alt=""
              src={require("../../img/profile.png").default}
              style={{
                height: "90px",
                left: "0",
                marginLeft: "20%",
                marginTop: "40px",
                float: "left",
              }}
            />
          )}

          <div
            class="explanation-group"
            style={{ marginTop: "50px", display: "inline-block" }}
          >
            <div style={{ marginLeft: "35%" }}>{userName}</div>
            <div style={{ marginLeft: "35%" }}>{userId}</div>
          </div>
          <div style={{ marginTop: "70px" }}>
            <ul class="icon-wrapper">
              <li class="icon">
                <Link to="/mypage/profile">
                  <img
                    alt=""
                    src={require("../../img/gallery.png").default}
                    style={{
                      marginLeft: "20%",
                      width: "55%",
                      maxWidth: "100px",
                      display: "block",
                    }}
                  />
                  프로필 편집
                </Link>
              </li>
              <li class="icon">
                <Link to="/mypage/bookmark">
                  <img
                    alt=""
                    src={require("../../img/bookmark.png").default}
                    style={{
                      marginLeft: "20%",
                      width: "60%",
                      maxWidth: "100px",
                      display: "block",
                    }}
                  />
                  북마크
                </Link>
              </li>
              <li class="icon">
                <Link to="/mypage/history">
                  <img
                    alt=""
                    src={require("../../img/records.png").default}
                    style={{
                      marginLeft: "20%",
                      maxWidth: "100px",
                      width: "53%",
                      display: "block",
                    }}
                  />
                  추천 기록
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyPageMain;
