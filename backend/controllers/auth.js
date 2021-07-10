import User from "../models/user"
import { hashPassword, comparePassword } from "../utils/auth"
import jwt from "jsonwebtoken"
import AWS from "aws-sdk"
import {nanoid} from "nanoid"

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secrectAccessKey: process.env_AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    apiVersion:process.env.AWS_API_VERSION,
}

const SES = new AWS.SES(awsConfig)

export const register = async (request, response) => {
    try {
        const { name, email, password } = request.body;
        if (!name) return response.status(400).send("A name is required.")
        if (!password || password.length < 6) {
            return response.status(400).send("A password is required and a minimum of 6 characters long.")
        }
        
        let userExists = await User.findOne({ email: email })
        if (userExists) {
            return response.status(400).send(`${email} is already taken.`)
        }

        // Hash the user's password
        const hashedPassword = await hashPassword(password);

        // Register this user
        const user = await new User({ name:name, email:email, password:hashedPassword });
        await user.save();

        // Saved user
        console.log("The saved user - ", user)
        return response.json({ok:true})
    } catch(error) {
        console.log(err)
        return response.status(400).send("Error. Try again later.")
    }
    // console.log(request.body)
    // response.json("Register User from controller.")
}

export const login = async (request, response) => {
    try {
        // Check agianst our DB's email and password with the client's email and password
        const { email, password } = request.body
        const user = await User.findOne({ email }).exec();
        if (!user) {return response.status(400).send("No user found.")} 
        
        // Checks if password match
        const match = await comparePassword(password, user.password)
        if (!match) {
           return response.status(400).send("Email address & Password does not exist.")
        }

        // create a signed JWT, user id from our database.
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        
        // Send the token and cookie to our frontend. Exclude hashed password.
        user.password = undefined
        response.cookie("token", token, {
            httpOnly: true, //httpOnly makes it unaccessible from frontend using javascript
            // secure: true // this parameter is for https for production
        });

        // Send user as a json response.
        response.json(user);
    } catch (error) {
        console.log("Something went wrong with logging in", error)
        return response.status(400).send("Error, try again later.")
    }
}

export const logout = async (request, response) => {
    try {
        response.clearCookie("token")
        return response.json({message:"You've have successfully logged out."})
    }
    catch (error) {
        console.log("Something went wrong with logout route: ",error)
    }
}

export const currentUser = async (request, response) => {
    try {
        // Get user by ID and exclude password
        const user = await User.findById(request.user._id).select("-password").exec();
        console.log("CurrentUser middleware:", user)
        return response.json({ok:true})
    } catch (error) {
        console.log("Something went wrong with currentUser function:", error)
    }
}

export const sendTestEmail = async (request, response) => {
    // console.log("Sending an email using AWS SES");
    // response.json({ok:true})
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: { ToAddresses: ["janxavierv@hotmail.com", "janxavierv13@hotmail.com"] },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                        <h1>Reset Password</h1>
                        <p>Please use the following link to reset your password.</p>
                    </html>
                    `
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password reset link"
            }
        }
    }

    const emailSent = SES.sendEmail(params).promise()
    emailSent.then(data => {
        console.log("The email that was sent:", data)
        response.json({ok:true})
    }).catch(error => {
        console.log("Error: ", error)
    }) 
}

export const forgotPassword = async (request, response) => {
    // console.log("Email Address from forgotPassword Route - ", email)

    try {
        const { email } = request.body
        const resetCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate({ email }, { passwordResetCode: resetCode });
        
        if (!user) {
            return response.status(400).send("This user does not exists.")
        }

        // Send the secret code to the user's email.
        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: { ToAddresses: [email] },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                        <html>
                            <h1>Reset Password</h1>
                            <p>Please use the following code to reset your password.</p>
                            <h3>${resetCode}</h3>
                        </html>
                        `
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Edemy - Password Reset Code"
                }
            }
        }

        const emailSent = SES.sendEmail(params).promise()
        emailSent.then(data => {
            console.log("The email that was sent:", data)
            response.json({ok:true})
        }).catch(error => {
            console.log("Something went wrong with sending the error code: ", error)
        }) 

    } catch (error) {
        console.log("Something went wrong with forgotPassword", error)
    }
}

export const resetPassword = async (request, response) => {
    // console.log("From frontend - ", email, code, newPassword)
    try {
        const { email, code, newPassword } = request.body
        const hashedPassword = await hashPassword(newPassword);
        const registeredUser = await User.findOne({ email }).exec();
        if (registeredUser.passwordResetCode.toString() === code) {
            const user = await User.findOneAndUpdate({passwordResetCode: code }, { password: hashedPassword, passwordResetCode: "" }).exec();
        } else {
            return response.status(400).send("Code does not match.")
        }

        // console.log("Registered user: ",registeredUser.passwordResetCode)
        // return;

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: { ToAddresses: [email] },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                        <html>
                            <h1>Reset Password Successful</h1>
                            <p>You have successfully reset your password. Please use your new password to log in.</p>
                        </html>
                        `
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password Successful"
                }
            }
        }

        const emailSent = SES.sendEmail(params).promise()
        emailSent.then(data => {
            console.log("The email that was sent: ", data)
            response.json({ ok: true })
        }).catch(error => {
            console.log("Something went wrong with resetPassword: ", error)
        })
    } catch (error) {
        console.log("Something went wrong with restPassword", error)
        return response(400).send("Error! Try again.")
    }
}