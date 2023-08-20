import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { materialCommonStyles } from "../../../utils/materialCommonStyles";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import Shared from "../../../utils/shared";
import userService from "../../../Service/user.service";
import { useAuthContext } from "../../../Context/auth";
import ValidationErrorMessage from "../../../components/ValidationErrorMessage";

const EditUser = () => {
  const authContext = useAuthContext();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState();
  
  const materialClasses = materialCommonStyles();
  const navigate = useNavigate();
  const initialValues = {
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    roleId: 3,
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (id) {
      getUserById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user && roles.length) {
      const roleId = roles.find((role) => role.name === user?.role)?.id;
      setInitialValueState({
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roleId,
        password: user.password,
      });
    }
  }, [user, roles]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    roleId: Yup.number().required("Role is required"),
  });

  const getRoles = () => {
    userService.getAllRoles().then((res) => {
      if (res) {
        setRoles(res);
      }
    });
  };

  const getUserById = () => {
    userService.getById(Number(id)).then((res) => {
      if (res) {
        setUser(res);
      }
    });
  };

  const onSubmit = (values) => {
    const updatedValue = {
      ...values,
      role: roles.find((r) => r.id === values.roleId).name,
    };
    userService
      .update(updatedValue)
      .then((res) => {
        if (res) {
          toast.success(Shared.messages.UPDATED_SUCCESS);
          navigate("/user");
        }
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };
  return (
    <div>
      <div className="container">
        <Typography variant="h4"><u>Edit User</u></Typography>
        <br/>
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validator={() => ({})}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-row-wrapper">
                <div className="form-col">
                  <TextField
                    id="first-name"
                    name="firstName"
                    label="First Name *"
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    style={{width:"500px"}}
                  />
                  <ValidationErrorMessage
                    message={errors.firstName}
                    touched={touched.firstName}
                  />
                </div>
                <br/>
                <div className="form-col">
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="last-name"
                    name="lastName"
                    label="Last Name *"
                    value={values.lastName}
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    style={{width:"500px"}}
                  />
                  <ValidationErrorMessage
                    message={errors.lastName}
                    touched={touched.lastName}
                  />
                  
                </div>
                <br/>
                <div className="form-col">
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="email"
                    name="email"
                    label="Email *"
                    value={values.email}
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    style={{width:"500px"}}
                  />
                  <ValidationErrorMessage
                    message={errors.email}
                    touched={touched.email}
                  />
                </div>
                <br/>
                {values.id !== authContext.user.id && (
                  <div className="form-col">
                    <FormControl
                      className="dropdown-wrapper"
                      variant="outlined"
                      disabled={values.id === authContext.user.id}
                      style={{width:"500px"}}
                    >
                      <InputLabel htmlFor="select">Roles</InputLabel>
                      <Select
                        name="roleId"
                        id={"roleId"}
                        label="Roles"
                        onChange={handleChange}
                        disabled={values.id === authContext.user.id}
                        className={materialClasses.customSelect}
                        value={values.roleId}
                      >
                        {roles.length > 0 &&
                          roles.map((role) => (
                            <MenuItem value={role.id} key={"name" + role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
              <br/>
              <div className="btn-wrapper">
                <Button
                  className="green-btn btn"
                  variant="contained"
                  type="submit"
                  color="primary"
                  disableElevation
                  style={{marginRight:"5px",color:"white",backgroundColor:"green"}}
                >
                  Save
                </Button>
                <Button
                  className="pink-btn btn"
                  variant="contained"
                  type="button"
                  color="primary"
                  disableElevation
                  onClick={() => {
                    navigate("/user");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUser;
