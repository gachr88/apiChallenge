const fs = require("fs");
const crypto = require('crypto');
const axios = require('axios');

axios.get('https://coderbyte.com/api/challenges/json/age-counting').then(res=>{
    try
    {            
        const data = res.data?.data || null;
        if(!data)
        {
            throw new Error("Invalid parameters");
        }
        const ageToFilter = 32;
        const filename = "./output.txt";
        const keys = filterAge(data, ageToFilter);
        createFile(keys, filename);
        const hash  = getHashFile(filename);
        console.log(hash);
        
    }
    catch(err){
        console.error(err);
    }
});





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