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
  name: String,
  checked: Boolean
};

const Item = mongoose.model("Item", itemSchema);

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

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
    // for(var i = 0; i < items.length)
    res.render("list", { listTitle: day, listItems: items });
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  if (itemName === "") {
    res.redirect("/");
    return;
  }

  const newItem = new Item({
    name: itemName,
    checked: false
  });

  if (listName === date.getDate()) {
    newItem.save();

    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req, res) {
  Item.deleteOne({ _id: req.body.delete }, function(err) {
    res.redirect("/");
  });
});

app.post("/check", function(req, res) {
  let isChecked = req.body.check ? true : false;
  Item.updateOne({ _id: req.body.check2 }, { checked: isChecked }, function(
    err,
    result
  ) {
    res.redirect("/");
  });
});

app.get("/:customList", function(req, res) {
  const customListName = req.params.customList;

  List.findOne({ name: customListName }, function(err, result) {
    if (err) return;

    let list = result;

    if (!list) {
      console.log("not ");
      list = new List({
        name: customListName,
        items: []
      });
      list.save();
    }
    console.log("found");
    res.render("list", { listTitle: list.name, listItems: list.items });
  });
});

app.post("/:customList", function(req, res) {
  const customListName = req.params.customList;

  const itemName = req.body.newItem;

  if (itemName === "") {
    res.redirect("/" + customListName);
    return;
  }

  const newItem = new Item({
    name: itemName,
    checked: false
  });

  newItem.save();

  res.redirect("/");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
