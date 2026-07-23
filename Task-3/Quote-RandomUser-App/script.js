// ===========================================
// Quote Generator + Random User
// Part 1
// ===========================================

// DOM Elements

const quote = document.getElementById("quote");
const author = document.getElementById("author");

const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const tweetBtn = document.getElementById("tweetBtn");
const favoriteQuoteBtn = document.getElementById("favoriteQuoteBtn");

const profileImage = document.getElementById("profileImage");
const userName = document.getElementById("userName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const address = document.getElementById("address");
const country = document.getElementById("country");

const newUserBtn = document.getElementById("newUserBtn");
const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");

const favoriteQuotes = document.getElementById("favoriteQuotes");
const savedContacts = document.getElementById("savedContacts");

const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");

const themeBtn = document.getElementById("themeBtn");

let currentQuote = {};
let currentUser = {};

// ===========================================
// Event Listeners
// ===========================================

newQuoteBtn.addEventListener("click", getQuote);

newUserBtn.addEventListener("click", getRandomUser);

copyBtn.addEventListener("click", copyQuote);

tweetBtn.addEventListener("click", tweetQuote);

favoriteQuoteBtn.addEventListener("click", saveFavoriteQuote);

// ===========================================
// Quote API
// ===========================================

async function getQuote(){

showLoader();

try{

const response=await fetch("https://dummyjson.com/quotes/random");

const data=await response.json();

currentQuote=data;

quote.textContent=data.quote;

author.textContent="— "+data.author;

}

catch(error){

showError("Unable to load quote.");

}

finally{

hideLoader();

}

}

// ===========================================
// Random User API
// ===========================================

async function getRandomUser(){

showLoader();

try{

const response=await fetch("https://randomuser.me/api/");

const data=await response.json();

const user=data.results[0];

currentUser=user;

profileImage.src=user.picture.large;

userName.textContent=
`${user.name.first} ${user.name.last}`;

email.textContent=user.email;

phone.textContent=user.phone;

gender.textContent=user.gender;

age.textContent=user.dob.age;

address.textContent=
`${user.location.city},
${user.location.state}`;

country.textContent=user.location.country;

}

catch(error){

showError("Unable to load user.");

}

finally{

hideLoader();

}

}

// ===========================================
// Loader
// ===========================================

function showLoader(){

loader.classList.remove("hidden");

errorMessage.classList.add("hidden");

}

function hideLoader(){

loader.classList.add("hidden");

}

// ===========================================
// Error
// ===========================================

function showError(message){

errorMessage.textContent=message;

errorMessage.classList.remove("hidden");

}// ===========================================
// COPY QUOTE
// ===========================================

function copyQuote(){

    navigator.clipboard.writeText(
        `${currentQuote.quote} - ${currentQuote.author}`
    );

    alert("Quote copied to clipboard!");

}

// ===========================================
// TWEET QUOTE
// ===========================================

function tweetQuote(){

    const text = `"${currentQuote.quote}" - ${currentQuote.author}`;

    const url =
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    window.open(url,"_blank");

}

// ===========================================
// SAVE FAVORITE QUOTE
// ===========================================

function saveFavoriteQuote(){

    if(!currentQuote.quote) return;

    let favorites = JSON.parse(
        localStorage.getItem("favoriteQuotes")
    ) || [];

    const exists = favorites.some(
        q => q.quote === currentQuote.quote
    );

    if(exists){

        alert("Quote already saved.");

        return;

    }

    favorites.push(currentQuote);

    localStorage.setItem(
        "favoriteQuotes",
        JSON.stringify(favorites)
    );

    loadFavoriteQuotes();

}

// ===========================================
// LOAD FAVORITE QUOTES
// ===========================================

function loadFavoriteQuotes(){

    favoriteQuotes.innerHTML="";

    const favorites = JSON.parse(
        localStorage.getItem("favoriteQuotes")
    ) || [];

    favorites.forEach((item,index)=>{

        const card=document.createElement("div");

        card.className="favorite-card";

        card.innerHTML=`

            <p>"${item.quote}"</p>

            <h3>- ${item.author}</h3>

            <button
            onclick="removeFavoriteQuote(${index})">

            Remove

            </button>

        `;

        favoriteQuotes.appendChild(card);

    });

}

// ===========================================
// REMOVE FAVORITE QUOTE
// ===========================================

function removeFavoriteQuote(index){

    let favorites = JSON.parse(
        localStorage.getItem("favoriteQuotes")
    ) || [];

    favorites.splice(index,1);

    localStorage.setItem(
        "favoriteQuotes",
        JSON.stringify(favorites)
    );

    loadFavoriteQuotes();

}

// ===========================================
// SAVE CONTACT
// ===========================================

function saveContact(){

    if(!currentUser.email) return;

    let contacts = JSON.parse(
        localStorage.getItem("savedContacts")
    ) || [];

    const exists = contacts.some(
        c=>c.email===currentUser.email
    );

    if(exists){

        alert("Contact already saved.");

        return;

    }

    contacts.push(currentUser);

    localStorage.setItem(
        "savedContacts",
        JSON.stringify(contacts)
    );

    loadContacts();

}

saveBtn.addEventListener("click",saveContact);

// ===========================================
// LOAD CONTACTS
// ===========================================

function loadContacts(){

    savedContacts.innerHTML="";

    const contacts = JSON.parse(
        localStorage.getItem("savedContacts")
    ) || [];

    contacts.forEach((user,index)=>{

        const card=document.createElement("div");

        card.className="favorite-card";

        card.innerHTML=`

        <img
        src="${user.picture.medium}"
        style="width:70px;height:70px;border-radius:50%;margin-bottom:10px;">

        <h3>${user.name.first} ${user.name.last}</h3>

        <p>${user.email}</p>

        <button
        onclick="removeContact(${index})">

        Remove

        </button>

        `;

        savedContacts.appendChild(card);

    });

}

// ===========================================
// REMOVE CONTACT
// ===========================================

function removeContact(index){

    let contacts = JSON.parse(
        localStorage.getItem("savedContacts")
    ) || [];

    contacts.splice(index,1);

    localStorage.setItem(
        "savedContacts",
        JSON.stringify(contacts)
    );

    loadContacts();

}

// ===========================================
// DOWNLOAD VCARD
// ===========================================

function downloadVCard(){

    if(!currentUser.email) return;

    const card=`

BEGIN:VCARD
VERSION:3.0
FN:${currentUser.name.first} ${currentUser.name.last}
EMAIL:${currentUser.email}
TEL:${currentUser.phone}
END:VCARD

`;

    const blob=new Blob([card],{type:"text/vcard"});

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="contact.vcf";

    link.click();

}

downloadBtn.addEventListener("click",downloadVCard);

// ===========================================
// DARK MODE
// ===========================================

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }
    else{

        localStorage.setItem("theme","light");

    }

}

themeBtn.addEventListener("click",toggleTheme);

// ===========================================
// LOAD THEME
// ===========================================

function loadTheme(){

    const theme=localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

    }

}

// ===========================================
// KEYBOARD SHORTCUTS
// ===========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="q"){

        getQuote();

    }

    if(e.key==="u"){

        getRandomUser();

    }

    if(e.key==="Escape"){

        errorMessage.classList.add("hidden");

    }

});

// ===========================================
// CONNECTION STATUS
// ===========================================

window.addEventListener("offline",()=>{

    showError("No Internet Connection");

});

window.addEventListener("online",()=>{

    errorMessage.classList.add("hidden");

});

// ===========================================
// INITIALIZATION
// ===========================================

function initializeApp(){

    loadTheme();

    loadFavoriteQuotes();

    loadContacts();

    getQuote();

    getRandomUser();

}

initializeApp();