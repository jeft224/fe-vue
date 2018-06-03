'use strict'
process.env.NODE_ENV = 'production'

const rm = require('rimraf')
const path = require('path')



rm(path.resolve(__dirname,'../dist/'+ process.env.npm_package_version), err => {
  if (err) throw err
})

