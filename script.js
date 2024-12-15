//Initialise variables from HTML
const memeTitle = document.getElementById("meme-title");
const memeImage = document.getElementById("meme-image");
const generateMemeBtn = document.getElementById("meme-button");
const loadingIndicator = document.getElementById("loading");
const memeCountDisplay = document.getElementById("meme-count");

//Start meme count from 0
let generatedMemeCount = 0;
let memeCount = 0;

let prefetchedMemes = [];
let seenMemes = [];
let newMemes = [];

// Retrieve memes from local storage and store in seen memes array, if nothing initialise new array
console.log('seen memes array', seenMemes)

// ** COMMENTED OUT FOR NOW TO TEST FUNCTIONS WITH JUST ONE SUBREDDIT ** //
//Get a random subreddit from array to get meme from
// function getRandomSubreddit() {
//   const subredditsArray = [
//     "ProgrammerHumour",
//     "programmingmemes",
//     " codingmemes",
//     "devhumormemes",
//     "programminghumor",
//   ];
//   const randomIndex = Math.floor(Math.random() * subredditsArray.length);
//   return subredditsArray[randomIndex];
// }

//Function for fetching the API
async function fetchMemeAPI(amountLeftToFetch) {
  try {
    //Display loading state
    loadingIndicator.style.display = "block";

    //Get random subreddit
    const subreddit =  "codingmemes"

    // Meme count to pass in as query
    memeCount = amountLeftToFetch

    //Fetch data from API
    const url = `https://meme-api.com/gimme/${subreddit}/${memeCount}`;
    const response = await fetch(url);
    const data = await response.json();

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

/*
1. retrieve 10 items from api and store in temporary array
2. find the ones that don't match my items from local storage
3. push new items into new memes array
4. when button is clicked, new meme is retrieved from array and displayed on DOM
5. when displayed on DOM - meme is removed from new memes array and put into seen local storage array
6. but then how do i make it retrieve the remaining to make 10
7. i guess if i store this in a function, i can recall the fetch meme api and pass in the remaining numbers left from the new memes array ? 
8. store that in count so it passes it as a query to the api, and that process will keep repeating until it reaches 10
9. and will keep refetching everytime there is less than 10 in new memes array
*/

async function prefetchData() {
  // Fetch 10 meme objects from api 
  const { memes } = await fetchMemeAPI(10);
  console.log('Meme array fetched from API:', memes);

  // Check if the meme is not in the seenMemes array (by comparing url)
  memes.forEach(meme => {
    const isSeen = seenMemes.some(seenItem => seenItem === meme.url);

    // If the meme is not in the seenMemes array, push it to the prefetchedMemes array
    if (!isSeen) {
      prefetchedMemes.push(meme);
    }
  });
  console.log(seenMemes)
  console.log('Prefetched items array:', prefetchedMemes);

  // If there are prefetched memes, return the last one
  if (prefetchedMemes.length > 0) {
    let memeToDisplay = prefetchedMemes[prefetchedMemes.length - 1];

    // Remove the last item from prefetchedMemes to not repeat display
    prefetchedMemes.pop();
    seenMemes.push(memeToDisplay)

    console.log('Meme to display:', memeToDisplay);
    return memeToDisplay;
  } 
}

//Function for updating DOM
function displayMeme(title, url) {
  //Update meme data
  memeTitle.innerText = title;
  memeImage.src = url;
  memeImage.alt = title;

  //Update & display meme count when generated
  generatedMemeCount++;
  memeCountDisplay.innerText = `Memes Generated: ${generatedMemeCount}`;
}

//Function to pass api data to display meme function
async function generateAndDisplayNewMeme() {
  const {title, url} = await prefetchData()

  // pass destructured data to display 
  displayMeme(title, url);
}

//To display meme when page is refreshed
window.addEventListener("DOMContentLoaded", generateAndDisplayNewMeme);

//Generate new meme when button is clicked
generateMemeBtn.addEventListener("click", generateAndDisplayNewMeme);
