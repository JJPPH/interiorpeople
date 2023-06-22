/** 커뮤니티 페이지 */
import React from "react";
import { Outlet } from "react-router-dom";

const CommunityPage = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CommunityPage;
