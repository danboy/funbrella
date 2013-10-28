module.exports = {
  jade: {
    match: /\.jst$/,
    compileSync: function(sourcePath, source) {
      return require('jade')
        .compile(source, {
          client: true
        })
        .toString()
        .replace('anonymous', require('path')
        .basename(sourcePath, '.jade'));
    }
  }
};
