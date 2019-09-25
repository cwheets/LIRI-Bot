console.log('Hello my name is ', process.env.YOUR_NAME);
// console.log(process.env)

const fs = require('fs');




const isEnvironmentVariable = new RegExp(/.*=.*/)


const envContents = fs
.readFileSync('./.env', 'utf-8')
.split("\n")
.forEach((line) => {
    console.log(line);
    console.log(typeof(line))
    if (isEnvironmentVariable.test(line)) {
        line = line.replace("\r", "");
        console.log(line)
        const key = line.split("=")[0]
        const value = line.split("=")[1]
        process.env[key] = value
        console.log(process.env.);
        
    }
})

console.log()
console.log(process.env)

// console.log(envContents)
