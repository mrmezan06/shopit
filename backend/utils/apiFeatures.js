class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i', // case insensitive
          },
        }
      : {};

    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryString };

    // Removing fields from the query
    const removeFields = ['keyword', 'limit', 'page'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // console.log(queryCopy);

    // Advance filter for price, ratings, etc
    let queryStr = JSON.stringify(queryCopy);
    // console.log(queryStr);
    // {{URL}}/product?keyword=apple&price[gte]=10&price[lte]=200
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    // {{URL}}/product?page=3
    return this;
  }
}

module.exports = APIFeatures;
