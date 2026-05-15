const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 8080;
const a = require('./model/listing.js');
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema }= require("./schema.js");

main()
  .then(() => console.log("Connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/paradadeluxo');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); 

//Page
app.get('/listings', async(req, res) => {
  const allListing = await a.find({});
  res.render("listings/titlelink", { allListing });
});

//Create Button
app.get('/listings/new',(req, res) => {  
  res.render("listings/newlst");
});

const validatelisting = (req, res, next) => { 
  //MW to Check schema validation (joi,schema.js)
  console.log(req.body);
  console.log("\nHello\n");
console.log(req.file);

  let result = listingSchema.validate({listing: req.body});
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  else { next(); }
}

//Create
app.post('/listings/create',validatelisting, wrapAsync(async (req, res, next) => {  
  const { title, description, price, location, country } = req.body;  // Extract data from form
  await a.create({title, description, price,location,country  }); // Save to DB    
  console.log("Data saved successfully!");
  res.redirect("/listings");
})
);

//View Details by id
app.get('/listings/:id',wrapAsync( async(req, res, next) => { 
const { id } = req.params;
const list = await a.findById(id);
res.render("listings/check", { list });
}));

//Delete
app.delete('/delete/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletechat = await a.findByIdAndDelete(id);
  console.log(deletechat);
  res.redirect('/listings');
}));

 //Update 
// app.put('/update/:id', async (req, res) => {
//   const { id } = req.params;
//   let { title: newtitle, description: newdescription, price: newprice,location: newlocation,country:newcountry } = req.body;
//   let updatedchat = await User.findByIdAndUpdate(
//     id,
//     { title: newtitle, description: newdescription, price: newprice,location: newlocation,country:newcountry},
//     { new: true }
//   );
//   console.log(updatedchat);
//   res.redirect('/listings');
// });

//Modern Update
app.put('/update/:id',validatelisting,wrapAsync( async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // If no image provided, remove it from updateData so Mongo won’t overwrite it
  if (!updateData.image || !updateData.image.url || updateData.image.url.trim() === "") {
    delete updateData.image;
  }

  const updatedListing = await a.findByIdAndUpdate(id, updateData, {
    new: true,// return updated document instead of old one
    runValidators: true // apply schema validations
  });

  console.log(updatedListing);
  res.redirect('/listings');
}));



//update Button
app.put('/uptbtn/:id', wrapAsync(async(req, res, next) => {  
const { id } = req.params;
const allListing = await a.findById(id);
  res.render("listings/update",{ allListing });
}));

// 404 handler (with PATH)
// app.all(/.*/, (req, res, next) => {
//   next(new ExpressError(404, "Page not Found"));
// });

// 404 handler (NO PATH- Better)
app.use((req, res, next) => { // runs by default only when random api's are called
  next(new ExpressError(404, "Page not Found"));
});

//EHMW
app.use((err, req, res, next) => { 
  let { statusCode=500, message ="Aur Karo GndMasti!" } = err;
  res.status(statusCode).render("error", {message});
  // res.status(statusCode).send(message);
});

// //Official Site
// app.get('/tourism', (req, res) => {  
//   res.render("code");
// });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
