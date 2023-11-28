let currentIndex = 1;

function changeBackground() {
    const element = document.querySelector('.welcome-page');

    
    element.classList.remove('background1', 'background2', 'background3');

    
    element.classList.add(`background${currentIndex}`);

 
    currentIndex++;

    
    if (currentIndex > 3) {
        currentIndex = 1;
    }
}


setInterval(changeBackground, 5000);