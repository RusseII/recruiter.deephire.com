
<h1 align="center">DeepHire</h1>

<div align="center">

Automated Video Interviews Built for Recruiters


[![recruiter.deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fbadge%3Dhttps%3A%2F%2Frecruiter.deephire.com)](https://recruiter.deephire.com)
[![recruiter.deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fuptimes%3D1%26badge%3Dhttps%3A%2F%2Frecruiter.deephire.com)](https://recruiter.deephire.com)

[![blog.deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fbadge%3Dhttps%3A%2F%2Fblog.deephire.com)](https://blog.deephire.com)
[![blog.deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fuptimes%3D1%26badge%3Dhttps%3A%2F%2Fblog.deephire.com)](https://blog.deephire.com)

[![deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fbadge%3Dhttps%3A%2F%2Fdeephire.com)](https://deephire.com)
[![deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fuptimes%3D1%26badge%3Dhttps%3A%2F%2Fdeephire.com)](https://deephire.com)

[![a.deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fbadge%3Dhttps%3A%2F%2Fa.deephire.com)](https://a.deephire.com)
[![a.deephire.com](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fuptimes%3D1%26badge%3Dhttps%3A%2F%2Fa.deephire.com)](https://a.deephire.com)


![](https://s3.amazonaws.com/deephire/logos/deephire+shortlists+photo.jpg)

</div>

- Preview: https://recruiter.deephire.com
- Home Page: https://deephire.com
- API: https://a.deephire.com
- Blog: https://blog.deephire.com


## Browsers support

Modern browsers and IE11.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions



### Running instructions
```
git clone https://github.com/RusseII/recruiter.deephire.com.git 
cd recruiter.deephire.com
yarn
yarn start 
```

In src/Auth/auth0-variables.js, change callbackUrl to use localhost 
```
callbackUrl: 'http://localhost:8000/user/callback',
// callbackUrl: 'https://recruiter.deephire.com/user/callback',
```

Go to http://localhost:8000

Check out roadmap at https://github.com/RusseII/recruiter.deephire.com/wiki
