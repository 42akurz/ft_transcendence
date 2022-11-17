const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: { port: 8080 }
})
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: { webSocketServer: '169.254.128.215',port: 8080}
// })
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: { server: '169.254.128.215', port: 8080}
// })
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: { host: '169.254.128.215',port: 8080}
// })
