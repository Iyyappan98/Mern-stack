class apiFeatures  {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    search() {
      let keyword =  this.queryStr.keyword ? {
            name: {
                $regex : this.queryStr.keyword,
                $options : 'i'
            }
        } : {};

        this.query.find({...keyword})
        return this;
    }
    filter() {
    const queryStrCopy = { ...this.queryStr };

    const removeFilds = ["keyword", "limit", "page"];
    removeFilds.forEach(field => delete queryStrCopy[field]);

    
    const queryObj = {};

    Object.keys(queryStrCopy).forEach(key => {
        if (key.includes('[') && key.includes(']')) {
            const [field, operator] = key.split(/\[|\]/); 
            if (!queryObj[field]) queryObj[field] = {};
            queryObj[field][`$${operator}`] = Number(queryStrCopy[key]);
        } else {
            queryObj[key] = queryStrCopy[key];
        }
    });

    // console.log("Parsed Filter Object:", queryObj);

    this.query = this.query.find(queryObj);
    return this;
}
  paginate(resperpage) {
     const currentPage = Number(this.queryStr.page) || 1;
     const skip = resperpage * (currentPage -1);
     this.query.limit(resperpage).skip(skip);
     return this;
  }
}

module.exports = apiFeatures;