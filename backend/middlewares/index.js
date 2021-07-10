// Middleware for protected routes.
import expressJwt from "express-jwt"

export const requireSignIn = expressJwt({
    getToken: (request, response) => request.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})