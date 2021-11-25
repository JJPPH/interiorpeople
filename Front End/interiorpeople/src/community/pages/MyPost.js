// cSpell:ignore : mypost
import React, { useRef, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/** 컴포넌트 임포트 */
// import PostList from "../components/PostList";
// import UploadForm from "../components/UploadForm";

import "./PostList.css";

const MyPost = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [postUrl, setPostUrl] = useState("/server/community/mypost");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const pastPostUrlRef = useRef();
  const elementRef = useRef(null); // 무한 스크롤 적용에 필요

  useEffect(() => {
    if (pastPostUrlRef.current === postUrl) {
      return;
    }
    setImageLoading(true);
    axios
      .get(postUrl)
      .then((result) => {
        setMyPosts(
          (prevData) => [...prevData, ...result.data]
          // Array.from(new Set([...prevData, ...result.data]))
        );
      })
      .catch((err) => {
        console.error(err);
        setImageError(err);
      })
      .finally(() => {
        setImageLoading(false);
        pastPostUrlRef.current = postUrl;
      });
  }, [postUrl]);

  // ? 리렌더링 될 때마다 함수가 새로 만들어짐 -> useCallback 사용
  const loaderMoreImages = useCallback(() => {
    if (imageLoading || myPosts.length === 0) {
      return;
    }
    const lastPostId = myPosts[myPosts.length - 1]._id;
    setPostUrl(`/server/community/mypost?lastPostId=${lastPostId}`);
  }, [myPosts, imageLoading, setPostUrl]);

  //무한 스크롤 해당 엘리먼트 추적
  useEffect(() => {
    if (!elementRef.current) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loaderMoreImages();
      }
    });
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loaderMoreImages]);

  /** 받아온 키를 이용하여 사진 호출 */
  const imgList = myPosts.map((post, index) => (
    <div>
      <Link
        key={post.s3_photo_img_url[0]}
        to={`/community/post/${post._id}`}
        ref={index + 1 === myPosts.length ? elementRef : undefined} // 무한 스크롤의 기준
      >
        <img alt="" src={`/uploads/${post.s3_photo_img_url[0]}`} />
      </Link>
      <h4>{post.title}</h4>
    </div>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        나의 포스트 리스트
      </h3>
      <div>
        <div class="myimage-list-container">{imgList}</div>
      </div>
      {imageError && <div>Error...</div>}
      {imageLoading && <div>loading...</div>}
    </div>
  );
};

export default MyPost;
