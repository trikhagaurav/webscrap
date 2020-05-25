const fs = require("fs");
const config = require("./../config/config")
const csv = require('csv-parser');
let retdata = [];
const getdata = async ()=> { //function to extract data from the CSV file
    //retdata = await storedata();
    //retdata = [];
    return new Promise((resolve,reject)=>{
	fs.createReadStream(config.csv.path)
        .pipe(csv())
        .on('data', (data) => {
            retdata.push(data);
        })
        .on('end', () => {
            //console.log(retdata); //displaying retdata array 
            console.log('CSV file sucessfully parsed');
            //returnExtractData();
            resolve(retdata);
            //startDownload(); //calling the startDownload function
            //return retdata;
            //module.exports = retdata;
        })
        .on('error', (err) => {
            reject(err);
        });
    })
    //console.log(retdata);
    /*return {
        retdata
    };*/
}
module.exports = getdata;
/*const returnExtractData = async () => {
    let ret2 = await getdata();
    //.then(()=>{
    ret2.forEach((item,index)=>{
        console.log(item);
    })
    console.log(1);
    //})
    return {
        ret2
    };
}*/
//returnExtractData();
//exports.getData = returnExtractData;