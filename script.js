//Initialise variables from HTML
const memeTitle = document.getElementById("meme-title");
const memeImage = document.getElementById("meme-image");
const generateMemeBtn = document.getElementById("meme-button");
const loadingIndicator = document.getElementById("loading");
const memeCountDisplay = document.getElementById("meme-count");

//Start meme count from 0
let memeCount = 0;

//Get a random subreddit from array to get meme from
function getRandomSubreddit() {
  const subredditsArray = [
    "ProgrammerHumour",
    "programmingmemes",
    " codingmemes",
    "devhumormemes",
    "programminghumor",
  ];
  const randomIndex = Math.floor(Math.random() * subredditsArray.length);
  return subredditsArray[randomIndex];
}

let seenMemes = [];


//Function for fetching the API
async function fetchMemeAPI() {
  try {
    //Display loading state
    loadingIndicator.style.display = "block";

    //Get random subreddit
    const subreddit = getRandomSubreddit();

    //Fetch data from API
    const url = `https://meme-api.com/gimme/${subreddit}`;
    const response = await fetch(url);
    const data = await response.json();

    // Filtering out nsfw memes
    if (data.nsfw) {
      console.log("nsfw found");
      return fetchMemeAPI()
    }

    if (!data.title || !data.url) {
      console.log(
        "Meme with undefined or empty title/url found. Fetching another..."
      );
      return fetchMemeAPI();
    }

    return data;

  } catch (error) {
    //Handing error cases
    console.error(`ERROR: ${error.message}`);
    memeTitle.innerText = "Something went wrong, cannot retrieve meme";
    memeImage.src = "";
    memeImage.alt = "Error loading meme";
  } finally {
    // After loaded, loading indicator will disappear
    loadingIndicator.style.display = "none";
  }
}



//Function for updating DOM
function displayMeme(memeData) {
  //Update meme data
  memeTitle.innerText = memeData.title;
  memeImage.src = memeData.url;
  memeImage.alt = memeData.title;

  //Update & display meme count when generated
  memeCount++;
  memeCountDisplay.innerText = `Memes Generated: ${memeCount}`;
}

//Function to pass api data to display meme function
async function generateAndDisplayNewMeme() {
  const memeData = await fetchMemeAPI()

  //Find repeated meme in seenMemes array
 let repatedMeme = seenMemes.find(url => url === memeData.url);

 //If found a repeated meme, trigger function get new meme
 if (repatedMeme) {
   console.log("Meme retrieved:", memeData.url); 
   console.log("Repeated meme found:", repatedMeme); 
   console.log("Memes Seen so far:", seenMemes);
   console.log("Skipping this meme and fetching a new one...");
   generateAndDisplayNewMeme();
   return;
 }

  // Add new URL to seenMemes array
  seenMemes.push(memeData.url);
  console.log("New meme added to seenMemes:", memeData.url);

  // Display the new meme
  displayMeme(memeData);
  console.log("FALSE: Displaying new meme:", memeData.url);
}

//To display meme when page is refreshed
window.addEventListener("DOMContentLoaded", generateAndDisplayNewMeme);

//Generate new meme when button is clicked
generateMemeBtn.addEventListener("click", generateAndDisplayNewMeme);
