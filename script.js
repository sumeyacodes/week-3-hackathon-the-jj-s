//we need an async 08 function for fetching the API
async function fetchMemeApi() {
    const url = "https://meme-api.com/gimme";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    document.getElementById("meme-title").innerText = data.title;
    document.getElementById("meme-image").src = data.url;
    document.getElementById("meme-image").alt = data.title;
    
    //return data;
}
document.getElementById("meme-button").addEventListener("click", fetchMemeApi);
//fetchMemeApi();
//make a function for displaying the meme

//function for random generator button.
//add an eventListener for the image. 
//add an eventListener for the button.
