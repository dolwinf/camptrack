import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Context from "../src/context";

//...allOtherProps are props passed down from the parent component. This will make the Route work properly as if it were a child of Router
//...props are pros passed to App component

//I'm using render props here which injects the render logic for the App or Login component

const ProtectRoute = ({ component: Component, ...allOtherProps }) => {
  const { state } = useContext(Context);
  return (
    <Route
      render={props =>
        !state.isAuth ? <Redirect to="/login" /> : <Component {...props} />
      }
      {...allOtherProps}
    />
  );
};

export default ProtectRoute;
