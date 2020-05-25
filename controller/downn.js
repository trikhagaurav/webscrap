const storeData = require("../util/csvStore");
const getdata = require("../util/csvExtract");
const downloadPdf = require("../util/downloadPdf");
let extdata;
const stdown = async () =>{
    await storeData();
    extdata = await getdata();
    console.log(extdata);
    downloadPdf(extdata);
    //console.log(typeof extdata);
   // console.log(extdata.retdata);
    //extdata.
    //then(()=>{
        /*await extdata.retdata.forEach(function(item,index){
        console.log(item.subject);
        console.log(1);
        })*/
    //})
    /*.then(()=>{
        extdata = extractData();
        console.log(extdata);
    })
    //.then(()=>{
        console.log(extdata);
    //})*/
};
/*const downd = async() => {
    await stdown();
    console.log(extdata);
}; 
downd();*/
//stdown();
//console.log(extdata);
module.exports = stdown;
