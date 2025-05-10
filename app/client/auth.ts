import { ID, OAuthProvider, Query } from "appwrite";
import { account, appWriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
    try {
        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/`,
            `${window.location.origin}/404`
        );
    } catch (error) {
        console.log("loginWithGoogle:", error);
        throw error;
    }
}

export const getUser = async () => {
    try {
        const user = await account.get();

        if (!user) return redirect("/sign-in");

        const { documents } = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select(["name", "email", "imageUrl", "joinedAt"])
            ]
        );

        return documents[0];
    } catch (error) {
        console.log("getUser:", error);
        throw error;
    }
}


export const logOut = async () => {
    try {
        await account.deleteSession("current");
        return true;
        console.log("User logged out successfully");
    } catch (error) {
        console.log("logOut error:", error);
        throw error;
    }
}



export const getGooglePicture = async () => { 
    try {
        // get current session
        const session = await account.getSession("current");

        // get 0Auth2 token from the session
        const oAuth2Token = session.providerAccessToken;

        if (!oAuth2Token) {
            console.log("No OAuth2 token found");
            return null;
        }

        // make a request to the Google API to get user profile image
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
                method: "post",
                headers: {
                    Authorization: `Bearer ${oAuth2Token}`,
                }
            }
        );

        if (!response.ok) {
            console.log("Error fetching Google profile picture:", response.statusText);
            return null;
        }

        const { photos } = await response.json();

        if (!photos || photos.length === 0) {
            console.log("No profile picture found!");
            return null;
        } 

        //  return the first profile picture found
        return photos?.[0].url || null;
       
    } catch (error) {
        console.log("getGooglePicture", error);
    }
}

export const storeUserData = async () => {
    try {
        const user = await account.get();

        if (!user) throw new Error("User not found");

        const { providerAccessToken } = (await account.getSession("current")) || {};

        const profilePicture = providerAccessToken ? await getGooglePicture() : null;

        const { documents } = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal("accountId", user.$id)]
        );

        if (documents.length > 0) return documents[0];
        
        // if the user doesn't exist, create a new document

        const createdUser = await database.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                name: user.name,
                email: user.email,
                imageUrl: profilePicture || "",
                joinedAt: new Date().toString()
            }
        );

        if (!createdUser.$id) redirect("/sign-in");
        return createdUser;
    } catch (error) {
        console.log("storeUserData", error);
    }
}


export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal("accountId", id)]
        );

        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.log("getExistingUser", error);
        return null;
    }
}