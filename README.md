# spa-webserver
A dev webserver that redirects non-existent urls to the nearest index.html. 
This allows for SPA-style client-side navigation. 
For example, if a visitor goes to http://yoursite.com/products/id123, and there is only a root index.html file, that file will be loaded with the given url, allowing the app to update its state accordingly.

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

## Like it? Star It
