import mysql from 'mysql'
const  connectDB = () => {
  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database : process.env.DB_SERVER
  });
  
  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  return conn;
}



export default connectDB