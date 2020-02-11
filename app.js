const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

//const items = ["test 1", "test 2", "test 3"];
//const workItems = ["test 1", "test 2", "test 3"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

// const item1 = new Item({ name: "Buy Food" });
// const item2 = new Item({ name: "Cook Food" });
// const item3 = new Item({ name: "Eat Food" });

// const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function(err) {
//   if (err) console.log(err);
//   else console.log("success");
// });

app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({}, function(err, result) {
    const items = result;
    res.render("list", { listTitle: day, listItems: items });
  });
});

app.post("/", function(req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work",
    listItems: workItems
  });
});

app.post("/work", function(req, res) {
  const item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
