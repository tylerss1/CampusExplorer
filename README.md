This is a full-stack web application developed in my CPSC 310 class. The frontend is simple HTML/CSS/JS with a Typescript backend and express for the API endpoints. The backend implements querying on past statistics gathered on the courses offered at UBC (ex. class average, pass count, instructor name, etc.). It also supports querying on the individual classrooms (ex. # of seats, lat/lon location, etc.). This information is then passed to the frontend to be displayed.


## Project commands

1. `yarn install` to download the packages specified in your project's *package.json* to the *node_modules* directory.

1. `yarn build` to compile your project. You must run this command after making changes to your TypeScript files. If it does not build locally, AutoTest will not be able to build it.

1. `yarn test` to run the test suite.

1. `yarn lint` to lint your project code. If it does not lint locally, AutoTest will not run your tests when you submit your code.

1. `yarn pretty` to prettify your project code.
