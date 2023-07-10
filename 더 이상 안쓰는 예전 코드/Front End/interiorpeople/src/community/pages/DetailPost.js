import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "universal-cookie";

import "./DetailPost.css";


const cookies = new Cookies();

const DetailPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [user] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(null);
  const [hasBookmarked, setHasBookmarked] = useState(null);
  const [hasFollowed, setHasFollowed] = useState(null);
  const [error, setError] = useState(false);
  const [post, setPost] = useState();

  /** 댓글 관련 */
  const [commnetUrl, setCommentUrl] = useState();
  const [comments, setComments] = useState([]);
  const [writedComment, setWritedComment] = useState();
  const pastCommentUrlRef = useRef();
  const elementRef = useRef(null);
  // const [imageLoading, setImageLoading] = useState(false);
  // const [imageError, setImageError] = useState(false);

  useEffect(() => {
    try {
      /** 포스트 불러오기 */
      axios.get(`/api/community/post/${postId}`).then((result) => {
        setPost(result.data.post);
        setError(false);

        /** 좋아요, 북마크, 팔로우 여부 체크 */
        if (user || cookies.get("loginData")) {
          // 좋아요
          if (result.data.checkResult.likeCheckResult === "like") {
            setHasLiked(true);
          } else {
            setHasLiked(false);
          }

          // 북마크
          if (result.data.checkResult.bookmarkCheckResult === "bookmark") {
            setHasBookmarked(true);
          } else {
            setHasBookmarked(false);
          }

          // 팔로우
          if (result.data.checkResult.followCheckResult === "follow") {
            setHasFollowed(true);
          } else {
            setHasFollowed(false);
          }
        }
        // 댓글 최초 불러오기
        setCommentUrl(`/api/community/post/${postId}/comment-list`);
      });
    } catch (err) {
      alert("오류가 발생했습니다. 메인화면으로 돌아갑니다.");
      window.location.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ! 댓글 스크롤링 파트 시작
  useEffect(() => {
    if (pastCommentUrlRef.current === commnetUrl) {
      return;
    }
    // setImageLoading(true);
    axios
      .get(commnetUrl)
      .then((result) => {
        setComments((prevData) => [...prevData, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
        // setImageError(err);
      })
      .finally(() => {
        // setImageLoading(false);
        pastCommentUrlRef.current = commnetUrl;
      });
  }, [commnetUrl]);

  const loaderMoreImages = useCallback(() => {
    if (comments.length === 0) {
      return;
    }
    const lastCommentId = comments[comments.length - 1]._id;
    setCommentUrl(
      `/api/community/post/${postId}/comment-list?lastCommentId=${lastCommentId}`
    );
  }, [comments, postId]);

  // * Track the element in infinite scroll
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
  // ! 댓글 스크롤링 파트 끝

  if (error) {
    return <h3>Error...</h3>;
  } else if (!post) {
    return <h3>Loading...</h3>;
  }

  /** 좋아요 */
  const likeSubmit = async () => {
    try {
      await axios.post(`/api/community/post/${postId}/like`);
      if (hasLiked === false) {
        // 좋아요를 누르지 않은 경우
        post.like_num += 1;
      } else {
        // 좋아요를 누른 경우
        post.like_num -= 1;
      }
      setHasLiked(!hasLiked);
    } catch (err) {
      alert("좋아요 오류");
    }
  };

  /** 북마크 */
  const bookmarkSubmit = async () => {
    try {
      await axios.post(`/api/community/post/${postId}/bookmark`);
      setHasBookmarked(!hasBookmarked);
    } catch (err) {
      alert("북마크 오류");
    }
  };

  /** 팔로우 */
  const followSubmit = async () => {
    try {
      await axios.post(`/api/community/post/${postId}/follow`);
      setHasFollowed(!hasFollowed);
    } catch (err) {
      alert("팔로우 오류");
    }
  };

  /** 포스트 삭제 */
  const postDeleteSubmit = async () => {
    try {
      //팝업창이 뜨도록 함 취소를 누르면 false이고 확인은 true임
      if (!window.confirm("삭제하시겠습니까?")) {
        return;
      }
      await axios.delete(`/api/community/post/${postId}/delete`);
      navigate("/community"); // 메인화면으로 복귀
    } catch (err) {}
  };

  /** 댓글 생성 */
  const commentCreateSubmit = async () => {
    try {
      await axios.post(`/api/community/post/${postId}/write-comment`, {
        parentCommentId: "",
        content: writedComment,
      });
      setWritedComment();
    } catch (err) {
      alert("댓글 생성 오류");
    }
  };

  /** 댓글 삭제 */
  const commentDeleteSubmit = async (commentId) => {
    console.log(commentId);
    try {
      await axios.delete(`/api/community/post/${postId}/delete-comment`, {
        data: {
          parentCommentId: "",
          commentId: commentId,
        },
      });
      alert("댓글이 삭제되었습니다.");
      window.location.reload();
    } catch (err) {
      alert("댓글 삭제 오류");
    }
  };

  /** 모든 댓글을 보여줌 */
  const allCommnets = comments.map((comment, index) => (
    <ul>
      {/* <li>{comment._id}</li> */}
      <li style={{ display: "inline-block", marginLeft: "10%", fontWeight: "bolder" }}>{comment.user_id}</li>
      <li style={{ marginLeft: "10%" }}>{comment.content}</li>
      {user && comment.user_id === user ? (
        <li>
          <button
            onClick={() => {
              commentDeleteSubmit(comment._id);
            }}
          >
            댓글 삭제
          </button>
        </li>
      ) : (
        <></>
      )}
    </ul>
  ));

  /** 포스트의 모든 이미지를 보여줌 */
  const allImagesInPost = post.s3_photo_img_url.map((imageUrl, index) => (
    <img
      key={index}
      src={`/uploads/${imageUrl}`}
      style={{ width: "70%", height: 270, objectFit: "cover" }}
      alt=""
      className={`image-preview ${imageUrl && "image-preview-show"}`}
    />
  ));

  return (
    <div>
      <div class="writer-id" style={{ display: "inline-block", marginLeft: "15%", marginTop: "20px", marginBottom: "20px" }}>@{post.writer_id}</div>
      {user && post.writer_id === user && (
        <button class="delete"
          style={{ marginLeft: "40%" }}
          onClick={postDeleteSubmit}
        >
          삭제
        </button>
      )}
      {allImagesInPost}
      <div class="text">제목</div>
      <div class="community-title" style={{ marginLeft: "15%" }}>{post.title}</div>
      <div class="text">내용</div>
      <div class="community-content" style={{ marginLeft: "15%", marginBottom: "20px"}}>{post.content} </div>
      <span style={{ marginLeft: "15%" }}>좋아요 {post.like_num}</span>
      {!user || user === post.writer_id ? (
        <></>
      ) : (
        <div>
          <div>
            <button style={{ width: "8%", marginTop: "20px", marginLeft: "15%", background: "#203864", color: "white", borderRadius: "5px", border: 0, outline: 0 }} onClick={followSubmit}>
              {hasFollowed !== null && (hasFollowed ? "팔로잉 취소" : "팔로우")}
            </button>
            <button style={{ width: "8%", marginLeft: "2px", background: "#203864", color: "white", borderRadius: "5px", border: 0, outline: 0 }} onClick={likeSubmit}>
              {hasLiked !== null && (hasLiked ? "좋아요 취소" : "좋아요")}
            </button>
            <button style={{ width: "8%", marginLeft: "2px", background: "#203864", color: "white", borderRadius: "5px", border: 0, outline: 0 }} onClick={bookmarkSubmit}>
              {hasBookmarked !== null &&
                (hasBookmarked ? "북마크 취소" : "북마크")}
            </button>
          </div>
        </div>
      )}
      
      {user ? (
        <form onSubmit={commentCreateSubmit}>
          <div style={{ marginLeft: "15%", width: "85%" }}>
            <div style={{marginTop: "20px"}}>
              <input
                style={{ width: "65%" }}
                value={writedComment}
                onChange={(e) => {
                  setWritedComment(e.target.value);
                }}
              />
            <button class="comment-button" type="submit">등록</button>
            </div>
          </div>
        </form>
      ) : (
        <></>
      )}
      <div>
        <h3 style={{ display: "inline-block", marginLeft: "15%", marginTop: "20px" }}>댓글</h3>
        <div>
          <div>{allCommnets}</div>
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
