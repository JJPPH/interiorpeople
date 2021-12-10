// cSpell:ignore : mypage,myphoto,mypost,postlist

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Nav";
// 홈
import Home from "./Home";
// 로그인, 회원가입, 비밀번호찾기
import Login from "./Login";
import Signup from "./Signup";
import Forgot from "./Forgot";
// 고객센터
import Support from "./Support";
// 마이페이지 메인, 프로필 편집, 나의 사진, 스크랩, 추천 기록
import MyPage from "./myPage/pages/MyPage";
import MyPageMain from "./myPage/pages/MyPageMain";
import Profile from "./myPage/pages/Profile";
import Bookmark from "./myPage/pages/Bookmark";
import History from "./myPage/pages/History";

// 인테리어 추천 - 사진 업로드, 영역 선택, 스타일 선택, 스타일 편집, 원하는 사진 추가 업로드, 분석 완료
import InteriorRecommendPage from "./interiorRecommend/InteriorRecommend";
import Upload from "./interiorRecommend/Upload";
import Selectstyle from "./interiorRecommend/Selectstyle";
import Themeupload from "./interiorRecommend/Themeupload";
import Result from "./interiorRecommend/Result";

// 커뮤니티 메인, 나의 글 상세, 포스트 상세화면, 글 작성
import CommunityPage from "./community/pages/CommunityPage";
import CommunityMain from "./community/pages/Main";
import CommunityDetailPost from "./community/pages/DetailPost";
import CommunityMyPost from "./community/pages/MyPost";
import CommunityPostList from "./community/pages/PostList";
import CommunityWritePost from "./community/pages/WritePost";

// import Like from "./Like";

//import MenuList from './MenuList';

// TODO : 라우터별 접근 권한 부여 (예 : 로그인이 된 유저는 로그인 페이지로 넘어가서는 안됨)
function App() {
  return (
    <div className="app">
      <Router>
        <Nav />
        <Routes>
          {/* <Route path="/like" element={<Like />} /> */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />

          <Route path="/support" element={<Support />} />

          {/* 마이페이지 관련 */}
          <Route path="/mypage/*" element={<MyPage />}>
            <Route path="" element={<MyPageMain />} />
            <Route path="profile" element={<Profile />} />
            <Route path="bookmark" element={<Bookmark />} />
            <Route path="history" element={<History />} />
          </Route>

          {/* 인테리어 추천 페이지 관련 */}
          <Route path="/interior/*" element={<InteriorRecommendPage />}>
            <Route path="upload" element={<Upload />} />
            <Route path="selectstyle" element={<Selectstyle />} />
            <Route path="themeupload" element={<Themeupload />} />
            <Route path="result" element={<Result />} />
          </Route>
          {/* 커뮤니티 관련 */}
          <Route path="/community/*" element={<CommunityPage />}>
            <Route path="" element={<CommunityMain />} />
            <Route path="mypost" element={<CommunityMyPost />} />
            <Route path="post/:postId" element={<CommunityDetailPost />} />
            <Route path="postlist" element={<CommunityPostList />} />
            <Route path="mypost/write" element={<CommunityWritePost />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
