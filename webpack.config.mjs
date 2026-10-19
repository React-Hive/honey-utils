import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * `tsc` writes the `~/` alias into the declarations as it found it in the source
 * (`import type { Nullable } from '~/types'`), and a consumer would resolve that against its own
 * `~`, or not at all - and under `skipLibCheck` the type then falls to `any`. Rewrites every alias
 * in an emitted `.d.ts` to the relative path it stands for, before the file is written.
 */
class RewriteDeclarationAliasesPlugin {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;

    compiler.hooks.thisCompilation.tap(RewriteDeclarationAliasesPlugin.name, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: RewriteDeclarationAliasesPlugin.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        assets => {
          Object.keys(assets)
            .filter(assetName => assetName.endsWith('.d.ts'))
            .forEach(assetName => {
              const declaration = assets[assetName].source().toString();

              const rewritten = declaration.replace(
                /(from\s+|import\(\s*)(['"])~\/([^'"]+)\2/g,
                (_, prefix, quote, target) => {
                  const relativePath =
                    path.posix.relative(path.posix.dirname(assetName), target) || '.';

                  return `${prefix}${quote}${relativePath.startsWith('.') ? relativePath : `./${relativePath}`}${quote}`;
                },
              );

              if (rewritten !== declaration) {
                compilation.updateAsset(assetName, new sources.RawSource(rewritten));
              }
            });
        },
      );
    });
  }
}

const baseConfig = {
  target: ['web'],
  entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.build.json'),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [new RewriteDeclarationAliasesPlugin()],
};

const copyFiles = new CopyPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, 'README.md'),
      to: path.resolve(__dirname, 'dist', 'README.md'),
    },
    {
      from: path.resolve(__dirname, 'LICENSE'),
      to: path.resolve(__dirname, 'dist', 'LICENSE'),
      toType: 'file',
    },
  ],
});

const esmConfig = {
  ...baseConfig,
  mode: 'production',
  output: {
    module: true,
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    },
  },
  devtool: 'source-map',
  experiments: {
    outputModule: true,
  },
  plugins: [...baseConfig.plugins, copyFiles],
};

const cjsConfig = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    library: {
      type: 'commonjs2',
    },
  },
  devtool: 'source-map',
};

const devConfig = {
  ...baseConfig,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].dev.cjs',
    library: {
      type: 'commonjs2',
    },
  },
  devtool: 'source-map',
};

export default [esmConfig, cjsConfig, devConfig];
