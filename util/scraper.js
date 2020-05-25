const cheerio = require("cheerio");
const axios = require("axios");
const config = require("./../config/config")
let allSubjects; //Array to store all the details about subjects
const siteUrl = config.scrap.siteurl;
const fetchData = async () => {
	allSubjects = [];
	const result = await axios.get(siteUrl);  //making HTTP request to get the website's content
  	return cheerio.load(result.data);  //loading HTML code of the website and returning a Cheerio instance
};
const scrap = async ($,str, subject) => { //function to extract data from the tables with download links for each subject 	
	$(str).each((index,element) => { //extracting data from the table for each subject 	
  		let engchap= $(element).find("td:first-child").text(); //variable to store Chapters in English for the subject 
        let hindichap= $(element).find("td:nth-child(2)").text(); //variable to store Chapters in Hindi for the subject 
        let englink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters in English for the subject
		let hindilink= $(element).find("td:nth-child(2) a").attr('href'); //variable to store link for Chapters in Hindi for the subject
		if(subject==='Hindi')//Checking if the subject is Hindi 
		{
			hindichap= $(element).find("td:first-child").text();
			hindilink= $(element).find("td:first-child a").attr('href');
			if(!hindichap) //Checking if the variable hindichap contains the sub-units for Hindi subject 
			{
				hindichap=$(element).find("th:first-child").text();
			}
			engchap= undefined;
			englink= undefined;
		}
		if(!engchap&&!hindichap) //Checking if both engchap and hindichap are undefined and if so then storing the sub-units in them
		{
			engchap= $(element).find("th:first-child").text();
			hindichap= $(element).find("th:nth-child(2)").text();
			if(hindichap==='')
			{
				hindichap= undefined;
			}
		}
		else if(!hindichap) //Checking if only the hindichap in undefined
		{
			engchap= $(element).find("td:first-child").text();	
			hindichap = undefined;
		}
		if(engchap!==" Chapters PDF in English"&&engchap!=="Chapters PDF in English"&&hindichap!=="Chapters PDF in Hindi") //Removing heading like 'Chapters PDF in English' and 'Chapters PDF in Hindi'
		{
			allSubjects.push({name: subject, //Pushing the information about the subject into the allSubjects array
						engch: engchap,
						englk: englink,
						hindich: hindichap,
						hindilk: hindilink
		})
		}
  	});	
}
const subjectArr = ($,str)=> { //function for finding the all the subjects for which each links are given in the tables and storing them in the subarr array  
	let w1=$(str).text().indexOf("0");
	let w2=$(str).text().indexOf("Book");
	return $(str).text().substring(w1+2,w2-1);
}
const getResults = async () => { //function to extract data from website and store it in an array
	const $ = await fetchData();
	let query=$("article div.table-responsive table");
	let start = 2;
	let end = query.length;
	let query2=$("article h3");
	let subarr = []; //array to store all the subjects
	for(let j=0;j<query2.length;j++)
	{
		subarr[j] = subjectArr($,`article h3:nth-of-type(${j+1})`); //calling subjectArr function to find all the subjects that have download links and storing them in the subarr array
	}
	for(let i=start;i<=end;i++) //calling the function scrap for the table with links for each subject
	{
		await scrap($,`article div.table-responsive:nth-of-type(${i}) table:nth-child(1) tr`, subarr[i-2]); 
	}
	return {
		allSubjects //returning the all allSubjects array
	};
}
//getResults();
module.exports = getResults;
