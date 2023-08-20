import { Formik } from "formik";
import * as Yup from "yup";
import authService from "./Service/auth.service";
import {
  Button,
  Container,
  Grid,
  Link,
  TableRow,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { useAuthContext } from "./Context/auth";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { RoutePaths } from "./utils/enum";

const style = makeStyles({
  Input: {
    width: "500px",
    margin: "10px",
  },
  spanIn: {
    display: "block",
    color: "red",
  },
});

const Login = () => {

  const navigate=useNavigate();

  const authContext=useAuthContext();
  const classes = style();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is Required")
      .email("Email is not in valid format"),
    password: Yup.string().required(),
  });

  return (
    <>
        <div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(data) => {
              authService.login(data).then((res) => {
                toast.success("login Successful...");
                console.log("result", res);
                authContext.setUser(res);
                navigate(RoutePaths.BookListing);
              });
            }}
          >
            {({ errors, touched, handleChange, handleSubmit }) => {
              return (
                <>
                <Grid>
                <div style={{ display: "block" }}>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      name="email"
                      variant="outlined"
                      label="Email"
                      onChange={handleChange}
                      className={classes.Input}
                    ></TextField>
                    <span className={classes.spanIn}>
                      {errors.email ? errors.email : ""}
                    </span>
                    <br />

                    <TextField
                    type="password"
                      name="password"
                      variant="outlined"
                      label="Password"
                      onChange={handleChange}
                      className={classes.Input}
                    ></TextField>
                    <span className={classes.spanIn}>
                      {errors.password ? errors.password : ""}
                    </span>
                    <br />

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ marginLeft:"auto",marginRight:"auto"}}
                    >
                      Login
                    </Button>
                  </form>
                </div>
                </Grid>
                <p>If you are new Register Yourself here... <NavLink to={RoutePaths.Home}>Register</NavLink></p>
                </>
              );
            }}
          </Formik>
        </div>
      
    </>
  );
};

export { Login };
