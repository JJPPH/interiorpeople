import React, { useRef, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/** 컴포넌트 임포트 */
// import PostList from "../components/PostList";
// import UploadForm from "../components/UploadForm";

const Bookmark = () => {
  const [myBookmarks, setMyBookmarks] = useState([]);
  const [bookmarkUrl, setBookmarkUrl] = useState("/api/mypage/bookmark");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const pastBookmarkUrlRef = useRef();
  const elementRef = useRef(null); // 무한 스크롤 적용에 필요

  useEffect(() => {
    if (pastBookmarkUrlRef.current === bookmarkUrl) {
      return;
    }
    setImageLoading(true);
    axios
      .get(bookmarkUrl)
      .then((result) => {
        console.log(result);
        setMyBookmarks((prevData) => [...prevData, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
        setImageError(err);
      })
      .finally(() => {
        setImageLoading(false);
        pastBookmarkUrlRef.current = bookmarkUrl;
      });
  }, [bookmarkUrl]);

  // ? 리렌더링 될 때마다 함수가 새로 만들어짐 -> useCallback 사용
  const loaderMoreImages = useCallback(() => {
    if (imageLoading || myBookmarks.length === 0) {
      return;
    }
    const lastPostId = myBookmarks[myBookmarks.length - 1]._id;
    setBookmarkUrl(`/api/mypage/bookmark?lastPostId=${lastPostId}`);
  }, [myBookmarks, imageLoading, setBookmarkUrl]);

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
  const imgList = myBookmarks.map((post, index) => (
    <div>
      <Link
        key={post.s3_photo_img_url[0]}
        to={`/community/post/${post._id}`}
        ref={index + 1 === myBookmarks.length ? elementRef : undefined} // 무한 스크롤의 기준
      >
        <img alt="" src={`/uploads/${post.s3_photo_img_url[0]}`} />
      </Link>
      <h4>{post.title}</h4>
    </div>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        나의 북마크 리스트
      </h3>
      <div>
        <div class="myimage-list-container">{imgList}</div>
      </div>
      {imageError && <div>Error...</div>}
      {imageLoading && <div>loading...</div>}
    </div>
  );
};

export default Bookmark;
