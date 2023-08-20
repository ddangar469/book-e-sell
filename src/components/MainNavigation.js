import { Navigate, Route, Routes } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { Registration } from "../Registration";

import { Login } from "../Login";
import { useAuthContext } from "../Context/auth";
import { BookListing } from "../pages/bookListing/bookListing";
import Book from "../pages/book/book";
import EditBook from "../pages/book/editBook/editBook";
import Category from "../pages/category/category";
import EditCategory from "../pages/category/editCategory/editCategory";
import UpdateProfile from "../pages/updateProfile/updateProfile";
import User from "../pages/user/user";
import EditUser from "../pages/user/editUser/editUser";
import Cart from "../pages/cart/cart";

const Redirect = <Navigate to={RoutePaths.Login} />;

export const MainNavigation = () => {
  const authContext = useAuthContext();
  return (
    <>
      <Routes>
        <Route exact path={RoutePaths.Home} element={<Registration />}></Route>
        <Route exact path={RoutePaths.User} element={<User />}></Route>
        <Route exact path={RoutePaths.Login} element={<Login />}></Route>
        <Route
          exact
          path={RoutePaths.BookListing}
          element={authContext.user.id ? <BookListing /> : Redirect}
        ></Route>
        <Route
          exact
          path={RoutePaths.Book}
          element={authContext.user.id ? <Book /> : Redirect}
        ></Route>
        <Route
          exact
          path={RoutePaths.EditBook}
          element={authContext.user.id ? <EditBook /> : Redirect}
        ></Route>
        <Route
          exact
          path={RoutePaths.AddBook}
          element={authContext.user.id ? <EditBook /> : Redirect}
        ></Route>
        <Route
          exact
          path={RoutePaths.Category}
          element={authContext.user.id ? <Category /> : Redirect}
        />
        <Route
          exact
          path={RoutePaths.EditCategory}
          element={authContext.user.id ? <EditCategory /> : Redirect}
        />
        <Route
          exact
          path={RoutePaths.AddCategory}
          element={authContext.user.id ? <EditCategory /> : Redirect}
        />
        <Route
          exact
          path={RoutePaths.UpdateProfile}
          element={authContext.user.id ? <UpdateProfile /> : Redirect}
        />

        <Route
          exact
          path={RoutePaths.EditUser}
          element={authContext.user.id ? <EditUser /> : Redirect}
        />

        <Route
          exact
          path={RoutePaths.Cart}
          element={authContext.user.id ? <Cart /> : Redirect}
        />
      </Routes>
    </>
  );
};
