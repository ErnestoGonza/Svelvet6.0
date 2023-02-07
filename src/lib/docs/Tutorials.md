# Tutorials

This file contains instructions on how to do useful things such as generating developer documentation, publishing to npm, etc.

## TypeDoc

You may notice TSDoc comments throughout our code. These TSDoc comments can be converted into documentation using TypeDoc:

```
$ npx typedoc --entryPointStrategy expand src/lib
```

This command will create documentation in root folder `./docs`.

## Publishing to npm

- create an account on npm.js
- Within the `src/lib` directory, type `npm version patch` to increment version number
- In the base directory, type `npm run package`. This will use svelte-kit's package feature to create an npm package in `./package`.
- Within the `./package` directory, type `npm publish` to publish to npm. Note that you cannot "overwrite" previous publishes, you must increment the version number

## Testing npm package

- install locally with `npm install svelvet-lime@latest -f`. Note that if you have a previously installed version of svelvet, you must force a re-install otherwise you will be using an outdated npm package.