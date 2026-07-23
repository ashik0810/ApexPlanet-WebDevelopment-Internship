// ==========================================
// DevLaunch Hub
// script.js
// ==========================================

// Elements

const themeBtn = document.getElementById("themeBtn");
const navLinks = document.querySelectorAll("nav ul li a");

// =============================
// Dark Mode
// =============================

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("hubTheme","dark");

    }else{

        localStorage.setItem("hubTheme","light");

    }

}

themeBtn.addEventListener("click",toggleTheme);

function loadTheme(){

    const theme=localStorage.getItem("hubTheme");

    if(theme==="dark"){

        document.body.classList.add("dark");

    }

}

loadTheme();

// =============================
// Active Navigation
// =============================

const sections=document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

    let current="";

    sections.forEach(section=>{

        const sectionTop=section.offsetTop-120;

        if(pageYOffset>=sectionTop){

            current=section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#"+current){

            link.classList.add("active");

        }

    });

});

// =============================
// Reveal Animation
// =============================

const cards=document.querySelectorAll(".card");

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

cards.forEach(card=>{

    observer.observe(card);

});

// =============================
// Visitor Counter
// =============================

let visits=localStorage.getItem("hubVisits");

if(visits===null){

    visits=1;

}else{

    visits=parseInt(visits)+1;

}

localStorage.setItem("hubVisits",visits);

console.log("Visitor Count :",visits);

// =============================
// Scroll To Top Button
// =============================

const topBtn=document.createElement("button");

topBtn.innerHTML="↑";

topBtn.id="topBtn";

document.body.appendChild(topBtn);

topBtn.style.position="fixed";
topBtn.style.right="25px";
topBtn.style.bottom="25px";
topBtn.style.width="55px";
topBtn.style.height="55px";
topBtn.style.border="none";
topBtn.style.borderRadius="50%";
topBtn.style.background="#38bdf8";
topBtn.style.color="white";
topBtn.style.fontSize="22px";
topBtn.style.cursor="pointer";
topBtn.style.display="none";
topBtn.style.zIndex="999";

window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        topBtn.style.display="block";

    }else{

        topBtn.style.display="none";

    }

});

topBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// =============================
// Smooth Animation
// =============================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({

            behavior:"smooth"

        });

    });

});

// =============================
// Console Welcome
// =============================

console.log("Welcome to DevLaunch Hub 🚀");