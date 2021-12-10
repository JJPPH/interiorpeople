import React, { useState, useContext } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

/** 유저 인증 관련 컨텍스트 */
// import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  // const [, setUser] = useContext(AuthContext);

  // 이름 체인지
  const nameChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/api/mypage/profile", {
        name,
      });

      // 홈으로 이동
      alert(`변경되었습니다.`);
      window.location.replace("/mypage/profile");
    } catch (err) {
      console.log(err.message);
    }
  };

  // 비밀번호 체인지
  const passwordChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/api/mypage/profile", {
        password,
      });

      // 홈으로 이동
      alert(`변경되었습니다.`);
      window.location.replace("/mypage/profile");
    } catch (err) {
      console.log(err.message);
    }
  };

  // 프로필 사진 체인지
  const profilePhotoChangeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    try {
      await axios.patch("/api/mypage/profile", formData, {
        Headers: { "Content-Type": "multipart/form-data" },
      });

      // 홈으로 이동
      alert(`변경되었습니다.`);
      window.location.replace("/mypage/profile");
    } catch (err) {
      console.log(err.message);
    }
  };

  const imageSelectHandler = async (event) => {
    /** 이미지 파일의 정보를 읽어와서 file변수에 저장 */
    const imageFile = event.target.files[0];
    setImage(imageFile);
    console.log(imageFile);
  };

  return (
    <div>
      <div className="name" style={{marginLeft: "15%", marginTop: "30px"}}>
        <form onSubmit={nameChangeSubmit}>
          <h4>이름</h4>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder=""
          />
          <button class="change-btn" type="submit">변경하기</button>
        </form>
      </div>

      <div className="password" style={{marginLeft: "15%", marginTop: "12px"}}>
        <form onSubmit={passwordChangeSubmit}>
          <h4>비밀번호</h4>
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder=""
          />
          <button type="submit" class="change-btn" >변경하기</button>
        </form>
      </div>

      <div className="imageSelect" style={{marginLeft: "10%", marginTop: "40px"}}>
        <h4>프로필사진</h4>
        <form onSubmit={profilePhotoChangeSubmit}>
          {/* type="file"로 할 경우 모든 파일이 전부 가능. 따라서 accept를 사용 */}
          <input
            id="image"
            type="file"
            multiple={false}
            accept="image/*" // 오직 이미지만
            onChange={imageSelectHandler}
          />
          <button class="change-btn" type="submit">변경하기</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
