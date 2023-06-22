import React from 'react';

const Form = ({ onOpen }) => {
  return (
    <div className="form">
      <div className="create-button" onClick={onOpen}>
        <div>
          <button style={{ background: "white", border: "none", marginLeft: "5%", marginTop: "20px"}}><img src={require("../img/add.jpg").default} /></button>
        </div>
      </div>
    </div>
  );
};

export default Form;