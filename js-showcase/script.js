// Hamburger Menu
document.getElementById('menu-btn').onclick = () => {
  document.getElementById('menu').classList.toggle('hidden');
};

// Dark Mode Toggle
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

// Back to Top
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});
backBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Slider
let slides = document.querySelectorAll('.slide');
let index = 0;
document.getElementById('next').onclick = () => {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
};
document.getElementById('prev').onclick = () => {
  slides[index].classList.remove('active');
  index = (index - 1 + slides.length) % slides.length;
  slides[index].classList.add('active');
};

// Modal
const modal = document.getElementById('modal');
document.getElementById('open-modal').onclick = () => modal.classList.remove('hidden');
document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');
window.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.add('hidden'); });

// Accordion
document.querySelectorAll('.question').forEach(btn => {
  btn.onclick = () => btn.nextElementSibling.classList.toggle('hidden');
});

// Form Validation
document.getElementById('signup-form').onsubmit = e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  let msg = '';
  if (!name) msg = 'Name required';
  else if (!/\S+@\S+\.\S+/.test(email)) msg = 'Invalid email';
  else if (password.length < 6) msg = 'Password too short';
  else msg = 'Form submitted!';
  document.getElementById('form-msg').textContent = msg;
};

// Animated Counters
const counters = document.querySelectorAll('.counter');
let countersStarted = false;
const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const update = () => {
      count += Math.ceil(target / 100);
      counter.textContent = count;
      if (count < target) requestAnimationFrame(update);
      else counter.textContent = target;
    };
    update();
  });
};
window.addEventListener('scroll', () => {
  if (!countersStarted && window.scrollY > 300) {
    animateCounters();
    countersStarted = true;
  }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
  const progress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
});

// Drag & Drop List
const dragList = document.getElementById('drag-list');
let draggedItem = null;

dragList.addEventListener('dragstart', e => {
  draggedItem = e.target;
  e.target.style.opacity = 0.5;
});

dragList.addEventListener('dragend', e => {
  e.target.style.opacity = '';
  draggedItem = null;
});

dragList.addEventListener('dragover', e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(dragList, e.clientY);
  if (afterElement == null) {
    dragList.appendChild(draggedItem);
  } else {
    dragList.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const navToggle = document.getElementById("nav-toggle");
const nav = document.querySelector("header nav");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});