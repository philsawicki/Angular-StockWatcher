# Angular StockWatcher — Angular Stock Options Watcher

This Angular project is an application which queries the Yahoo! Finance API and Google Finance 
website to retrieve live stock quotes for selected stocks.

### Prerequisites

You must have node.js and its package manager (npm) installed. You can get them from 
[http://nodejs.org/](http://nodejs.org/).

### Install Application

Just run:

```
gulp build
npm install
```

### Run the Application

The project is preconfigured to run a simple development web server. The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/app/` (or to `http://localhost:8000/dist/` for the
compiled and optimized production build).


## Testing

There are two kinds of tests in the application: Unit tests and End to End tests.

### Running Unit Tests

The app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], and run with the [Karma Test Runner][karma]. The Karma
configuration file to run them is provided with the app.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit. This is useful if you want to
check that a particular version of the code is operating as expected. The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner. It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with the web app and verifies that the application responds
correctly. Therefore, the web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver, it must be installed. The project comes 
with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting the application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


### Running the App during Development

The project comes preconfigured with a local development webserver. It is a node.js tool called 
[http-server][http-server]. You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


## Contact

For more information, please check out http://philippesawicki.com
