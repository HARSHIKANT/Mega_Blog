import config from "../conf/config";
import { Client, Account, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    constructor (){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
    async createPost({title, slug, content, featuredImage, status, userId}){
        try{
            return await this.databases.createDocument(config.appwriteDatabaseID,config.appwriteCollectionID, slug, {
                title,
                content,
                featuredImage,
                status,
                UserID : userId
            }); 
        } catch(error){
            throw error;
        }
    }
    async updatePost(slug, {title, content, featuredImage, status}){
        try{
            return await this.databases.updateDocument(config.appwriteDatabaseID,config.appwriteCollectionID, slug, {
                title,
                content,
                featuredImage,
                status,
            }); 
        } catch(error){
            console.log("appwrite erro:: updatedoc", error);
            throw error;
        }
    }
    async deletePost(slug){
        try{
            await this.databases.deleteDocument(config.appwriteDatabaseID,config.appwriteCollectionID, slug);
            if (featuredImageId) {
                await this.deleteFile(featuredImageId); // 👈 remove file from bucket too
            }
            return true; 
        } catch(error){
            console.log("appwrite error:: deletedoc", error);
            return false;
        }
    }
    async getPost(slug){
        try{
            return await this.databases.getDocument(config.appwriteDatabaseID,config.appwriteCollectionID, slug);
        } catch(error){
            console.log("appwrite error:: getdoc", error);
            throw error;
        }
    }
    async getPosts(queries = [Query.equal("status", "active")]){
        try{
            return await this.databases.listDocuments(config.appwriteDatabaseID, config.appwriteCollectionID, queries);
        } catch(error){
            console.log("appwrite error:: listdoc", error);
            return false;
        }
    }
    // file upload service

    async uploadFile(file) {
        try {
            const account = new Account(this.client);
            const user = await account.get(); // 👈 get logged-in user details
    
            const response = await this.bucket.createFile(
                config.appwriteBucketID,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any()),           // Public read access
                    Permission.write(Role.user(user.$id))  // Only this user can modify/delete
                ]
            );
            return response;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(config.appwriteBucketID, fileId);
            return true;
        } catch (error) {
            console.error("Error deleting file:", error);
            return false;
        }
    }
    getFilePreview(fileId) {
        return this.bucket.getFileView(config.appwriteBucketID, fileId);
    }
}

const service = new Service();

export default service;