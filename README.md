# spa-webserver
A development webserver (do not use in production) that redirects non-existent urls to the nearest index.html, allowing for SPA-style client-side navigation. 
For example, if a visitor visits `//yoursite.com/products/id123`, but only a root `/index.html` file exists, spa-webserver will climb up the folder hierarchy looking for index files until it reaches the root, and load it. The url in the adress bar will remain as is, allowing the app to update its state accordingly.

## Install
```
npm install spa-webserver --save
```

## Use
```
spa-webserver -d './build'
```

Opts:
- `-d`: root directory (defaults to ./)
- `-p`: port (defaults to process.env.PORT)


## License

Released under an MIT license.

## Related
- [link-react](https://github.com/thinkloop/link-react/): A generalized link <a> component that allows client-side navigation while taking into account exceptions

## Other
- [memoizerific](https://github.com/thinkloop/memoizerific/): Fast, small, efficient JavaScript memoization to memoize JS functions
- [todo-app](https://github.com/thinkloop/todo-app/): Example todo app of extreme decoupling of react, redux and selectors

Like it? Star It
