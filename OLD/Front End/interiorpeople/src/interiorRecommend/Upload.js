import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css";
import PuffLoader from "react-spinners/PuffLoader";
import styled from "styled-components";

const Flex = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function Upload() {
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
  // 다음 버튼 누르기
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!file) {
      alert("이미지를 업로드해주세요.");
    } else {
      formData.append("image", file, file.name);
      try {
        setLoading(true);
        await axios
          .post("/api/image/seg", formData, {
            Headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            // 세그멘테이션 되지 않았을 경우
            if (res.data.segmentation === false) {
              alert(
                "해당 이미지에서 가구가 인식되지 않습니다. 다른 이미지를 업로드해주세요."
              );
              window.location.replace("/interior/upload");
            } else {
              // 세그멘테이션이 된 경우
              sessionStorage.setItem("imageId", res.data.imageId);
              setTimeout(() => navigate("/interior/selectstyle"), 5000);
            }
          });
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <Flex>
            <h3>이미지 분석중입니다...</h3>
            <br />
            <PuffLoader size="300" color="black" radius="8" />
          </Flex>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div class="explanation-group" style={{ marginTop: "20px" }}>
            <div class="small-black-text">
              인테리어 분석을 하고 싶은 방 사진을 등록해주세요
            </div>

            <img
              alt=""
              src={imgSrc}
              className={`image-preview ${imgSrc && "image-preview-show"}`}
              style={{ border: "0", outline: "0", marginTop: "30px" }}
            />
          </div>
          <input
            id="input-file"
            type="file"
            onChange={handleFileChange}
            accept="image/jpg,image/jpeg"
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
            이미지 업로드
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
            다음으로
          </button>
        </form>
      )}
    </div>
  );
}

export default Upload;
