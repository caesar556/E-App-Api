import { Query } from "mongoose";


class ApiFeatures {
  constructor(queryString, query) {
    this.queryString = queryString;
    this.query = query;
  }

  filter() {
    let queryObj = { ...this.queryString };

    const excludeFields = ["page", "sort", "fields", "limit"];
    excludeFields.forEach((e) => delete queryObj[e]);

    let mongoFilter = {};

    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];

      if (key.includes("[") && key.includes("]")) {
        const field = key.split("[")[0]; 
        const operator = key.split("[")[1].replace("]", "");

        if (!mongoFilter[field]) mongoFilter[field] = {};
        mongoFilter[field][`$${operator}`] = Number(value);
      }

      else if (typeof value === "object") {
        mongoFilter[key] = {};

        Object.keys(value).forEach((op) => {
          mongoFilter[key][`$${op}`] = Number(value[op]);
        });
      }

      else {
        mongoFilter[key] = value;
      }
    });

    this.query = this.query.find(mongoFilter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);

    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);

    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;