class apiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    let queryObj = { ...this.queryStr };
    const exclutedFields = ["page", "sort", "limit", "fields"];
    // delete all this exclutedFields from queryObject
    exclutedFields.forEach((el) => delete queryObj[el]);

    // make qeryStr to change any (gt, lt, gte, lte) to ($gt, $lt, $gte, $lte) them return these from function
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/,
      (match) => `$ ${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  limitFields() {
    // make fields filtrition for some fieled to delete form data
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      // select many of fields that you want to appear in filtriation by atoumatic
      this.query = this.query.select(fields);
    } else {
      // remove _v form category if it written
      this.query = this.query.select("-_v");
    }
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sorted = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sorted);
    } else {
      this.query = this.query.sort("_createdAt");
    }
    return this;
  }
  pagenation() {
    const page = this.queryStr.page;
    const limit = this.queryStr.limit || 3;
    const skip = (page - 1) * limit; //where i want to skip start display categories
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = apiFeatures;
