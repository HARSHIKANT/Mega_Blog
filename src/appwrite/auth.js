import config from "../conf/config";
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectID);

        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login( email, password );
            }
            else{
                return userAccount;
            }
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }
    async login(email,password){
        try{
            const sessuib = await this.account.createEmailPasswordSession(email,password); 
            return sessuib;
        } catch (error) {
            console.log("Error logging in:", error);
            throw error;
        }
    }
    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
        return null;
    }
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}
const authService = new AuthService();

export default authService