import mysql from 'mysql'
const  connectDB = () => {
  const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database : "placetoeat"
  });
  
  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  return conn;
}



export default connectDB