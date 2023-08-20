import {
  AppBar,
  Button,
  Grid,
  List,
  ListItem,
  TextField,
} from "@material-ui/core";
import shared from "../../utils/shared";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Logo1 from "../../images.png";
import { RoutePaths } from "../../utils/enum";
import cartIcon from "../../cartIcon1.png"
import bookService from "../../Service/bookService";
import searchIcon from "../../search.png";
import { useAuthContext } from "../../Context/auth";
import { useCartContext } from "../../Context/cart";
import { toast } from "react-toastify";

export const Header = () => {
  const open = false;
  const authContext = useAuthContext();
  const Navigate=useNavigate();
  
  const cartContext = useCartContext();
  const [query, setquery] = useState("");
  const [bookList, setbookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);

  const items = useMemo(() => {
    return shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  });

  const openMenu = () => {
    document.body.classList.toggle("open-menu");
  };

  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    setbookList(res);
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  const addToCart = (book) => {
    if (!authContext.user.id) {
      Navigate(RoutePaths.Login);
      toast.error("Please login before adding books to cart");
    } else {
      shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in cart");
          cartContext.updateCart();
        }
      });
    }
  };

  return (
    <>
      <header>
        <AppBar color="secondary" position="relative">
          <div>
            <Link href={RoutePaths.BookListing}>
              <img
                src={Logo1}
                style={{
                  float: "left",
                  width: "70px",
                  height: "70px",
                  marginLeft: "5px",
                }}
              ></img>
            </Link>
            <List
              style={{
                display:"flex",
                fontSize: "19px",
              }}
            >
              {!authContext.user.id && (
                <>
                  <ListItem>
                    <NavLink to={RoutePaths.Login} title="Login">
                      <b>Login</b>
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink to={RoutePaths.Home} title="Login">
                      <b>Home</b>
                    </NavLink>
                  </ListItem>
                </>
              )}
              {items.map((item, index) => (
                <ListItem key={index}>
                  <NavLink to={item.route} title={item.name}>
                    <b>{item.name}</b>
                  </NavLink>
                </ListItem>
              ))}
                    <ListItem className="cart-link">
                        <Button style={{backgroundColor:"white"}} onClick={()=>{Navigate(RoutePaths.Cart)}}>
                        <img src={cartIcon}  />
                        <span>{cartContext.cartData.length}</span>
                        Cart
                        </Button>
                    </ListItem>
              {!!authContext.user.id && (
              <ListItem className="right">
                <Button onClick={authContext.logOut} variant="outlined" style={{backgroundColor:"white",color:"red"}}>
                  Log out
                </Button>
              </ListItem>
            )}
            </List>
            
          </div>
        </AppBar>
        <br />

        <div className="header-search-wrapper">
          <div className="container">
            <div className="header-search-outer">
              <div className="header-search-inner">
                <Grid>
                  <div className="text-wrapper" style={{ display: "inline" }}>
                    <TextField
                      id="text"
                      name="text"
                      placeholder="What are you looking for..."
                      variant="outlined"
                      value={query}
                      onChange={(e) => setquery(e.target.value)}
                      size="medium"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="green-btn btn"
                    variant="contained"
                    color="main"
                    disableElevation
                    onClick={search}
                    style={{ marginInline: "5px", marginBlock: "10px" }}
                  >
                    Search
                    <em>
                      <img src={searchIcon} alt="search" />
                    </em>
                  </Button>
                </Grid>
                {openSearchResult && (
                  <>
                    <div className="product-listing">
                      {bookList?.length === 0 && (
                        <p className="no-product">No product found</p>
                      )}

                      {/* <p className="loading">Loading....</p> */}
                      <List className="related-product-list">
                        {bookList?.length > 0 &&
                          bookList.map((item, i) => {
                            return (
                              <ListItem key={i}>
                                <div className="inner-block">
                                  <div className="left-col">
                                    <span className="title">{item.name}</span>
                                    <p>{item.description}</p>
                                  </div>
                                  <div className="right-col">
                                    <span className="price">{item.price}</span>
                                    <Link onClick={() => {}}>Add to cart</Link>
                                  </div>
                                </div>
                              </ListItem>
                            );
                          })}
                      </List>
                    </div>
                  </>
                )}
                <div
                  className="search-overlay"
                  onClick={() => {
                    setOpenSearchResult(false);
                    document.body.classList.remove("search-results-open");
                  }}
                  style={{ display: "flex" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </header>
    </>
  );
};
