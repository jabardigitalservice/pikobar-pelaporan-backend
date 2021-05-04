const getLastRdtNumber = (number, res, substr) => {
  if (res.length > 0) {
    // ambil 5 karakter terakhir yg merupakan nomor urut dari id_rdt
    let str = res[0].code_test
    number = (Number(str.substring(substr)) + 1)
  }

  return number
}

module.exports ={
  getLastRdtNumber
}