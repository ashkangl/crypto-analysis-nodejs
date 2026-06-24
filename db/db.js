import mongoose from "mongoose";

const DB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Database Connected!')
    } catch (error) {
        console.error("DATABASE NOT CONNECTED!:", err);
        process.exit(1);
    }
}

export default DB;