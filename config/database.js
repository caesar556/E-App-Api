import mongoose from 'mongoose';


const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((conn) => {
      console.log(`Database connected ${conn.connection.host}`)
    }).catch((err) => console.log(err))
}

export default dbConnection;