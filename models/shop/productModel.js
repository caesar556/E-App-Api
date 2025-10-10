import { Document, model, Schema } from 'mongoose';


const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    category:{
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    totalStock:{
      type: Number,
      required: [true, "Total Stock is required"],
    },
    price:{
      type: Number,
      required: [true, "price is required"],
    },
    salePrice:{
      type: Number,
    },
    discount:{
      type: Number,
    },
    shortDesc:{
      type: String
    }
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: "category",
    select: "name slug"
  });
  next();
})

export const Product = model("Product", productSchema);