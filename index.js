const express = require('express');
const app = express();
const fs = require("fs");
const crypto = require('crypto');

app.use(express.json());
app.get('/api/challenges', (req, res)=>{
    
    const data = req.query.data;
    try
    {            
        if(!data)
        {
            throw new Error("Invalida parameters");
        }
        const ageToFilter = 32;
        const filename = "./output.txt";
        const keys = filterAge(data, ageToFilter);
        createFile(keys, filename);
        const hash  = getHashFile(filename);
        console.log(hash);
        res.json(hash);
    }
    catch(err){
        res.json(err.message)
    }
   
})

app.listen(3000,()=>{});

function filterAge(data, age)
{
  const keys = data.match(/(key=)[A-Za-z0-9]*/g);
  const ages = data.match(/(age=)[0-9]*/g);
  const recordsQty = ages.length;
  let keysFound = [];
  for(let i = 0; i < recordsQty; i++)
  {
    if(ages[i].includes(age))
    {
      keysFound.push(keys[i].replace("key=",""));
    }
  }
  return keysFound;
}

function createFile(keys, filename){
  
  const writeStream = fs.createWriteStream(filename);
  for(const key of keys)
  {
    writeStream.write(`${key}\n`)
  }  
}

function getHashFile(filename)
{
  const fileBuffer = fs.readFileSync(filename);
  const hashSum = crypto.createHash('sha1');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}