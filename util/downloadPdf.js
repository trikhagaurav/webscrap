const axios = require("axios");
const fs = require("fs");
const Path = require("path");
const config = require("./../config/config");
let low=0; //variable to store starting index of batch of files for downloading 
let high=5; //variable to store one more than last index of batch of files for downloading
let complete=0; //variable to store the number of files downloaded 
let chno=0; //variable that stores the chapter number
let currSubject=''; //variable that holds the current Subject whose chapters are being downloaded
let eng_part; //variable to store the English subpart of the Subject
let hindi_part; //variable to store the Hindi subpart of the Subject
async function dwnld (url1,fold,nm) { //function to download the files from the url1 and store them in the specified path		
	const path=Path.resolve(`${config.downloadpath.folder}\\\\${fold}`,nm);
	const response = await axios({ //initializing axios instance with the url, 'GET' method and stream value for responseType 
		method: 'GET',
		url: url1,
		responseType: 'stream',
	})
	response.data.pipe(fs.createWriteStream(path)); //piping the read-stream into the Node.js write-stream that points to a file at the specified path		
	return new Promise((resolve,reject) => {
		response.data.on('end',() => {
			complete=complete+1; //incrementing the number of files downloaded
			console.log(`Downloaded : ${fold}/${nm}`);
			console.log(` ${complete} Chapters Downloaded`);
	 		resolve()
		}) 
		response.data.on('error',(err)=>{
			reject(err)
		})
	})	
};
const startDownload= async (retdata) => { //function for downloading files 
	let promises=[]; //array to store a file to be downloaded
	for(let i=low;i<high;i++)
	{		
		if(currSubject!==retdata[i].Subject) //Checking if the Subject has changed  
		{
			chno=1;
			currSubject= retdata[i].Subject; //making the new subject as the current Subject
			eng_part='';
			hindi_part='';
		}
		if((!retdata[i].English_Link)&&(!retdata[i].Hindi_Link)) //Checking if the Subject has a subpart(unit) or not
		{
			chno=0;
			eng_part=retdata[i].English_Chapter;
			hindi_part=retdata[i].Hindi_Chapter;
		}
		if(retdata[i].English_Link) //Checking if the subject has a link for the English Chapters
		{
			promises.push(dwnld(retdata[i].English_Link, retdata[i].Subject, eng_part+`-Chapter-${chno}(in-English).pdf`).catch((err)=>{console.log(err.message)}));
		}
		if(retdata[i].Hindi_Link) //Checking if the subject has a link for the Hindi Chapters
		{
			promises.push(dwnld(retdata[i].Hindi_Link, retdata[i].Subject, hindi_part+`-Chapter-${chno}(in-Hindi).pdf`).catch((err)=>{console.log(err.message)}));
		}
		chno=chno+1; //incrementing the chapter number
	}
	await Promise.all(promises)
	.then(()=>{ //if all files for a batch are downloaded then calling the startDownload function to download the next batch
		low=high;
		high=high+5;
		if(high>retdata.length)
		{
			high=retdata.length;
		}
		if(low<retdata.length)
		{
			startDownload(retdata);
		}		
	})
	.catch((err)=>{ //if any of the file for a batch is not able to downloaded then calling the startDownload function to download the next batch
		low=high;
		high=high+5;
		if(high>retdata.length)
		{
			high=retdata.length;
		}
		if(low<retdata.length)
		{
			startDownload(retdata);
		}
	});
}
module.exports = startDownload;