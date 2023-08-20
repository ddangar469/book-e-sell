import {
  Button,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import { Formik } from "formik";
import { Alert } from "@material-ui/lab";
import { NavLink, Navigate, json, useNavigate } from "react-router-dom";
import authService from "./Service/auth.service";
import { toast } from "react-toastify";
import { RoutePaths } from "./utils/enum";

const style = makeStyles({
  input: {
    width: "500px",
  },
});

const Registration = () => {
  const navigate = useNavigate();
  const classes = style();
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("FirstName is Required"),
    lastName: Yup.string().required("LastName is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Email is not in valid format"),
    roleId: Yup.string().required("Role is required"),
    password: Yup.string()
      .required()
      .min(8, "password should be minimum 8 characters")
      .max(12, "password should be maximum 12 characters"),
    ConfirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password and ConfirmPassword should match"
    ),
  });
  return (
    <>
      <div>
        <Typography variant="h4"><u>Register</u></Typography>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            roleId: "",
            password: "",
            ConfirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(data) => {
            delete data.ConfirmPassword;
            authService.create(data).then((res) => {
              toast.success("Successfully Registered");
              navigate("/login");
            });
          }}
        >
          {({ errors, touched, handleChange, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <TableContainer>
                <Table>
                  <TableRow>
                    <TableCell align="justify">
                      <TextField
                        name="firstName"
                        className={classes.input}
                        id="outlined-basic"
                        label="FirstName"
                        variant="outlined"
                        onChange={handleChange}
                      />

                      <span style={{ display: "block", color: "red" }}>
                        {errors.firstName ? errors.firstName : " "}
                        {touched.firstName ? touched.firstName : " "}
                      </span>
                    </TableCell>
                    <TableCell align="justify">
                      <TextField
                        name="lastName"
                        className={classes.input}
                        id="outlined-basic"
                        label="LastName"
                        variant="outlined"
                        onChange={handleChange}
                      />

                      <span style={{ display: "block", color: "red" }}>
                        {errors.lastName ? errors.lastName : " "}

                        {touched.lastName ? touched.lastName : " "}
                      </span>
                    </TableCell>
                  </TableRow>
                  <br />
                  <TableRow>
                    <TableCell>
                      <TextField
                        name="email"
                        className={classes.input}
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        onChange={handleChange}
                      />
                      <span style={{ display: "block", color: "red" }}>
                        {errors.email ? errors.email : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <FormControl variant="outlined">
                        <InputLabel>Roles</InputLabel>
                        <Select
                          label="Roles"
                          name="roleId"
                          className={classes.input}
                          onChange={handleChange}
                        >
                          <MenuItem value="2">Buyer</MenuItem>
                          <MenuItem value="3">Seller</MenuItem>
                        </Select>
                      </FormControl>
                      <span style={{ display: "block", color: "red" }}>
                        {errors.roleId ? errors.roleId : ""}
                      </span>
                    </TableCell>
                  </TableRow>

                  <br />
                  <TableRow>
                    <TableCell>
                      <TextField
                        name="password"
                        className={classes.input}
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        onChange={handleChange}
                      />
                      <span style={{ display: "block", color: "red" }}>
                        {errors.password ? errors.password : ""}
                        {touched.password ? touched.password : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="ConfirmPassword"
                        className={classes.input}
                        id="outlined-basic"
                        label="Confirm Password"
                        variant="outlined"
                        onChange={handleChange}
                      />
                      <span style={{ display: "block", color: "red" }}>
                        {errors.ConfirmPassword ? errors.ConfirmPassword : ""}
                      </span>
                    </TableCell>
                  </TableRow>
                  <br />
                  <TableRow>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ left: "50%" }}
                    >
                      Submit
                    </Button>
                  </TableRow>
                </Table>
                </TableContainer>
                <p>If you Already have an account, Please <NavLink to={RoutePaths.Login}>Login</NavLink></p>
              </form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export { Registration };
