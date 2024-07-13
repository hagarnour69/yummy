let Categories = document.querySelector("#Categories");
let Areas = document.querySelector("#Area");
let Ingrediants = document.querySelector("#Ingredients");
let contacts = document.querySelector("#Contact");
let Search = document.querySelector("#search");
GetMealsBySearch(" ");

//^======scrolling between sections=====//
function scrollHandle() {
  document.querySelector("#home .meals-row").innerHTML = " ";
  document.querySelector("#Details").classList.add("d-none");
  document.querySelector("#home").classList.remove("d-none");
  document.querySelector("#ContactUs").classList.add("d-none");
  document.querySelector(".search-inputs").classList.add("d-none");
}
//^======nav-button action=====^//
$(`#open_close`).on("click", function () {
  if ($(".side-nav").css("left") == `0px`) {
    closeNav();
  } else {
    openNav();
  }
});
//^=====nav open function====//
function openNav() {
  let linksList = document.querySelectorAll(".nav-links li");
  $(".side-nav ").animate({ left: `0px` }, 1000);
  $(`#open_close`).removeClass("fa-align-justify");
  $(`#open_close`).addClass(" fa-xmark");
  for (let i = 0; i < linksList.length; i++) {
    $(".nav-links li")
      .eq(i)
      .animate({ top: `0px` }, (i + 8) * 100);
  }
}
//^=====nav close function====//
function closeNav() {
  let NavWidth = $(".NavMovingPart").innerWidth();
  let NavLinkHeight = $(".nav-links").innerHeight();
  $(".side-nav ").animate({ left: `-${NavWidth}px` }, 1000);
  $(`#open_close`).removeClass("fa-xmark");
  $(`#open_close`).addClass("fa-align-justify");
  $(".nav-links li").animate({ top: `${NavLinkHeight}px` }, 1000);
}
$(document).ready(() => {
  GetMealsBySearch("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
    $(".inner-loading-screen").fadeOut(300);
  });
});
//!====fetch data from search api==^//
async function GetMealsBySearch(MealName) {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${MealName}`
  );
  response = await response.json();
  console.log(response.meals);
  DisplaySearchMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}
//&====display data from search api==&//
function DisplaySearchMeals(arr) {
  closeNav();
  let MealsBlackBox = [];
  for (let i = 0; i < arr.length; i++) {
    MealsBlackBox += `
    <div class=" col-md-3">
           <div class="meal card-hover position-relative overflow-hidden rounded-3" data-MealId="${arr[i].idMeal}">
            <img src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}" class="w-100 img-fluid ">
            <div class="meals-overlay position-absolute  w-100 h-100  d-flex align-items-center text-black bg-white bg-opacity-75 top-100">
              <h3>${arr[i].strMeal}</h3>
            </div>
           </div>
          </div>
    `;
  }
  document.querySelector(".meals-row").innerHTML = MealsBlackBox;
  ClickMeal();
}
//!===fetch categories=====^/
async function GetMealsCategories() {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  console.log(response.categories);
  DisplayCategories(response.categories);
  $(".inner-loading-screen").fadeOut(300);
}
//&====Display Categories====&//
function DisplayCategories(arr) {
  let CategoriesBlackBox = [];
  for (let i = 0; i < arr.length; i++) {
    CategoriesBlackBox += `
    <div class="col-md-3 ">
           <div class=" category card-hover position-relative overflow-hidden rounded-3 " data-category=${arr[i].strCategory}>
            <img src="${arr[i].strCategoryThumb}" alt="${arr[i].strCategory}" class="w-100 img-fluid ">
            <div class="meals-overlay position-absolute  w-100 h-100  text-center text-black bg-white bg-opacity-75 top-100">
              <h3>${arr[i].strCategory}</h3>
              <p>${arr[0].strCategoryDescription}</p>
            </div>
           </div>
          </div>
    `;
  }
  document.querySelector(".meals-row").innerHTML = CategoriesBlackBox;
  ClickCategory();
}

//^===Onclick category====^//
Categories.addEventListener("click", () => {
  scrollHandle();
  closeNav();
  GetMealsCategories();
});

//^===onclick category card===^//
function ClickCategory() {
  document.querySelectorAll(".category").forEach((card) => {
    card.addEventListener("click", () => {
      let categoryName = card.getAttribute("data-category");
      console.log(categoryName);
      GetMealsByCategories(categoryName);
      ClickMeal();
    });
  });
}
//!=====fetch meals by category name===^//
async function GetMealsByCategories(category) {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();
  console.log(response.meals);
  DisplayMealsByCategories(response.meals);
  $(".inner-loading-screen").fadeOut(300);
}
//&=========DisplayMealsByCategories===&//
function DisplayMealsByCategories(arr) {
  let MealsBlackBox = [];
  for (let i = 0; i < arr.length; i++) {
    MealsBlackBox += `
    <div class=" col-md-3">
           <div class="meal card-hover position-relative overflow-hidden rounded-3 " data-MealId="${arr[i].idMeal}" >
            <img src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}" class="w-100 img-fluid ">
            <div class="meals-overlay position-absolute  w-100 h-100  d-flex align-items-center text-black bg-white bg-opacity-75 top-100">
              <h3>${arr[i].strMeal}</h3>
            </div>
           </div>
          </div>
    `;
  }
  document.querySelector(".meals-row").innerHTML = MealsBlackBox;
  ClickMeal();
}
//^===onclick meal card===^//
function ClickMeal() {

  document.querySelectorAll(".meal").forEach((card) => {
    card.addEventListener("click", () => {
      let MealId = card.getAttribute("data-MealId");
      // console.log(MealId) ;
      GetRecipesById(MealId);
    });
  });
}
//!=====fetchRecipesById====^//
async function GetRecipesById(id) {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  response = await response.json();
  console.log(response.meals[0]);
  DisplayRecipiesById(response.meals[0]);
  $(".inner-loading-screen").fadeOut(300);
}
//&=====DisplayRecipesById====//
function DisplayRecipiesById(RecipeItem) {
  document.querySelector("#Details").classList.remove("d-none");
  document.querySelector("#home").classList.add("d-none");
  closeNav()
  let ingredients = ` `;

  for (let i = 1; i <= 20; i++) {
    if (RecipeItem[`strIngredient${i}`]) {
      ingredients += `<span class="alert alert-info m-2 p-1">${
        RecipeItem[`strMeasure${i}`]
      } ${RecipeItem[`strIngredient${i}`]}</span>`;
    }
  }

  let tags = RecipeItem.strTags?.split(",");
  if (tags == null) {
    tags = [];
  }

  let tagsBlackBox = "";
  for (let i = 0; i < tags.length; i++) {
    tagsBlackBox += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  let DetalisBlackBox = `
    <div class="col-md-4   ">
                <img class="w-100 rounded-3 img-fluid mb-3 " src="${RecipeItem.strMealThumb}"
                    alt="">
                    <h2>${RecipeItem.strMeal}</h2>
            </div>
            <div class="col-md-8 ">
                <h2>Instructions</h2>
                <p>${RecipeItem.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${RecipeItem.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${RecipeItem.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <div class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsBlackBox}
                </div>

                <a target="_blank" href="${RecipeItem.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${RecipeItem.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  document.querySelector("#Details .container .details-row").innerHTML = DetalisBlackBox;
}
//^======click on area====^//
Areas.addEventListener("click", () => {
  scrollHandle();

  closeNav();
  GetAreas();
});
//!=====fetch area======^
async function GetAreas() {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  console.log(response.meals);
  DisplayAreas(response.meals);
  $(".inner-loading-screen").fadeOut(300);
}
//&===Display Areas===//
function DisplayAreas(area) {
  let areaBlackBox = [];
  for (let i = 0; i < area.length; i++) {
    areaBlackBox += `<div class="col-md-3 " >
            <div class="area text-center text-white" data-area=${area[i].strArea}>
            <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
            </div>
            </div>`;
  }
  document.querySelector(".meals-row").innerHTML = areaBlackBox;
  AreasOnclick();
}
//^====areasonclick====^
function AreasOnclick() {
  document.querySelectorAll(".area").forEach((area) => {
    area.addEventListener("click", () => {
      let areaName = area.getAttribute("data-area");
      console.log(areaName);
      GetMealsByArea(areaName);
    });
  });
}
//!===fetch meals by areaname===^/
async function GetMealsByArea(area) {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  console.log(response.meals);
  DisplaySearchMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}
//^===click on Ingrediants===^//
Ingrediants.addEventListener("click", () => {
  scrollHandle();

  closeNav();
  GetIngrediants();
});
//!==== fetch ingrediants===^//
async function GetIngrediants(area) {
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  console.log(response.meals);
  DisplayIngrediants(response.meals);
  $(".inner-loading-screen").fadeOut(300);
}
//&===Display Ingrediants===//
function DisplayIngrediants(ingrediants) {
  let IngrediantsBlackBox = ``;
  for (let i = 0; i < ingrediants.length; i++) {
    if (ingrediants[i].strDescription != null) {
      IngrediantsBlackBox += `<div class="col-md-3 p-3 " >
        <div class="ingrediants text-center text-white" data-ingrediants=${ingrediants[i].strIngredient}>
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
      <h3>${ingrediants[i].strIngredient}</h3>
      <small>${ingrediants[i].strDescription
        .split(" ")
        .slice(0, 20)
        .join(" ")}</small>
        </div>
        </div>`;
    } else {
      IngrediantsBlackBox += 
      `<div class="col-md-3 p-3" >
            <div class="ingrediants text-center text-white" data-ingrediants=${ingrediants[i].strIngredient}>
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingrediants[i].strIngredient}</h3>
                        <p>${ingrediants[i].strDescription}</p>
            </div>
        </div>`;
    }
  }
  document.querySelector(".meals-row").innerHTML = IngrediantsBlackBox;
  IngrediantssOnclick();
}
function IngrediantssOnclick() {
  document.querySelectorAll(".ingrediants").forEach((ingrediants) => {
    ingrediants.addEventListener("click", () => {
      let strIngredientName = ingrediants.getAttribute("data-ingrediants");
      console.log(strIngredientName);
      GetMealsByIngrediants(strIngredientName);
    });
  });
}
//!===fetch meals by ingrediants===^/
async function GetMealsByIngrediants(ingrediant) {
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`
  );
  response = await response.json();
  console.log(response.meals);
  DisplaySearchMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}
//^====contact us=====^//
contacts.addEventListener("click", () => {
  closeNav();
  document.querySelector(".meals-row").innerHTML = " ";
  document.querySelector("#home .row ").classList.add("d-none");
  document.querySelector("#Details").classList.add("d-none");
  document.querySelector("#ContactUs").classList.remove("d-none");
});
//^==contact us validation====^/
function validation(input) {
  var regex = {
    Name:/^[a-zA-Z ]+$/,
    Age: /^\S[0-9]{0,3}$/,
    Email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/,
    Telephone: /^(\+2)[0-2,3]{1}[0-9]{9}$/,
    Password:
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    repassword:
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  };
  if (regex[input.id].test(input.value)) {
    document.querySelector(`.${input.id}`).classList.add("d-none");
    return true;
  } else {
    document.querySelector(`.${input.id}`).classList.remove("d-none");
    return false;
  }
}
//^==contact us validation loop==^/
document.querySelectorAll("#ContactUs input").forEach(
  function validationloop(inputItem) {
    inputItem.addEventListener("keyup", () => {
      validation(inputItem);
      if (
        document.querySelector("#repassword").value &&
        document.querySelector("#Password").value
      ) {
        if (
          validation(inputItem) &&
          document.querySelector("#repassword").value ==
            document.querySelector("#Password").value
        ) {
          document.querySelector("#submitBtn").classList.remove("disabled");
        }
      }
    });
  });

//^=====click on search========^//

Search.addEventListener("click", () => {
  closeNav();
  document.querySelector("#home").classList.remove("d-none");
  document.querySelector(".search-inputs").classList.remove("d-none");
  document.querySelector("#Details").classList.add("d-none");
  document.querySelector("#ContactUs").classList.add("d-none");
  document.querySelector(".meals-row").innerHTML = " ";
  AddEventsToSearchIn();
});

function AddEventsToSearchIn() {
  document.querySelector(".SearchByLetter").addEventListener("keyup", () => {
    if (document.querySelector(".SearchByLetter").value) {
      GetMealsByLetter(document.querySelector(".SearchByLetter").value);
    }
  });
  document.querySelector(".SearchByName").addEventListener("keyup", () => {
    if (document.querySelector(".SearchByName").value) {
      GetMealsBySearch(document.querySelector(".SearchByName").value);
    } else {
      GetMealsBySearch([]);
    }
  });
}
//!======fetch meal by letter====!//
async function GetMealsByLetter(letter) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();
  if (response.meals == null) {
    DisplaySearchMeals([]);
  } else {
    DisplaySearchMeals(response.meals.slice(0, 20));
  }
}
