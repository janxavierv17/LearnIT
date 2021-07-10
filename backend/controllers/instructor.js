import User from "../models/user"
import Stripe from "stripe";
import queryString from "query-string"

const stripe = new Stripe(process.env.STRIPE_SECRET)

export const makeInstructor = async (request, response) => {
    /**
     * 1. Find the user that wants to be an instructor from our database.
     * 2. If the user does not have a stripe_account_id, then we'll create the ID to avoid duplicate ID in Stripe.
     * 3. Create account link based on their account id. This ID will be used in our frontend to complete the onboarding.
     * 4. Pre-fill any info such as email (optional). Then send the URL response from stripe to our frontend.
     * 5. Send the account link as a response to our frontend.
     */
    try {
        // 1. Find the user in our database.
        const user = await User.findById(request.user._id).exec();
        // console.log("To be an instructor: ", user);
    
        // 2. If we don't have the stripe account id then create a new one.
        if (!user.stripe_account_id) {
            const account = await stripe.accounts.create({
                type: "express"
            })
            // console.log("New Account ID: ", account)
            user.stripe_account_id = account.id;
            user.save();
        }
    
        // 3. Creating an account link for Onboarding.
        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: "account_onboarding"
        })
        // console.log("Account Link from Stripe: ", accountLink)
    
        // 4. pre-fill any info after opening the link created by the above.
        accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email
        })
    
        // 5. Send the account lin to our frontend. This is where we use the npm query-link
        response.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    }catch (error) {
        console.log("Something went wrong with becoming an instructor: ", error)
    }
}

export const getAccountStatus = async (request, response) => {
    try {
        const user = await User.findById(request.user._id).exec();
        // Retrieves account details stored in stripe.

        const account = await stripe.accounts.retrieve(user.stripe_account_id)
        // console.log("Account Status: ", account)

        // By default it is enabled.
        if (!account.charges_enabled) {
            // Unathorized 401
            return response.status(401).send("Unauthorized.")
        } else {
            // Update the user model
            const statusUpdated = await User.findByIdAndUpdate(
                user._id,
                {
                    stripe_seller: account,
                    // A special function "$addToSet". It makes sure there's no duplicate
                    $addToSet: { role: "Instructor" }
                },
                { new: true }
            ).select("-password").select("-passwordResetCode").exec();
            response.json(statusUpdated)
        }
    } catch (error) {
        console.log("Something went wrong with getAccountStatus: ", error)
    }
}

export const currentInstructor = async (request, response) => {
    try {
        let user = await User.findById(request.user._id).select("-password").exec();

        if (!user.role.includes("Instructor")) {
            return response.sendStatus(403)
        } else {
            return response.json({ok:true})
        }
    } catch (error) {
        console.log("Something went wrong wtih current instructor route:", error)
    }
}