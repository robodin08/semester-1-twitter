import { Client, Account, Avatars, Databases } from 'react-native-appwrite'

const client = new Client()
    .setProject("68da84f80002a241ed69")
    .setPlatform("com.dinandw.twittermini");

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);