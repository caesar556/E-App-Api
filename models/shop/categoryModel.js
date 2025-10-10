import { Document, model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name:{
      type: String,
      required: [true, "category name is required"],
    },
    slug:{
      type: String,
      required: [true, "slug name is required"],
    },
    description:{
      type: String,
    }
  },
  { timestamps: true, versionKey: false }
);

export const Category = model('Category', categorySchema);