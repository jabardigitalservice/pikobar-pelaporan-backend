const register = (server, options, next) => {
    require('./lapor_mandiri')(server)
    /**
     * TODO: karena fungsinya sudah dibuat dan tinggal notifikasi yang belum
     * maka module integrasi labkes di tutup dlu supaya yang lapor mandiri bisa naik duluan
     */
    // require('./labkes_pelaporan')(server)
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register