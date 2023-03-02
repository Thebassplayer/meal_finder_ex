const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal'),
  apiMainSearchURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=',
  apiRandomSearchURL = 'https://www.themealdb.com/api/json/v1/1/random.php',
  apiIDSearchURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=',
  searchValue = search.value;

// Prevent default submit
const preventSubmitDefault = function (e) {
  e.preventDefault();
};

//! Fetch data
const fetchData = function (url, value = '') {
  fetch(`${url}${value}`)
    .then((res) => res.json())
    .then((d) => d);
};

//! Search meal and fetch from API
function searchMeal(e) {
  preventSubmitDefault(e);

  //Clear single meal
  single_mealEl.innerHTML = '';

  // Check for empty control
  if (searchValue.trim()) {
    fetchData(apiMainSearchURL, searchValue);

    resultHeading.innerHTML = `<h2>Search results for ${searchValue}:</h2>`;

    if (data.meals === null) {
      resultHeading.innerHTML = `<h2>There are not search results. Try again!<h2>`;
    } else {
      mealsEl.innerHTML = data.meals
        .map(
          (meal) =>
            `<div class="meal">
            <img src="${meal.strMealThumb}" alt="meal.strMeal" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}<h3/>
            </div>
            </div>`
        )
        .join('');
    }

    // Clear search text
    search.value = '';
  } else {
    resultHeading.innerHTML = `<h3>Please, insert a valid meal<h3>`;
  }
}

//  Fetch meal by ID
function getMealById(mealID) {
  fetchData(apiIDSearchURL, mealID);
  const meal = data.meals[0];
  addMealToDOM(meal);
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetchData(apiRandomSearchURL);
  const meal = data.meals[0];
  addMealToDOM(meal);
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  console.log(meal.strMeal);

  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="mail">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
        <ul>
         ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
    </div>
  </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});

// //! Fetch data (With async)
// const fetchData = async function (url, value = '') {
//   const res = await fetch(`${url}${value}`);
//   const data = await res.json();
//   console.log('Console 1 :', data);
//   return data;
// };

// //! Fetch data (With AXIOS)
// const fetchData = async function (url, value = '') {
//   const res = await axios.get(`${url}${value}`);
//   const data = res.data;
//   console.log('Console 1 :', data);
//   return data;
// };
