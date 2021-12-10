import React, { useState } from "react";
import axios from "axios";
import {} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Flex = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function Themeupload() {
  // 담을 state
  const [file, setFile] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // onChange역할
  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  // formData라는 instance에 담아 보냄
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const imageId = sessionStorage.getItem("imageId");

    if (file) {
      formData.append("theme", file, file.name);
      formData.append("imageId", imageId);
      try {
        await axios
          .post("/api/image/upload-theme", formData, {
            Headers: { "Content-Type": "multipart/result" },
          })
          .then((res) => {});
      } catch (err) {
        alert(err);
      }
    }
    try {
      await axios
        .post("/api/image/pre-image", { imageId: imageId })
        .then((result) => {
          console.log(result);
          if (
            result.data.s3_theme_img_url === "none" &&
            (result.data.selected_style === "none" ||
              result.data.selected_color === "none")
          ) {
            throw new Error();
          }
          setLoading(true);
          setTimeout(() => navigate("/interior/result"), 0);
        });
    } catch (err) {
      alert("테마 이미지를 업로드해야 합니다.");
      window.location.replace("/interior/themeupload");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div class="explanation-group" style={{ marginTop: "20px" }}>
          <div class="small-black-text" style={{ marginBottom : "20px"}}>
            원하는 테마 이미지를 업로드해주세요
            <br />
            (이미지가 없을 시 다음으로 넘어가주세요)
          </div>

          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={imgSrc}
            className={`image-preview ${imgSrc && "image-preview-show"}`}
          />
        </div>
        <input
          id="input-file"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
        <label
          className="input-file-button"
          for="input-file"
          style={{
            background: "#203864",
            color: "white",
            // alignItems: "center",
            marginLeft: "5%",
            marginTop: "30px",
            // width: "90%",
            height: "45px",
            borderRadius: "10px",
          }}
        >
          테마 이미지 업로드
        </label>
        <button
          type="submit"
          className="input-file-button"
          style={{
            background: "#203864",
            color: "white",
            marginLeft: "5%",
            marginTop: "20px",
            width: "90%",
            height: "45px",
            borderRadius: "10px",
          }}
        >
          결과 보기
        </button>
      </form>
    </div>
  );
}

export default Themeupload;
