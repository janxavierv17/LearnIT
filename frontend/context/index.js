import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
// Initial state
const initialState = {
  user: null,
};

// Create context
const Context = createContext();

// Root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

// Provider where we use to wrap our _app.js
// dispatch is a function that updates state in reducer.
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const router = useRouter();
  // We'll use dispatch to get user data from our local storage.
  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  // Interceptors is used for handling expired tokens
  axios.interceptors.response.use(
    function (response) {
      // Status code with the range of 2XX cause this function to trigger.
      return response;
    },
    function (error) {
      // Status code outside of 2XX cause this function trigger.
      let response = error.response;
      if (
        response.status === 401 &&
        response.config &&
        !response.config.__isRetryRequest
      ) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error > logout");

              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/");
            })
            .catch((error) => {
              console.log(
                "Something went wrong with Axios Interceptor: ",
                error
              );
            });
        });
      }
      return Promise.reject(error);
    }
  );

  // Includes CSRF token to our AXIOS request.
  // The route cnn is located at server.js
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      // console.log("CSRF", data);
      axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
    };
    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
