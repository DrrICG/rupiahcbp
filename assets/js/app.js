const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const toTop = document.getElementById('toTop');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function handleScrollUI(){
    if (toTop) toTop.classList.toggle('show', window.scrollY > 520);
}
window.addEventListener('scroll', handleScrollUI);
if (toTop) toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
handleScrollUI();

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - .5) * 12;
        const rotateX = ((.5 - y / rect.height)) * 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});

const quizData = window.CBP_QUIZ || [];
let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let answered = false;

const quizCounter = document.getElementById('quizCounter');
const progressBar = document.getElementById('progressBar');
const questionText = document.getElementById('questionText');
const answersWrap = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

function renderQuiz(){
    if (!quizData.length || !quizCounter || !progressBar || !questionText || !answersWrap || !feedback || !nextBtn || !restartBtn) return;
    answered = false;
    selectedAnswer = null;
    const item = quizData[currentQuestion];
    quizCounter.textContent = `Pertanyaan ${currentQuestion + 1} dari ${quizData.length}`;
    progressBar.style.width = `${(currentQuestion / quizData.length) * 100}%`;
    questionText.textContent = item.question;
    answersWrap.innerHTML = '';
    feedback.textContent = '';
    nextBtn.textContent = 'Jawab';
    nextBtn.hidden = false;
    restartBtn.hidden = true;

    item.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index, button));
        answersWrap.appendChild(button);
    });
}

function selectAnswer(index, button){
    if (answered) return;
    selectedAnswer = index;
    document.querySelectorAll('.answer-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function submitAnswer(){
    if (selectedAnswer === null) {
        feedback.textContent = 'Pilih salah satu jawaban terlebih dahulu.';
        return;
    }
    answered = true;
    const item = quizData[currentQuestion];
    const buttons = [...document.querySelectorAll('.answer-btn')];
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === item.correct) btn.classList.add('correct');
        if (index === selectedAnswer && index !== item.correct) btn.classList.add('wrong');
    });
    if (selectedAnswer === item.correct) {
        score += 1;
        feedback.textContent = `Benar. ${item.note}`;
    } else {
        feedback.textContent = `Belum tepat. ${item.note}`;
    }
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Lihat Skor' : 'Lanjut';
}

function nextQuestion(){
    if (!answered) {
        submitAnswer();
        return;
    }
    if (currentQuestion < quizData.length - 1) {
        currentQuestion += 1;
        renderQuiz();
        return;
    }
    showResult();
}

function showResult(){
    progressBar.style.width = '100%';
    quizCounter.textContent = 'Kuis selesai';
    questionText.textContent = `Skor kamu: ${score} dari ${quizData.length}`;
    answersWrap.innerHTML = '';
    const percentage = Math.round((score / quizData.length) * 100);
    let message = 'Terus belajar. Mulai dari 3D, 5J, sejarah Rupiah, dan keamanan QRIS.';
    if (percentage >= 80) message = 'Mantap. Kamu sudah sangat memahami dasar-dasar CBP Rupiah.';
    else if (percentage >= 60) message = 'Bagus. Pemahamanmu sudah cukup baik dan bisa ditingkatkan lagi.';
    feedback.textContent = message;
    nextBtn.hidden = true;
    restartBtn.hidden = false;
}

if (nextBtn && restartBtn) {
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        selectedAnswer = null;
        score = 0;
        answered = false;
        renderQuiz();
    });
    renderQuiz();
}
