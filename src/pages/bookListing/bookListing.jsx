import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

import { useAuthContext } from "../../Context/auth";
import { useEffect, useMemo, useState } from "react";
import { defaultFilter } from "../../constant/constant";
import bookService from "../../Service/bookService";
import categoryService from "../../Service/category.service";

import { materialCommonStyles } from "../../utils/materialCommonStyles";
import { Pagination } from "@material-ui/lab";
import { productListingStyle } from "./style";
import { toast } from "react-toastify";
import shared from "../../utils/shared";
import { useCartContext } from "../../Context/cart";

export const BookListing = () => {
  const classes = productListingStyle();
  const authContext = useAuthContext();
  const cartContext = useCartContext();

  const materialClasses = materialCommonStyles();
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [filters, setFilters] = useState(defaultFilter);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res);
    });
  };

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, bookResponse]);

    const addToCart = (book) => {
      shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          cartContext.updateCart();
        }
      });
    };

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...bookResponse.items];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBookResponse({ ...bookResponse, items: bookList });
  };

  return (
    <>
      {/* <div className={classes.productListWrapper}>
        <div className="container">
          <Typography variant="h3">Book Listing</Typography>
          <>
          <tr>
            <td width="50%">
            <Typography variant="h6" style={{padding:"50px"}}>
              Total<span>- {bookResponse.totalItems} items</span>
            </Typography>
            </td>
            <td width="25%">
            <TextField
              id="text"
              className="dropdown-wrapper"
              name="text"
              placeholder="Search..."
              variant="outlined"
              inputProps={{ className: "small" }}
              // onChange={(e) => {
              //   setFilters({
              //     ...filters,
              //     keyword: e.target.value,
              //     pageIndex: 1,
              //   });
              // }}
            />
            </td>
            <td width={"25%"}>
            <FormControl className="dropdown-wrapper" variant="outlined" style={{width:"80%"}}>
              <InputLabel>Sort By</InputLabel>
              <Select
                label="SortBy"
                style={{width:"100%"}}
                className={materialClasses.customSelect}
                MenuProps={{
                  classes: { paper: materialClasses.customSelect },
                }}
                onChange={sortBooks}
                value={sortBy}
              >
                <MenuItem value="a-z">a - z</MenuItem>
                <MenuItem value="z-a">z - a</MenuItem>
              </Select>
            </FormControl>
            </td>
            </tr>
          </>
        </div>
        <div>
          <div>
          {books.map((book, index) => (
              <div className="product-list" key={index}>
                <div className="product-list-inner">
                  <em>
                    <img
                      src={book.base64image}
                      className="image"
                      alt="dummyimage"
                    />
                  </em>
                  <div className="content-wrapper">
                    <Typography variant="h3">{book.name}</Typography>
                    <span className="category">{book.category}</span>
                    <p className="description">{book.description}</p>
                    <p className="price">
                      <span className="discount-price">
                        MRP &#8377; {book.price}
                      </span>
                    </p>
                    <button className="MuiButtonBase-root MuiButton-root MuiButton-contained btn pink-btn MuiButton-containedPrimary MuiButton-disableElevation">
                      <span className="MuiButton-label" onClick={() => {}}>
                        ADD TO CART
                      </span>
                      <span className="MuiTouchRipple-root"></span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination-wrapper">
          <Pagination
            count={bookResponse.totalPages}
            page={filters.pageIndex}
            onChange={(e, newPage) => {
              setFilters({ ...filters, pageIndex: newPage });
            }}
          />
        </div>
        </div>
      </div> */}
      <div className={classes.productListWrapper}>
        <div className="container">
          <Typography variant="h3"><u>Book Listing</u></Typography>
          <br />
          <Grid container className="title-wrapper">
            <Grid item xs={6}>
              <Typography variant="h6">
                Total
                <span> - {bookResponse.totalItems} items</span>
              </Typography>
            </Grid>
            <div className="dropdown-wrapper">
              <TextField
                id="text"
                className="dropdown-wrapper"
                name="text"
                placeholder="Search..."
                variant="outlined"
                inputProps={{ className: "small" }}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    keyword: e.target.value,
                    pageIndex: 1,
                  });
                }}
              />
            </div>
            <FormControl className="dropdown-wrapper" variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                style={{ width: "100%", height: "50px" }}
                label="sortBy"
                className={materialClasses.customSelect}
                MenuProps={{
                  classes: { paper: materialClasses.customSelect },
                }}
                onChange={sortBooks}
                value={sortBy}
              >
                <MenuItem value="a-z">a - z</MenuItem>
                <MenuItem value="z-a">z - a</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <div className="product-list-wrapper">
            <div className="product-list-inner-wrapper">
              {books.map((book, index) => (
                <div className="product-list" key={index}>
                  <div className="product-list-inner">
                    <em>
                      <img
                        src={book.base64image}
                        className="image"
                        alt="dummyimage"
                      />
                    </em>
                    <div className="content-wrapper">
                      <Typography variant="h3">{book.name}</Typography>
                      <span className="category">{book.category}</span>
                      <p className="description">{book.description}</p>
                      <p className="price">
                        <span className="discount-price">
                          MRP &#8377; {book.price}
                        </span>
                      </p>
                      <button className="MuiButtonBase-root MuiButton-root MuiButton-contained btn pink-btn MuiButton-containedPrimary MuiButton-disableElevation">
                        <span className="MuiButton-label"
                        onClick={() => addToCart(book)}>
                          ADD TO CART
                        </span>
                        <span className="MuiTouchRipple-root"></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <br />
          <div className="pagination-wrapper">
            <Pagination
              style={{ float: "right" }}
              count={bookResponse.totalPages}
              page={filters.pageIndex}
              color="secondary"
              onChange={(e, newPage) => {
                setFilters({ ...filters, pageIndex: newPage });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
