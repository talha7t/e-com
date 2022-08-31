class ApiFeatures {
  constrcutor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", // case insensitive search
          },
        }
      : {}; // if no query is given return all products;

    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = ApiFeatures;
