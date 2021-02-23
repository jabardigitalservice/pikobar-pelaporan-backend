const searchExport = (query) => {
  let search
  if(query.search){
    let search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];
    search = search_params
  } else {
    search = {}
  }

  return search
}

module.exports = {
  searchExport
}