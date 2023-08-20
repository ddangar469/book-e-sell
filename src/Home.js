import { Button, Input, TextField } from "@material-ui/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [x, setX] = useState(0);
  return (
    <>
      <NavLink to="/user">
        <Button variant="contained" color="secondary">
          User
        </Button>
      </NavLink>
      <NavLink to="/registration">
        <Button variant="contained" color="secondary">
          Registration
        </Button>
      </NavLink>
      <br />
      <br />
      <Button
        variant="contained"
        color="default"
        onClick={() => {
          setX(x - 1);
        }}
      >
        -
      </Button>
      {x}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setX(x + 1);
        }}
      >
        +
      </Button>
    </>
  );
};

export { Home };
