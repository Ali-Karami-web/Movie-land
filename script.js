
let result = document.querySelector("#result");
let searchbox = document.querySelector(".search-box");
let showprofilemovie = document.querySelector("#showprofilemovie");

let genreselect = document.querySelector("#genreselect");
let nextandprev = document.querySelector("#nextandprev");
//
let listfavorite = JSON.parse(localStorage.getItem("listfavorite")) || [];
function savefavoritemovie() {
    localStorage.setItem("listfavorite", JSON.stringify(listfavorite));
}
//
currentPage = 1;
//
let API_KEY = "8fedd29612b8047b9ae6aecd89ab0062";
//
function backtohome(){
    searchbox.innerHTML = `<button id="backhome">برگشت</button>`
    let backhome = document.querySelector("#backhome")
    backhome.addEventListener("click",function(){
    result.innerHTML = "";
    showprofilemovie.innerHTML = "";
    getmovies();

})
}
function showhome(){
    searchbox.innerHTML = `
    <h1>movie App</h1>
    <input id="searchinput" type="text" placeholder="نام فیلم را وارد کنید">
    <button id="searchbtn">جستجو</button>
    <button id="showfavoritemovie">علاقه مندی ها</button>
    `
    let searchinput = document.querySelector("#searchinput");
    let searchbtn = document.querySelector("#searchbtn");
    let showfavoritemovie = document.querySelector("#showfavoritemovie");
    //
    searchbtn.addEventListener("click",function(){
    let search = searchinput.value.trim();
    if(search === ""){
        alert("لطفا اسم فیلم را وارد کنید")
        return;
    }

    backtohome();
    searchmovie(search);
})

showfavoritemovie.addEventListener("click",function(){
    result.innerHTML = "";
    searchbox.innerHTML = "";
    nextandprev.innerHTML = "";
    listfavorite.forEach(function(movie){
        let shortoverview = movie.overview.slice(0,100) +"...";
        result.innerHTML +=`
        <div class="movie-card" data-id=${movie.id}>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
        <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${shortoverview}</p>
        <button class="playmovie" id="deletfavoritemovie">حذف</button>
        </div>
        </div>
        `
        let deletfavoritemovie = document.querySelectorAll("#deletfavoritemovie")
        deletfavoritemovie.forEach(function(deletmovie){
            deletmovie.addEventListener("click",function(event){
                event.stopPropagation();
                listfavorite = listfavorite.filter(function(item){
                    return item.id !== movie.id;
                });
                savefavoritemovie();
                showfavoritemovie.click();
                alert("فیلم از مورد علاقه ها حذف شد")
            })
        })
        
        let moviecard = document.querySelectorAll(".movie-card");
        moviecard.forEach(function(showprofile){

            showprofile.addEventListener("click",function(){
                result.innerHTML = "";

                let movieID = showprofile.dataset.id;
                getmovieid(movieID)
            })
        })

    })
    backtohome();
})
}
async function getmovies() {
    result.innerHTML = `
    <h2>درحال دریافت فیلم...</h2>
    `;
    try{
    let respone = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`);
    let data = await respone.json();
    result.innerHTML = "";
    data.results.forEach(movie => {
        let shortoverview = movie.overview.slice(0,100) +"...";
        result.innerHTML += `
        <div class="movie-card" data-id=${movie.id}>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
        <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${shortoverview}</p>
        </div>
        </div>
        `
        nextandprev.innerHTML = `
        <button id="nextpage">صفحه ی بعدی</button>
        <span id="showpage">Page ${currentPage}</span>
        <button id="prevbtn">صفحه ی قبل</button>
        `;
        let nextpage = document.querySelector("#nextpage");
        let showpage = document.querySelector("#showpage");
        let prevbtn = document.querySelector("#prevbtn");
        nextpage.addEventListener("click",function(){
    currentPage++;
    showpage.textContent = `Page ${currentPage}`
    getmovies();
})
prevbtn.addEventListener("click",function(){
    if (currentPage > 1){
        currentPage--;
        showpage.textContent = `Page ${currentPage}`
        getmovies();
    }
})
        let moviecard = document.querySelectorAll(".movie-card");
        moviecard.forEach(function(showprofile){

            showprofile.addEventListener("click",function(){
                result.innerHTML = "";
                let movieID = showprofile.dataset.id;
                getmovieid(movieID)
            })
        })

    });
    showhome();
}catch(Error){
    result.innerHTML = `
    <h2>خطا در دریافت فیلم</h2>
    `;
}
}
async function getmovieid(movieid) {
    let respone = await fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=${API_KEY}`);
    let data = await respone.json();
    nextandprev.innerHTML = "";
    showprofilemovie.innerHTML = `
        <div class="details">
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}">
        <div class="movie-info">
        <h1>Name: ${data.title}</h1>
        <p>Overview: ${data.overview}</p>
        <p>Vote-average: ${data.vote_average}</p>
        <p>Genres: ${data.genres.map(function(genre){
            return genre.name;
        }).join(" , ")}</p>
        <div>
        <button class="playmovie">پخش فیلم</button>
        <button class="playmovie" id="favoritebtn">افزودن به علاقه مندی</button>
        </div>
        </div>
        </div>
    `
    let favoritebtn = document.querySelector("#favoritebtn");
    favoritebtn.addEventListener("click",function(){
        let exists = listfavorite.some(function(movie){
            return movie.id === data.id;
        });
        
        if(exists){
            alert("این فیلم قبلا به علاقه مندی ها اضافه شد")
            return;
        }
        listfavorite.push(data);
        savefavoritemovie();
        alert("فیلم به علاقه مندی ها اضافه شد");
    })
    backtohome();
}
async function searchmovie(search) {
    result.innerHTML = `
    <h2>در حال جستجو...</h2>
    `;
    try{
    let respone = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}`);
    let data = await respone.json();
    if(data.results.length === 0){
        result.innerHTML = `<h2>فیلمی یافت نشد</h2>`
        return;
    }
    result.innerHTML ="";
    nextandprev.innerHTML = "";
    data.results.forEach(function(movie){
        let shortoverview = movie.overview.slice(0,100) +"...";
        result.innerHTML +=
        `
        <div class="movie-card" data-id=${movie.id}>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
        <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${shortoverview}</p>
        </div>
        </div>
        `
        let moviecard = document.querySelectorAll(".movie-card");
        moviecard.forEach(function(showprofile){

            showprofile.addEventListener("click",function(){
                result.innerHTML = "";
                let movieID = showprofile.dataset.id;
                getmovieid(movieID)
            })
        })
    })
}catch(Error){
    result.innerHTML = `
    <h2>خطا در جستجو</h2>
    `;
}
    }



async function getgenreselect() {
    let respone = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
    let data = await respone.json();
    data.genres.forEach(function(genre){
        genreselect.innerHTML += `
        <option value="${genre.id}">${genre.name}</option>
        `
    })

}
genreselect.addEventListener("change",function(){
    let genreid = genreselect.value;
    if (genreid === ""){
        getmovies();
        return;
    }
    getmoviebygenre(genreid)
    async function getmoviebygenre(genreid) {
            result.innerHTML = `
    <h2>درحال دریافت فیلم...</h2>
    `;
        try{
    let respone = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreid}`)
    let data = await respone.json();

    result.innerHTML = "";
    nextandprev.innerHTML = "";
    data.results.forEach(function(movie){
        let shortoverview = movie.overview.slice(0,100) +"...";
        result.innerHTML += `
        <div class="movie-card" data-id=${movie.id}>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
        <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${shortoverview}</p>
        </div>
        </div>
        `
        let moviecard = document.querySelectorAll(".movie-card");
        moviecard.forEach(function(showprofile){

            showprofile.addEventListener("click",function(){
                result.innerHTML = "";
                let movieID = showprofile.dataset.id;
                getmovieid(movieID)
            })
        })
    })
        }catch(Error){
                result.innerHTML = `
    <h2>خطا در دریافت فیلم</h2>
    `;
        }
}
    
})


getgenreselect()
searchmovie();
getmovies();