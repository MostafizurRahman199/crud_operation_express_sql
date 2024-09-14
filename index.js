const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "iloveammu199",
  database: "delta_app",
});

const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// connection.connect();

//inserting new data
// let query = "insert into user (id, username, email, password) values ?";

// let data = [];
// for (let i = 0; i < 100; i++) {
//   data.push(getRandomUser());
// }

// try {
//   connection.query(query, [data], (error, result) => {
//     if (error) {
//       throw error;
//     } else {
//       console.log(result);
//     }
//   });
// } catch (error) {
//   console.log(error);
// }

// connection.end();

// console.log(getRandomUser());

app.get("/user/new", (req, res) => {
  res.render("new.ejs"); // Renders a form to create a new user
});


app.post("/user", (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.string.uuid();  // Generate a random ID for the new user
  let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
  
  try {
    connection.query(q, [id, username, email, password], (error, result) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/user");  // Redirect back to the list of users after adding
      }
    });
  } catch (error) {
    console.log(error);
    res.send(`Error occurred in the database`);
  }
});





app.get("/", (req, res) => {
  let q = `select count(*) from user`;
  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let count = result[0]["count(*)"];
        res.render("home.ejs", { count });
      }
    });
  } catch (error) {
    console.log(error);
    res.send(`some error is database`);
  }
});

app.get("/user", (req, res) => {
  let q = `select * from user`;
  try {
    connection.query(q, (error, users) => {
      if (error) {
        throw error;
      } else {
        res.render("user.ejs", { users });
      }
    });
  } catch (error) {
    console.log(error);
    res.send(`some error occur in database`);
  }
});

//Edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id = '${id}'`;
  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let user = result[0];
        console.log(user);
        res.render("edit.ejs", { user });
      }
    });
  } catch (error) {
    console.log(`Have error on database`);
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id = '${id}'`;
  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let user = result[0];
        console.log(user);
        res.render("delete.ejs", { user });
      }
    });
  } catch (error) {
    console.log(`Have error on database`);
  }
});

// update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let {password : fromPassword, username: newUserName} = req.body;
  let q = `select * from user where id='${id}'`;

  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let user = result[0];
        if(user.password !== fromPassword){
          res.send(`Wrong Password`);
        }else{
            let q2 = `update user set username='${newUserName}' where id='${id}'`;
            connection.query(q2, (error, result)=>{
            if(error){
              throw error;
              }else{
                res.redirect("/user");
              }

          })
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.send(`Error happened in Database`);
  }
});


app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let {password : fromPassword, email: fromEmail} = req.body;
  let q = `select * from user where id='${id}'`;

  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let user = result[0];
        if(user.password !== fromPassword &&  user.email !== fromEmail){
          res.send(`Wrong Password`);
        }else{
            let q2 = `DELETE FROM user WHERE id='${id}'`;
            connection.query(q2, (error, result)=>{
            if(error){
              throw error;
              }else{
                res.redirect("/user");
              }

          })
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.send(`Error happened in Database`);
  }
});




app.listen("8080", () => {
  console.log("Server is listening to port");
});
