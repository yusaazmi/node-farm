const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// FILE

// blocing, synchronous
// const test = fs.readFileSync('./starter/txt/input.txt','utf-8');
// console.log(test);

// const textOut = `This is avocadooooooo boys : ${test}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt',textOut);

// const textOut1 = `This is avocadasdasdooooooo boys : ${test}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output1.txt',textOut1);
// console.log('File Written');

// non blocking, asynchronous
// fs.readFile('./starter/txt/start.txt','utf-8',(err,data1)=>{
//     if(err) return console.log("ERROR! 🤯");
//     fs.readFile(`./starter/txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);

//             fs.writeFile('.starter/txt/final.txt',`${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('Your file has being written 😃');
//             })
//         });
//     });
// });
// console.log("read this!!");

// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);

const slugy = dataObj.map((key) =>
  slugify(key.productName, {
    replacement: '-',
    lower: true,
  })
);
console.log(slugy);
const server = http.createServer((req, res) => {
  // OVERVIEW
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((key) => replaceTemplate(tempCard, key))
      .join('');
    const output = tempOverview.replace('{%#PRODUCT_CARDS#%}', cardsHtml);
    res.end(output);

    // console.log(cardsHtml);
  }
  // Api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  // PRODUCT
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const productHtml = dataObj[query.id];
    const output = replaceTemplate(tempProduct, productHtml);

    res.end(output);
  }
  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello World',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to port 8000');
});
