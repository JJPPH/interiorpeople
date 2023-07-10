import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import axios from "axios";

function Support() {
  const [faq, setFaq] = useState();
  const [guide, setGuide] = useState();

  useEffect(() => {
    axios
      .get("/api/support")
      .then((supportResult) => {
        setFaq({ title: "FAQ", rows: supportResult.data.faq });
        setGuide({ title: "GUIDE", rows: supportResult.data.guide });
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  const styles = {
    // bgColor: 'white',
    titleTextColor: "#203864",
    rowTitleColor: "black",
    // rowContentColor: 'grey',
    // arrowColor: "red",
  };

  const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
  };

  const FAQ = (
    <div>
      <Faq data={faq} styles={styles} config={config} />
    </div>
  );

  const GUIDE = (
    <div>
      <Faq data={guide} styles={styles} config={config} />
    </div>
  );

  return (
    <div>
      {FAQ}
      {GUIDE}
    </div>
  );
}

export default Support;
