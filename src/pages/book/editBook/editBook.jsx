import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import {
  Typography,
  TextField,
  Button,
  Input,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  InputBase,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { materialCommonStyles } from "../../../utils/materialCommonStyles";

import Shared from "../../../utils/shared";
import categoryService from "../../../Service/category.service";
import ValidationErrorMessage from "../../../components/ValidationErrorMessage";
import bookService from "../../../Service/bookService";
import { Formik } from "formik";

const EditBook = () => {
  const materialClasses = materialCommonStyles();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    price: "",
    categoryId: 0,
    description: "",
    base64image: "",
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getBookById();
    categoryService.getAll().then((res) => {
      setCategories(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Book Name is required"),
    description: Yup.string().required("Description is required"),
    categoryId: Yup.number()
      .min(1, "Category is required")
      .required("Category is required"),
    price: Yup.number().required("Price is required"),
    base64image: Yup.string().required("Image is required"),
  });

  const getBookById = () => {
    bookService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
        price: res.price,
        categoryId: res.categoryId,
        description: res.description,
        base64image: res.base64image,
      });
    });
  };

  const onSubmit = (values) => {
    bookService
      .save(values)
      .then((res) => {
        toast.success(
          values.id
            ? Shared.messages.UPDATED_SUCCESS
            : "Record created successfully"
        );
        navigate("/book");
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

  const onSelectFile = (e, setFieldValue, setFieldError) => {
    const files = e.target.files;
    if (files?.length) {
      const fileSelected = e.target.files[0];
      const fileNameArray = fileSelected.name.split(".");
      const extension = fileNameArray.pop();
      if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
        if (fileSelected.size > 50000) {
          toast.error("File size must be less then 50KB");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = function () {
          setFieldValue("base64image", reader.result);
        };
        reader.onerror = function (error) {
          throw error;
        };
      } else {
        toast.error("only jpg,jpeg and png files are allowed");
      }
    } else {
      setFieldValue("base64image", "");
    }
  };
  return (
    <div>
      <div className="container">
        <Typography variant="h4">
          <u>{id ? "Edit" : "Add"} Book</u>
        </Typography>
        <br />
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setValues,
            setFieldError,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-row-wrapper">
                <table style={{marginLeft:"100px"}}>
                  <tr>
                    <td style={{ float: "left", width: "500px" }}>
                      <TextField
                        id="first-name"
                        name="name"
                        label="Book Name *"
                        variant="outlined"
                        inputProps={{ className: "small" }}
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                      <ValidationErrorMessage
                        message={errors.name}
                        touched={touched.name}
                      />
                    </td>
                    <td style={{ float: "right", width: "500px"}}>
                      <TextField
                        type={"number"}
                        id="price"
                        name="price"
                        label="Book Price (RS)*"
                        variant="outlined"
                        value={values.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        style={{ width: "100%", alignContent: "center" }}
                      />
                      <ValidationErrorMessage
                        message={errors.price}
                        touched={touched.price}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td style={{ float: "right", width: "500px" }}>
                      <div className="form-col">
                        <FormControl
                          className="dropdown-wrapper"
                          variant="outlined"
                          fullWidth
                        >
                          <InputLabel htmlFor="select">Category * </InputLabel>
                          <Select
                            name={"categoryId"}
                            id={"category"}
                            label="category "
                            onChange={handleChange}
                            MenuProps={{}}
                            value={values.categoryId}
                          >
                            {categories?.map((rl) => (
                              <MenuItem value={rl.id} key={"category" + rl.id}>
                                {rl.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <ValidationErrorMessage
                          message={errors.categoryId}
                          touched={touched.categoryId}
                        />
                      </div>
                    </td>
                    <td style={{ float: "right", width: "500px",border:"2px"}}>
                      {/* <img src={values.imageSrc} alt="asa" /> */}
                      <div>
                        {!values.base64image && (
                          <>
                            {" "}
                            <label
                              htmlFor="contained-button-file"
                              className="file-upload-btn"
                            >
                              <Input
                                id="contained-button-file"
                                type="file"
                                inputProps={{ className: "small" }}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  onSelectFile(e, setFieldValue, setFieldError);
                                }}
                              />
                              <Button
                                variant="contained"
                                component="span"
                                className="btn pink-btn"
                              >
                                Upload
                              </Button>
                            </label>
                            <ValidationErrorMessage
                              message={errors.base64image}
                              touched={touched.base64image}
                            />
                          </>
                        )}
                        {values.base64image && (
                          <div className="uploaded-file-name">
                            <em style={{marginRight:"10px"}}>
                              <img
                                src={values.base64image}
                                alt=""
                                height="50px"
                                width="50px"
                              />
                            </em>
                            <Button
                              color="primary"
                              variant="outlined"
                              size="small"
                              style={{marginTop:"-35px"}}
                              onClick={() => {
                                setFieldValue("base64image", "");
                              }}
                            >
                              remove 
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <br/>
                  <tr>
                    <td style={{ float:"left", width: "500px" }}>
                      <div className="form-col full-width description">
                        <TextField
                          id="description"
                          name="description"
                          label="Description *"
                          variant="outlined"
                          value={values.description}
                          multiline
                          onBlur={handleBlur}
                          onChange={handleChange}
                          style={{ width: "100%" }}
                        />
                        <ValidationErrorMessage
                          message={errors.description}
                          touched={touched.description}
                        />
                      </div>
                    </td>
                    <td></td>
                  </tr>
                  <br/>

                  <tr style={{ alignItems: "center" }}>
                    <div className="btn-wrapper">
                      <td>
                        <Button
                          className="green-btn btn"
                          variant="contained"
                          type="submit"
                          color="primary"
                          disableElevation
                          style={{color:"white",backgroundColor:"green" ,left:"400px"}}
                        >
                          Save
                        </Button>
                      </td>
                      <td>
                        <Button
                          className="pink-btn btn"
                          variant="contained"
                          type="button"
                          color="primary"
                          disableElevation
                          style={{right:"-400px"}}
                          onClick={() => {
                            navigate("/book");
                          }}
                        >
                          Cancel
                        </Button>
                      </td>
                    </div>
                  </tr>
                </table>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditBook;
