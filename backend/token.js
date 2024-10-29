import  google from "google-auth-library"
import dotenv from 'dotenv'
dotenv.config()

async function getAccessToken() {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground" // Redirect URI
    );

    oAuth2Client.setCredentials({
        refresh_token: "YOUR_REFRESH_TOKEN",
    });

    const accessToken = await oAuth2Client.getAccessToken();
    console.log("Access Token:", accessToken.token);
}

getAccessToken();