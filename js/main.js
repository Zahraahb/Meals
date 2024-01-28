

//open side navbar

function openNav() {

    //change icon
    $('.open-close').removeClass('fa-align-justify');
    $('.open-close').addClass('fa-x')

    //show nav
    $('.left-nav').animate({ left: '0' }, 500)

    //show menue
    for (let i = 0; i < 5; i++) {
        $('.nav-menue li').eq(i).animate({ top: '0' }, (i + 5) * 100)
    }

}

//close side navbar
function closeNav() {
    $('.open-close').removeClass('fa-x');
    $('.open-close').addClass('fa-align-justify')

    //show nav
    $('.left-nav').animate({ left: '-250px' }, 500)

    //show menue
    for (let i = 4; i >= 0; i--) {
        $('.nav-menue li').eq(i).animate({ top: '250px' }, (5 - i) * 100)
    }

}


$('.open-close').click(function () {
    //open nav
    if ($('.left-nav').css('left') == '-250px') {

        openNav()
    }
    //close nav
    else {
        closeNav()
    }
})

async function searchByLetter(letter) {
    $('.inner-loading-screen').fadeIn(300)
    if (letter == '') {
        letter = 'a';
    }

    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)

    let response = await api.json()

    displayDishes(response.meals);
    $('.inner-loading-screen').fadeOut(300)


}



async function searchByName(name) {

    $('.inner-loading-screen').fadeIn(300)


    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)

    let response = await api.json()

    displayDishes(response.meals);
    $('.inner-loading-screen').fadeOut(300)



}

//show search page
$('.search').click(function () {
    closeNav()
    $('.searchdiv').removeClass('d-none')
    $('.main').addClass('d-none')
})
//sharch with name
$('.search-name').keyup(function () {
    let value = $(this).val()
    searchByName(value)

    $('.main').removeClass('d-none')

})

//searsh with letter
$('.search-l').keyup(function () {
    let value = $(this).val()
    searchByLetter(value)

    $('.main').removeClass('d-none')

})

function displayDishes(dishesArr) {
    let box = '';
    for (let i = 0; i < dishesArr.length; i++) {
        box += `
        <div class=" item col-md-3 " data-id="${dishesArr[i].idMeal}" onclick="showDetails(this)">
        <img src="${dishesArr[i].strMealThumb}" alt="">
        <div class="item-layer d-flex justify-content-center align-items-center">
            <h3>${dishesArr[i].strMeal}</h3>
        </div>
    </div>

        `
    }
    let dish = document.querySelector('.mainCont');
    dish.innerHTML = box;
}
//defult screen display
$('document').ready(() => {

    searchByName('').then(() => {
        $(".loading-screen").fadeOut(500);
        $("body").css("overflow", "visible");



    })



})



//show details on screen
function showDetails(item) {

    $('.main').addClass('d-none')
    $('.descreption').removeClass('d-none')



    let id = item.dataset.id;

    details(id);

    //close details 
    $('.descreption .fa-x').click(function () {

        $('.descreption').addClass('d-none')
        $('.main').removeClass('d-none')



    })
    if ($('.searchdiv').css('display') == 'block') {
        $(".searchdiv").addClass('d-none')
        $('.descreption .fa-x').click(function () {

            $(".searchdiv").removeClass('d-none')

        })

    }


}

//get details API
async function details(id) {
    closeNav()
    $('.inner-loading-screen').fadeIn(300)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let response = await api.json()

    displayDetails(response.meals[0])
    $('.inner-loading-screen').fadeOut(300);

    //




}


//show details API in html
function displayDetails(dish) {
    //
    let ingredints = '';
    for (let i = 1; i <= 20; i++) {
        if (dish[`strIngredient${i}`]) {
            ingredints += `<i class="alert alert-info m-2 p-1">${dish[`strMeasure${i}`]} ${dish[`strIngredient${i}`]}</i>`
        }
    }
    //
    let tags = dish.strTags?.split(",");
    if (!tags) tags = [];
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
    <i class="alert alert-danger m-2 p-1">${tags[i]}</i>`
    }


    let box = `
   <div class="col-md-4 text-center">
                <img src="${dish.strMealThumb}" alt="" class="w-100 ">
                <h3 class="mt-4">${dish.strMeal}</h3>
            </div>
            <div class="col md-8">
                <h2 class="mb-4">Instructions</h2>
                <p>
                ${dish.strInstructions}
                </p>
                <h3 class="mt-4">
                    <span>Area : </span>${dish.strArea}
                </h3>
                <h3 class="mt-4">
                    <span>Category : </span>${dish.strCategory}
                </h3>
                <h3 class="mt-4">
                    <span>Recipes : </span>
                </h3>
               <div class="ingredints">
                ${ingredints}
               
               </div>
               <h3 class="mt-4">
                    <span>Tags: </span>
                </h3>
                <div class="mt-2">
                ${tagsStr}
                <div class="mt-3">
                <a target="_blank" href="${dish.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${dish.strYoutube}" class="btn btn-danger">Youtube</a></div>
                </div>
            </div>
   `
    document.querySelector('.desc').innerHTML = box;

}

//=====Categories=======================

async function getAllCategories() {
    closeNav()

    $('.searchdiv').addClass('d-none')
    $('.main').removeClass('d-none')

    $('.inner-loading-screen').fadeIn(300)


    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)

    let response = await api.json()
    showCategories(response.categories)


    $('.inner-loading-screen').fadeOut(300)


}
function showCategories(cat) {
    let box = '';
    for (let i = 0; i < cat.length; i++) {
        box += `
        <div class="col-md-3 item" data-name="${cat[i].strCategory}" onclick="getCategoryDishes(this.dataset.name)">
            <img src="${cat[i].strCategoryThumb}" alt="">
            <div class="item-layer text-center d-flex flex-column">
                <h3 >${cat[i].strCategory}</h3>
                <p >${cat[i].strCategoryDescription.split(" ", 20).join(" ")}</p>
            </div>
        </div>

        `
    }

    let categories = document.querySelector('.mainCont');
    categories.innerHTML = box;


}
$('.category').click(function () {

    $(".searchdiv").addClass('d-none')
    $('.main').removeClass('d-none')
    getAllCategories()
})

async function getCategoryDishes(category) {
    $('.inner-loading-screen').fadeIn(300)



    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)

    let response = await api.json()
    displayCategoryDishes(response.meals)


    $('.inner-loading-screen').fadeOut(300)

}


function displayCategoryDishes(catDishes) {
    let box = '';
    for (let i = 0; i < 20; i++) {
        box += `
        <div class=" item col-md-3 " data-id="${catDishes[i].idMeal}" onclick="showDetails(this)">
        <img src="${catDishes[i].strMealThumb}" alt="">
        <div class="item-layer d-flex justify-content-center align-items-center">
            <h3>${catDishes[i].strMeal}</h3>
        </div>
    </div>

        `
    }
    let catDish = document.querySelector('.mainCont');
    catDish.innerHTML = box;



}

//=====Areas============================

async function getAreas() {
    closeNav()
    $('.inner-loading-screen').fadeIn(300)



    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)

    let response = await api.json()

    showAreas(response.meals)

    $('.inner-loading-screen').fadeOut(300)

}

function showAreas(areasArr) {
    let box = '';
    for (let i = 0; i < areasArr.length; i++) {
        box += `
        <div class="col-md-3 text-white item" data-area="${areasArr[i].strArea} " onclick="getAreaDishes(this.dataset.area)">
            <i class="fa-solid fa-house-laptop fa-4x " ></i>
            <span class="d-block h3">${areasArr[i].strArea}</span>
        </div>
        
        `
    }
    let areas = document.querySelector('.mainCont');
    areas.innerHTML = box;


}
$('.area').click(function () {

    $(".searchdiv").addClass('d-none');
    $('.main').removeClass('d-none')
    getAreas();

})

async function getAreaDishes(area) {
    $('.inner-loading-screen').fadeIn(300)



    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)

    let response = await api.json()
    displayAreaDishes(response.meals)


    $('.inner-loading-screen').fadeOut(300)

}

function displayAreaDishes(AreaDishes) {
    let box = '';
    for (let i = 0; i < AreaDishes.length; i++) {
        box += `
        <div class=" item col-md-3 " data-id="${AreaDishes[i].idMeal}" onclick="showDetails(this)">
        <img src="${AreaDishes[i].strMealThumb}" alt="">
        <div class="item-layer d-flex justify-content-center align-items-center">
            <h3>${AreaDishes[i].strMeal}</h3>
        </div>
    </div>

        `
    }
    let areaDish = document.querySelector('.mainCont');
    areaDish.innerHTML = box;


}

//=======Ingradients===============


async function getIngredients() {
    closeNav()
    $('.inner-loading-screen').fadeIn(300)



    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)

    let response = await api.json()

    showIngredients(response.meals)

    $('.inner-loading-screen').fadeOut(300)
}

function showIngredients(ingreds) {

    let box = '';
    for (let i = 0; i < 20; i++) {
        box += `
    <div class="col-md-3 text-white item " data-ing="${ingreds[i].strIngredient}" onclick="getIngredientDishes(this.dataset.ing)">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${ingreds[i].strIngredient}</h3>
            <p> ${ingreds[i].strDescription?.split(" ", 20).join(" ")}</p>
        </div>
    `
    }
    let ings = document.querySelector('.mainCont');
    ings.innerHTML = box;


}

async function getIngredientDishes(ingredient) {
    closeNav();
    $('.inner-loading-screen').fadeIn(300);



    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);

    let response = await api.json();
    displayIngredientDishes(response.meals);


    $('.inner-loading-screen').fadeOut(300);


}
function displayIngredientDishes(ingDishes) {
    let box = '';
    for (let i = 0; i < ingDishes.length; i++) {
        box += `
        <div class=" item col-md-3 " data-id="${ingDishes[i].idMeal}" onclick="showDetails(this)">
        <img src="${ingDishes[i].strMealThumb}" alt="">
        <div class="item-layer d-flex justify-content-center align-items-center">
            <h3>${ingDishes[i].strMeal}</h3>
        </div>
    </div>

        `
    }
    let ingsDish = document.querySelector('.mainCont');
    ingsDish.innerHTML = box;



}

$('.ings').click(function () {

    $(".searchdiv").addClass('d-none');
    $('.main').removeClass('d-none')
    getIngredients();
})

//==========Contact========================

function showContact() {
    let box = `
    <form action="" class="mt-5">
            <div class="container   contact">
                <div class="row">
                    <div class="col-md-6 d-grid gap-3 ">
                        <input type="text" id="nameInput" class="form-control nameInput" placeholder="Enter Your Name" onkeyup="inputsValidation()" >
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                        <input type="text" id="phoneInput"  class="form-control phoneInput" placeholder="Enter Your Phone" onkeyup="inputsValidation()" >
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                        <input type="password" id="passwordInput" class="form-control passwordInput" placeholder="Enter Your Password" onkeyup="inputsValidation()" >
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>

                    </div>
                    <div class="col-md-6 d-grid gap-3">
                        <input type="email" id="emailInput" class="form-control emailInput" placeholder="Enter Your Email" onkeyup="inputsValidation()" >
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *exemple@yyy.zzz
                        </div>
                        <input type="text" id="ageInput" class="form-control ageInput" placeholder="Enter your Age" onkeyup="inputsValidation()" >
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                        <input type="password" id="repasswordInput" class="form-control repasswordInput" placeholder="Repassword" onkeyup="inputsValidation()" >
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid repassword 
                        </div>

                    </div>

                </div>
                <button class="btn form-control mt-4 border border-danger text-danger" id="submitBtn" disabled >Submit</button>
            </div>
        </form> 

    
    
    `
    let contact = document.querySelector('.mainCont');
    contact.innerHTML = box;


}

$('.cont').click(function () {
    closeNav()
    $(".searchdiv").addClass('d-none');
    $('.main').removeClass('d-none')
    showContact()
})

function validName() {
    let nameRegx = /^[a-zA-Z ]+$/;
    let name = $('.nameInput').val();
    return (nameRegx.test(name))
}
function validEmail() {
    let emailRegx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let email = $('.emailInput').val();
    return (emailRegx.test(email))
}

function validphone() {
    let phoneRegx = /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;
    let Phone = $('.phoneInput').val();
    return (phoneRegx.test(Phone))
}
function validAge() {
    let ageRegx = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
    let age = $('.ageInput').val();
    return (ageRegx.test(age))
}

function validPassword() {
    let passwordRegx = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    let password = $('.passwordInput').val();
    return (passwordRegx.test(password));
}
function validRepass() {
    let password = document.querySelector('.passwordInput').value;
    let Repassword = $('.repasswordInput').val();
    return (Repassword == password)


}



function events() {
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })

}
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;


function inputsValidation() {
    events()
    if (nameInputTouched) {
        if (validName()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (validEmail()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (validphone()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (validAge()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (validPassword()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (validRepass()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }

    let submitBtn = $('#submitBtn')

    if (validName() &&
        validEmail() &&
        validAge() &&
        validphone() &&
        validPassword() &&
        validRepass()) {

        submitBtn.removeAttr("disabled");
    }
    else {
        submitBtn.attr("disabled", true)
    }
}





