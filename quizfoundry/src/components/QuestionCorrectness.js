import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function QuestionCorrectness({ text }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <Typography style={{ height: "20px", overflow: "hidden" }}>
      {isVisible ? text : " "}
    </Typography>
  );
}
