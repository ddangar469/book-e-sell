import React from "react";

const ValidationErrorMessage = (props) => {
  return (
    <>{props.touched && <p style={{color:"red"}}>{props.message}</p>}</>
  );
};

export default ValidationErrorMessage;
