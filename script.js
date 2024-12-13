//Initialise variables from HTML
const memeTitle = document.getElementById("meme-title");
const memeImage = document.getElementById("meme-image");
const generateMemeBtn = document.getElementById("meme-button");
const loadingIndicator = document.getElementById("loading")
const memeCountDisplay = document.getElementById("meme-count")

//Start meme count from 0
let memeCount = 0

//Get a random subreddit from array to get meme from
function getRandomSubreddit() {
    const subredditsArray = [
    'ProgrammerHumour',
    'programmingmemes',
    ' codingmemes',
    'devhumormemes',
    'programminghumor'
    ];

    const randomIndex = Math.floor(Math.random () * subredditsArray.length);

    return subredditsArray[randomIndex];
}


//Function for fetching the API
async function fetchMemeAPI() {
    try {

        //Display loading state
        loadingIndicator.style.display = 'block'

        //Get random subreddit
        const subreddit = getRandomSubreddit()
        
        //Fetch data from API
        const url = `https://meme-api.com/gimme/${subreddit}`;
        const response = await fetch(url);
        const data = await response.json();

        // Filtering out nsfw memes
        if(data.nsfw){
            console.log("nsfw found")
            fetchMemeAPI()
            return
        }

        return data
    }

    catch (error) {

        //Handing error cases
        console.error(`ERROR: ${error.message}`);
        memeTitle.innerText = "Something went wrong, cannot retrieve meme"
        memeImage.src = ""
        memeImage.alt = "Error loading meme"
    }

    finally {
        // After loaded, loading indicator will disappear 
        loadingIndicator.style.display = "none"
    }
}

//Function for updating DOM
function displayMeme(memeData){

    //Update meme data
    memeTitle.innerText = memeData.title;
    memeImage.src = memeData.url;
    memeImage.alt = memeData.title;

    //Update & display meme count when generated
    memeCount++
    memeCountDisplay.innerText = `Memes Generated: ${memeCount}`
}

//Function to pass api data to display meme function
async function generateAndDisplayNewMeme() {
    const memeData = await fetchMemeAPI();
    displayMeme(memeData);
}

//To display meme when page is refreshed
window.addEventListener("DOMContentLoaded", generateAndDisplayNewMeme)

//Generate new meme when button is clicked
generateMemeBtn.addEventListener("click", generateAndDisplayNewMeme);