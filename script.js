const memeTitle = document.getElementById("meme-title");
const memeImage = document.getElementById("meme-image");
const generateMemeBtn = document.getElementById("meme-button");

//Function for fetching the API
async function fetchMemeAPI() {
    try {
        const subreddit = 'ProgrammerHumor'
        const url = `https://meme-api.com/gimme/${subreddit}`;
        const response = await fetch(url);
        const data = await response.json();
        return data
    }

    catch (error) {
        console.error(`ERROR: ${error.message}`);
        return null;
    }
}
//Function for updating DOM

function displayMeme(memeData){
    memeTitle.innerText = memeData.title;
    memeImage.src = memeData.url;
    memeImage.alt = memeData.title;

    console.log(memeData)
}

//Function to pass api data to display meme function
async function generateAndDisplayNewMeme() {
    const memeData = await fetchMemeAPI();
    displayMeme(memeData);
}

window.addEventListener("DOMContentLoaded", generateAndDisplayNewMeme)
generateMemeBtn.addEventListener("click", generateAndDisplayNewMeme);