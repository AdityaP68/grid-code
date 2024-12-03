import React, { useState, useEffect } from "react";
import DetailForm from "./DetailForm";

const DelayedDetailRenderer = ({ data, api, node }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const expandDelay = 300; // Match the expansion animation duration
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, expandDelay);

    return () => clearTimeout(timer); // Cleanup timer
  }, [node.rowIndex]);

  return (
    <div>
      {isVisible ? (
        <DetailForm data={data} api={api} node={node} />
      ) : (
        <div style={{ textAlign: "center", padding: "20px", background: "#ffffef", width: "100%" }}>Loading...</div>
      )}
    </div>
  );
};

export default DelayedDetailRenderer;
