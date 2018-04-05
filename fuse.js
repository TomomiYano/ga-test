const {
  FuseBox,
  CSSPlugin,
  SassPlugin,
  CSSResourcePlugin,
  WebIndexPlugin,
  HTMLPlugin,
  Sparky,
  QuantumPlugin,
} = require("fuse-box");

let fuse, app, vendor, isProduction;

Sparky.task('config', () => {
  fuse = new FuseBox({
    homeDir: 'src',
    output: 'dist/$name.js',  // (1)
    hash: true,
    target: 'browser',
    plugins: [
      HTMLPlugin({
        useDefault: false
      }),
      WebIndexPlugin({
        template: 'src/index.html'
      }),
      [
        SassPlugin({
          outputStyle: 'compressed',
        }),
        CSSResourcePlugin({
          dist: "dist/assets/css"
        }),
        CSSPlugin()
      ],
    ]
  });

  app = fuse.bundle('bundle').instructions('>index.js')
});

Sparky.task('clean', () => Sparky.src('dist/').clean('dist/'))
Sparky.task('copy', () => Sparky.src('index.html', {base: 'dist/'}).dest('./'))
Sparky.task('prod-env', () => { isProduction = true })
Sparky.task('build', ['prod-env', 'clean', 'config'], () => fuse.run())
Sparky.task('release', ['build', 'copy'], () => {})

Sparky.task('default', ['clean', 'config'], () => {
  fuse.dev({
    port: 8000,
  })
  app.watch().hmr()
  return fuse.run()
})
