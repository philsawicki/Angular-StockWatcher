REM Runs automated tasks commonly used during development, such as:
REM   * Starting HTTP server.
REM   * Gulp Watch-ing file changes to build /dist project files.
REM   * Karma Watch-ing file changes to run automated unit tests.

start cmd /k "npm start"
start cmd /k "gulp watch"
start cmd /k "npm test"

exit
