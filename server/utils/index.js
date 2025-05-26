import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dns from "dns";

const dbConnection = async () => {
    try {
        // First, try to resolve the MongoDB hostname
        try {
            await dns.promises.lookup('cluster0.kdov8dx.mongodb.net');
            console.log('DNS resolution successful');
        } catch (dnsError) {
            console.error('DNS resolution failed:', dnsError.message);
            console.log('Trying to use alternative DNS servers...');
            // Try using Google's DNS servers
            dns.setServers(['8.8.8.8', '8.8.4.4']);
        }

        const options = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 5,
            connectTimeoutMS: 30000,
            retryWrites: true,
            retryReads: true,
            authSource: 'admin'
        };

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            if (err.message.includes('whitelist')) {
                console.log('\nPlease whitelist your IP address in MongoDB Atlas:');
                console.log('1. Go to https://cloud.mongodb.com');
                console.log('2. Click on "Network Access"');
                console.log('3. Click "Add IP Address"');
                console.log('4. Add your current IP address\n');
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(dbConnection, 5000);
        });

        mongoose.connection.on('connected', () => {
            console.log('Successfully connected to MongoDB Atlas');
        });

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("DB connection successful");    

    } catch (error) {
        console.error("DB Connection Error:", error.message);
        if (error.message.includes('whitelist')) {
            console.log('\nPlease whitelist your IP address in MongoDB Atlas:');
            console.log('1. Go to https://cloud.mongodb.com');
            console.log('2. Click on "Network Access"');
            console.log('3. Click "Add IP Address"');
            console.log('4. Add your current IP address\n');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\nDNS resolution failed. Please check:');
            console.log('1. Your internet connection');
            console.log('2. If you can access MongoDB Atlas website');
            console.log('3. If your MongoDB Atlas cluster is running\n');
        }
        console.log("Retrying connection in 5 seconds...");
        setTimeout(dbConnection, 5000);
    }
};

export default dbConnection;

// export const createJWT = (res, userId) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== "development",
//         sameSite: "none",  //prevent CSRF attacks
//         maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });
//     console.log("JWT token created and sent in cookie");
// };

export const createJWT = (res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log('=== JWT Creation Debug ===');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('User ID:', userId);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,  // 1 day
            path: "/"
        };

        console.log('Cookie options:', cookieOptions);
        res.cookie("token", token, cookieOptions);
        console.log("JWT token created and sent in cookie");
        
        return token;
    } catch (error) {
        console.error("Error creating JWT:", error.message);
        throw new Error("Error creating token");
    }
};

