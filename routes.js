 const fs = require('fs');


 const requestHandler = (req, res) => {
    const method = req.method;
    const url = req.url

    if(url === '/') {
        res.write('<html>')
        res.write('<head><title>Enter </title><head>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button>></input></form><body>')
        res.write('</html>')
        return res.end()
    }

     if(url === '/message' && method === 'POST') {
        const body = []

        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        })
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            const message = parsedBody.split('=')[0]
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302
            res.setHeader("Location", '/')
            return res.end()
            })
            
        })
       
    }

res.setHeader('Content-Type', 'text/html')
res.write('<html>')
res.write('<head><title>My page</title><head>')
res.write('<body><h1>My page</h1><body>')
res.write('</html>')
res.end()
 }

 module.exports = {handler: requestHandler
 }
 

//  const requestHandler = (req, res) => {
//     const url = req.url
//     const method = req.method

//     if(url === '/') {
//         res.setHeader('Content-Type', 'text/html')
//         res.write('<html>')
//         res.write('<head>new title</head>')
//         res.write('<body><h1>greetings</h1><form action="/create-user" method="POST"><input name="username" type="text"><button type="submit">Submit</button></input></form></body>')
//                res.write('</html>')

//         return res.end()
//     }

//     if(url === '/create-user' && method === 'POST') {
//         const userdata = []
//         req.on('data', (chunk) => {
//             userdata.push(chunk)
//         })

//       return  req.on('end', () => {
//             const data = Buffer.concat(userdata).toString()
//             const parsedData = data.split("=")[1]
//             fs.writeFile('message.txt', parsedData, (err) => {
//                 res.statusCode = 302
//                 res.setHeader('Location', '/')
//                return res.end()
//             })
//         })
//     }

//     if(url === '/users') {
//         res.setHeader('Content-Type', 'text/html')
//                 res.write('<html>')
//         res.write('<head>new title</head>')
//         res.write('<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>')
//                res.write('</html>')

//         return res.end()
//     }


//  }

 module.exports = {handler: requestHandler
 }
 