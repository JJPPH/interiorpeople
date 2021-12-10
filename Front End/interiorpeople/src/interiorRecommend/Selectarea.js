import React, { useState, useEffect } from 'react';
import axios,{ post } from 'axios';
import { withRouter, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function Selectarea() {
  
  // 담을 state
  const [selectedFile, setSelectedFile] = useState(null);
 
  // onChange역할
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
 
  // formData라는 instance에 담아 보냄
  const handleFileUpload = () => {
    const formData = new FormData();
 
    formData.append("userfile", selectedFile, selectedFile.name);
 
    axios.post("api/uploadfile", formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <div class="explanation-group" style={{marginTop: "20px"}}>
        <div class="small-black-text">원하는 영역을 선택해주세요</div>
      </div>
      <input type="file" onChange={handleFileChange} style={{ marginLeft:"5%", marginTop:"20px" }} />

      <button onClick={handleFileUpload} style={{ background: "#203864", color: "white", marginLeft:"5%", marginTop:"20px", width:"90%", height: "45px", borderRadius: "10px"}}>영역 설정</button>
      <button style={{ background: "#203864", color: "white", marginLeft:"5%", marginTop:"20px", width:"90%", height: "45px", borderRadius: "10px"}}><Link to="/interior/selectstyle">다음으로</Link></button>
    </div>
  );
};
 
export default Selectarea;

//axios.delete('url', { data: payload }).then(
    // Observe the data keyword this time. Very important
    // payload is the request body
    // Do something
  //)