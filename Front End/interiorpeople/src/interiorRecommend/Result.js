import React, { useState, useEffect } from "react";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";
import styled from "styled-components";

const Flex = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function Result() {
  const [originalImageUrl, setOriginalImageUrl] = useState(undefined);
  const [pocessedImageUrl, setProcessedImageUrl] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [style, setStyle] = useState(undefined);
  const [color, setColor] = useState(undefined);
  const [colorStyle, setColorStyle] = useState(undefined);

  useEffect(() => {
    try {
      const imageId = sessionStorage.getItem("imageId");
      // 변환된 이미지 불러오기
      axios
        .post("/api/image/local-style-transfer", { imageId: imageId })
        .then((result) => {
          console.log(result);
          setProcessedImageUrl(result.data.transferedImage);
          setOriginalImageUrl(result.data.originalImage);
          if (result.data.colorStyle) {
            setStyle(result.data.color);
            setColor(result.data.style);
          }
          setColorStyle(result.data.colorStyle);
        });
    } catch (err) {
      alert("에러가 발생했습니다. 메인으로 돌아갑니다.");
      window.location.replace("/");
    }
    setTimeout(() => setLoading(false), 4000);
  }, []);

  // 이미지 보이기
  return (
    <div>
      {loading ? (
        <div>
          <Flex style={{ textAlign: "center" }}>
            <h2>
              이미지를 변환하고 있습니다...
            </h2>
            <br />
            <PuffLoader size="300" color="black" radius="8" />
          </Flex>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ marginLeft: "50%", width: "75%", fontWeight: "bolder", fontSize: "27px", marginTop: "20px"  }}>변환 결과</div>
          {style === undefined ? <></> : <h3 style={{marginTop: "20px"}}>원본 사진</h3>}
          <br />
          {originalImageUrl !== undefined ? (
            <img
              alt=""
              src={`/uploads/${originalImageUrl}`}
              style={{ width: "80%", height: "auto", objectFit: "cover" }}
            ></img>
          ) : (
            <></>
          )}

          <br />
          {colorStyle === undefined ? (
            <></>
          ) : colorStyle ? (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <h3 style={{ display: "inline" }}></h3>
              <h3
                style={{ display: "inline", color: "blue", fontWeight: "bold" }}
              >
                {style}
              </h3>
              <h3 style={{ display: "inline" }}>과</h3>{" "}
              <h3
                style={{ display: "inline", color: "blue", fontWeight: "bold" }}
              >
                {color}
              </h3>
              <h3 style={{ display: "inline" }}>
                으로 <br />
                변환된 결과를 알려드려요
              </h3>
            </div>
          ) : (
            <h3 style={{ textAlign: "center" }}>
              업로드하신 테마로 변환된 결과를 알려드려요
            </h3>
          )}
          {pocessedImageUrl !== undefined ? (
            <img
              alt=""
              src={`/uploads/${pocessedImageUrl}`}
              style={{ width: 200, height: 200, objectFit: "cover", marginTop: "15px" }}
            ></img>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default Result;
