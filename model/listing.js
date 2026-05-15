const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
  title: {
        type: String,
        required: true        // This is Schema
  },
  description: {
        type: String,
        required: true
  },
 image: {
  filename: { type: String, default: "listingimage" },
  url: {
    type: String,
    default: "https://img.freepik.com/premium-photo/xaa-photograph-capturing-road-leading-through-dense-forest-with-sunlight-filtering-through-canopy_958297-8930.jpg",
    set: (v) => v === " " 
        ? "https://img.freepik.com/premium-photo/xaa-photograph-capturing-road-leading-through-dense-forest-with-sunlight-filtering-through-canopy_958297-8930.jpg"
        : v,
  }
},
  price:{
        type: Number,
        required: true
    },
  location: {
        type: String,
        required: true
    },
  country: {
        type: String,
        required: true
  }
});
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing ;