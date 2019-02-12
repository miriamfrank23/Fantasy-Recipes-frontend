let clickCounter = {}
const worldsAPI = 'http://localhost:3000/api/v1/worlds'
const recipesAPI = 'http://localhost:3000/api/v1/recipes'
const ratingsAPI = 'http://localhost:3000/api/v1/ratings'
const ingredientsAPI = 'http://localhost:3000/api/v1/ingredients'
document.addEventListener('DOMContentLoaded', () => {

  getDataForClicks()
  getData()
  renderVideo('https://s3.us-east-2.amazonaws.com/fantasy-recipes/three.mp4')

  // $(document).ready(function(){
  //   $(".main").tiltedpage_scroll({
  //     angle: 20
  //   });
  // });

  let clicked = 'not clicked'

  document.addEventListener('click', (event) => {

    event.preventDefault()

    document.getElementById('background_video').innerHTML =  ''

    if (clicked === 'not clicked') {
      clicked = 'clicked'
      $(document).ready(function(){
        $(".main").tiltedpage_scroll({
          angle: 20
        });
      });
    }

    if (event.target.className === 'Star Wars') {
      document.getElementById('most-clicked-div').style.display = 'none'
      clickCounter[event.target.className] += 1
      let clicks = clickCounter[event.target.className]
      worldId = parseInt(event.target.id)

      fetchWorldClicks(worldId, clicks)
      trackClicks(clickCounter)

      // if (event.target.clicked === false) {
      //   event.target.clicked = true
      //   $(document).ready(function(){
      //     $(".main").tiltedpage_scroll({
      //       angle: 20
      //     });
      //   });
      // }

      newVideo()
      renderVideo('.git/sw.mp4')

      let targetDiv = document.getElementById('Star Wars')
      targetDiv.style.display = 'block'
      document.getElementById("head").style.display = 'none'
      document.getElementById("links").style.display = 'none'
      let returnButton = document.createElement('a')
      returnButton.href = ''
      returnButton.innerText = 'Return to World Selection'
      returnButton.id = "returnButton"
      returnButton.className = "returnButton"
      let renderContainer = document.getElementById('renderContainer')
      renderContainer.appendChild(returnButton)
    } // end star wars 'if'
    else if (event.target.className === 'Harry Potter') {

      document.getElementById('most-clicked-div').style.display = 'none'
      clickCounter[event.target.className] += 1
      let clicks = clickCounter[event.target.className]
      worldId = parseInt(event.target.id)

      fetchWorldClicks(worldId, clicks)

      trackClicks(clickCounter)

      // if (event.target.clicked === false) {
      //   event.target.clicked = true
      //   $(document).ready(function(){
      //     $(".main").tiltedpage_scroll({
      //       angle: 20
      //     });
      //   });
      // }

      newVideo()
      renderVideo('.git/hp.mp4')

      let targetDiv = document.getElementById('Harry Potter')
      targetDiv.style.display = 'block'
      document.getElementById("head").style.display = 'none'
      document.getElementById("links").style.display = 'none'
      let returnButton = document.createElement('a')
      returnButton.href = ''
      returnButton.innerText = 'Return to World Selection'
      returnButton.id = "returnButton"
      returnButton.className = "returnButton"
      let renderContainer = document.getElementById('renderContainer')
      renderContainer.appendChild(returnButton)
    } // end hp 'else if'
    else if (event.target.className === 'The Lord of the Rings') {

      document.getElementById('most-clicked-div').style.display = 'none'
      clickCounter[event.target.className] += 1
      let clicks = clickCounter[event.target.className]
      worldId = parseInt(event.target.id)

      fetchWorldClicks(worldId, clicks)
      trackClicks(clickCounter)

      // if (event.target.clicked === false) {
      //   event.target.clicked = true
      //   $(document).ready(function(){
      //     $(".main").tiltedpage_scroll({
      //       angle: 20
      //     });
      //   });
      // }

      newVideo()
      renderVideo('.git/lotr.mp4')

      let targetDiv = document.getElementById('The Lord of the Rings')
      targetDiv.style.display = 'block'
      document.getElementById("head").style.display = 'none'
      document.getElementById("links").style.display = 'none'
      let returnButton = document.createElement('a')
      returnButton.href = ''
      returnButton.innerText = 'Return to World Selection'
      returnButton.id = "returnButton"
      returnButton.className = "returnButton"
      let renderContainer = document.getElementById('renderContainer')
      renderContainer.appendChild(returnButton)
    } // end lotr 'else if'
    else if (event.target.innerText === 'RETURN TO WORLD SELECTION') {

      document.getElementById('most-clicked-div').style.display = 'block'

      newVideo()
      renderVideo('.git/three.mp4')

      document.getElementById("head").style.display = 'block'
      document.getElementById("links").style.display = 'block'
      let htmlCollection = document.getElementsByClassName('recipesContainer')
      let recipesContainer = Array.from(htmlCollection)
      recipesContainer.map(recipe => {
        recipe.style.display = 'none'
      })
      event.target.remove()
    } // end return to selection 'else if'
    else if (event.target.innerText === 'LIKE') {

      let ratingField = event.target.previousSibling

      fetch(ratingsAPI, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: true,
          recipe_id: event.target.id,
        })
      })  // post likes fetch end
      .then(result => result.json())
      .then(rating => {
        fetchRatings(rating)
      })
    } // end like 'else if'
    else if (event.target.innerText === 'DISLIKE') {

      let ratingField = event.target.previousSibling.previousSibling

      fetch(ratingsAPI, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: false,
          recipe_id: event.target.id,
        })
      }) // post dislikes fetch end
      .then(result => result.json())
      .then(rating => {
        fetchRatings(rating)
      })
    } // end dislike 'else if'
  }) // click event listener end
}) // dom content loaded event listener end
// fetch all data from worlds api
function getData() {
  fetch(worldsAPI)
  .then(results => results.json())
  .then(results =>
    results.map(result => createWorlds(result))
  )
} // getData end

function fetchRatings(rating) {
  fetch(ratingsAPI)
  .then(result => {
    return result.json()
  })
  .then(resultJSON => {
    matchingRatings = resultJSON.filter(eachRating => {
      return eachRating.recipe_id == rating.recipe_id
    }) // filter end
    return calculateLikePercentage(matchingRatings, rating)
  })
} // fetchRatings end

function calculateLikePercentage(matchingRatings, rating) {
  let upvote = matchingRatings.filter(eachRating => {
    return eachRating.score === true
  })
  let upvotePercentage = `${Math.ceil((upvote.length / matchingRatings.length) * 100)}% liked`
  let allPTags = document.querySelectorAll('p')
  let allPTagsArray = Array.from(allPTags)
  let pTag = allPTagsArray.find(ptag => {
    return ptag.id == rating.recipe_id
  })
  pTag.innerText = upvotePercentage
} // calculateLikePercentage end

function getDataForClicks() {
  fetch(worldsAPI)
  .then(results => results.json())
  .then(results => {
    results.map(world => {
      trackClicks(world)
    })
  })
} // getDataForClicks end

function trackClicks(world) {
  clickCounter[world.name] = world.clicks
  calculateMaximum(clickCounter)
} // trackClicks end

function calculateMaximum(clickCounter) {
  let maximum = 0
  maxName = ''
  for (let world in clickCounter) {
    if (clickCounter[world] > maximum) {
      maximum = clickCounter[world]
      maxName = world
    }
  }
  appendMaxiworld(maxName)
} // calculateMaxinum end

function appendMaxiworld(maxName) {
  let mostClickedDiv = document.getElementById('most-clicked-div')
  mostClickedDiv.innerText = `${maxName} has been chosen the most often so far!`
} // appendMaxiworld end

function fetchWorldClicks(id, clicks) {
  console.log(clickCounter);
  fetch(`${worldsAPI}/${id}`, {
    method: 'PATCH',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      'clicks': clicks,
    })
  })
  .then(result => result.json())
  .then(console.log)
} // fetchWorldClicks end

function createWorlds(world) {
  // world selection
  let globalContainer = document.getElementsByClassName('main_container')
  let worldContainer = document.getElementById('links')
  // let worldContainer = document.createElement('div')
  // worldContainer.id = 'links'
  // globalContainer.appendChild(worldContainer)
  let worldButton = document.createElement('a')
  worldButton.href = ''
  worldButton.innerText = world.name
  worldButton.image = world.image
  worldButton.className = world.name
  worldButton.clicked = false
  worldContainer.appendChild(worldButton)
  // world render
  let renderContainer = document.getElementById('renderContainer')
  let worldRecipesContainer = document.createElement('div')
  worldRecipesContainer.id = world.name
  worldRecipesContainer.className = 'recipesContainer'
  worldRecipesContainer.style.display = 'none'
  worldButton.id = world.id
  let worldHeader = document.createElement('img')
  worldHeader.className = 'logo'
  worldHeader.src = world.image
  // render recipes
  let recipesDiv = document.createElement('div')
  recipesDiv.className = 'main'
  let recipes = world.recipes
  recipes.forEach(recipe => {
    let recipeHeader = document.createElement('p')
    recipeHeader.innerText = recipe.name
    // let recipeImage = document.createElement('img')
    // recipeImage.src = recipe.image
    // render ratings
    let ratings = recipe.ratings
    let positiveRatings = ratings.filter(rating => rating.score === true)
    let percentRating = `${Math.ceil((positiveRatings.length / ratings.length) * 100)}% of people liked this recipe`
    if (ratings.length === 0){
      percentRating = 'Be the first to rate this recipe!'
    }
    let ratingP = document.createElement('p')
    ratingP.innerText = percentRating
    ratingP.id = recipe.id
    let upVote = document.createElement('a')
    upVote.href = ''
    upVote.id = recipe.id
    upVote.innerText = "Like"
    let downVote = document.createElement('a')
    downVote.href = ''
    downVote.id = recipe.id
    downVote.innerText = "Dislike"
    // render ingredients
    let ingredientsUl = document.createElement('div')
    let ingredients = recipe.ingredients
    ingredients.forEach(ingredient => {
      let ingredientsLi = document.createElement('p')
      ingredientsLi.innerText = `${ingredient.quantity}`
      ingredientsLi.className = 'ingredients'
      ingredientsUl.className = 'ingredientsContainer'
      ingredientsUl.appendChild(ingredientsLi)
    })
    let recipeInstructions = document.createElement('p')
    recipeInstructions.innerText = recipe.instructions
    //create recipes div
    let recipeSection = document.createElement('section')
    // recipeSection.className = `page${recipe.id}`
    recipeSection.className = `page${recipe.id}`
    // recipeSection.style.backgroundImage = `url(${recipe.image})`
    let recipeDiv = document.createElement('div')
    recipeDiv.className = 'page_container'
    recipeDiv.style.backgroundImage = `url(${recipe.image})`
    // recipeDiv.style = 'transform: rotateX(0deg) scale(1, 1); opacity: 1;'

    recipeHeader.className = 'recipeHeader'
    recipeDiv.appendChild(recipeHeader)
    ratingP.className = 'rating'
    recipeDiv.appendChild(ratingP)
    upVote.className = 'ratingButton'
    let ratingButtonDiv = document.createElement('div')
    // ratingButtonDiv.id = 'links'
    ratingButtonDiv.appendChild(upVote)
    downVote.className = 'ratingButton'
    ratingButtonDiv.appendChild(downVote)
    recipeDiv.appendChild(ratingButtonDiv)
    recipeDiv.appendChild(ingredientsUl)
    recipeInstructions.className = 'instructions'
    recipeDiv.appendChild(recipeInstructions)
    recipeSection.appendChild(recipeDiv)
    recipesDiv.appendChild(recipeSection)
    // debugger
  })
  worldRecipesContainer.appendChild(worldHeader)
  worldRecipesContainer.appendChild(recipesDiv)
  renderContainer.appendChild(worldRecipesContainer)
} // create worlds end

$(".main").tiltedpage_scroll({
    sectionContainer: "> section",     // In case you don't want to use <section> tag, you can define your won CSS selector here
    angle: 50,                         // You can define the angle of the tilted section here. Change this to false if you want to disable the tilted effect. The default value is 50 degrees.
    opacity: false,                     // You can toggle the opacity effect with this option. The default value is true
    scale: false,                       // You can toggle the scaling effect here as well. The default value is true.
    outAnimation: false                 // In case you do not want the out animation, you can toggle this to false. The defaul value is true.
  });

function newVideo() {
  document.getElementById('background_video').remove()
  let newVideo = document.createElement('video')
  newVideo.id = 'background_video'
  newVideo.loop = true;
  newVideo.mute = true;
  let mainContainer = document.getElementById('main_container')
  mainContainer.appendChild(newVideo)
  // newVideo.loop
}

function renderVideo(targetUrl) {
  var bv = new Bideo();
  bv.init({
    videoEl: document.querySelector('#background_video'),
    container: document.querySelector('body'),
    resize: true,

    src: [
      {
        src: targetUrl,
      },
    ],
  });
};
