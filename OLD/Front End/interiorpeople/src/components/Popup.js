import React, { Component, useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Faq from "react-faq-component";
import axios from "axios";

import "./StyleEdit.css";

class Popup extends Component {
  createPopup = () => {
    const { popup, onChange, onCreate, onUpdate } = this.props
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='popup-ui'>
            <button class="close close1" onClick={() => {
                    onClose()
                  }}
                ></button>
              <div class="popup-text">
                <h3>가구 카테고리</h3>
                <input
                  type="checkbox"
                  onChange={onChange}
                />
                <h3>스타일</h3>
                <div class="style-text">고풍스러운</div>
                <img
                    alt=""
                    src={require("../img/classic/white.jpg").default}
                    style={{ width: "14%", borderRadius:"5px"}}
                  />
                  <img
                    alt=""
                    src={require("../img/classic/red.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/classic/brown.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/classic/blue.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/classic/gray.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/classic/black.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                <div class="style-text">컬러풀한</div>
                <img
                    alt=""
                    src={require("../img/natural/white.jpg").default}
                    style={{ width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/natural/red.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/natural/brown.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/natural/blue.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/natural/gray.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/natural/black.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                <div class="style-text">북유럽풍</div>
                <img
                    alt=""
                    src={require("../img/northern_europe/white.jpg").default}
                    style={{ width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/northern_europe/red.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/northern_europe/brown.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/northern_europe/blue.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/northern_europe/gray.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/northern_europe/black.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                <div class="style-text">깔끔한</div>
                <img
                    alt=""
                    src={require("../img/modern/white.jpg").default}
                    style={{ width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/modern/red.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/modern/brown.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/modern/blue.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/modern/gray.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/modern/black.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                <div class="style-text">빈티지한</div>
                <img
                    alt=""
                    src={require("../img/vintage/white.jpg").default}
                    style={{ width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/vintage/red.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/vintage/brown.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/vintage/blue.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/vintage/gray.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
                  <img
                    alt=""
                    src={require("../img/vintage/black.jpg").default}
                    style={{ marginLeft: "2%", width: "14%", borderRadius:"5px" }}
                  />
              </div>
              <button style={{ background: "#203864", color: "white", height: "25px", marginLeft:"80%", marginTop:"20px", width:"15%", borderRadius: "5px", border: 0, outline: 0}} onClick={() => {
                if (popup.state === 'update') onUpdate()
                else onCreate()
                onClose()
              }}>save</button>
            </div>
          )
        }
      })
  }
  render() {
    return (
      <div className="popup">
          {this.createPopup()}
      </div>
    );
  }
}

export default Popup;