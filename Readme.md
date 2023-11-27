This template is configured with
 -> typescript
 -> tailwind
 -> react
 -> daisyui
 -> webpack

Also a package called "react-icons" is also present so that you can use icons there.

For using you have to link every routing possibility in the BrowserRouter beacuse dynamic routing does not work with webpack in react.

There is a "dist" folder which is necessary, bacause the build of this application will be stored there.

To install this template follow the below steps:

 -> Open Git Bash terminal in the directory where you want the files to be stored.
 -> Now use the following commands.
 > git init
 > git clone --branch react-ts-webpack-tailwind-daisyui https://github.com/sddoc-in/web_templates.git

 -> Then open Command prompt, Terminal or Windows Powershell in your computer in the working directory and type
 > pnpm install

# For installing pnpm globally
 NodeJs and npm must be installed on your computer. If note then install them and run below command
 > npm install -g pnpm 

# Scripts in package.json
 -> "start" is used to start the development server
 -> "tsc" is used for compiling the tsx files
 -> "build" is used to make build
 -> "prod-build" to create a production ready server

To run any command do:
 > pnpm run <script from package.json>

## For hosting you have to host the files in the dist folder

## All the files are important deleting any file may result in application failure