// Friendly helper functions
const domReady = (callback) => {
    if (document.readyState !== 'loading') callback();
    else document.addEventListener('DOMContentLoaded', callback);
  };
  
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };
  
  // Main functionality
  domReady(() => {
    // Make prep time collapsible like a friendly notebook
    const prepSection = document.querySelector('.prep-time');
    if (prepSection) {
      const heading = prepSection.querySelector('h2');
      const details = prepSection.querySelector('ul');
      
      heading.style.cursor = 'pointer';
      heading.innerHTML = '⏱️ ' + heading.innerHTML;
      
      heading.addEventListener('click', () => {
        details.classList.toggle('show-details');
        heading.classList.toggle('active');
      });
      
      // Whisper a helpful tip
      heading.addEventListener('mouseenter', () => {
        speak("Click me to see timing details");
      });
    }
  
    // Ingredient checklist with satisfying feedback
    const ingredients = document.querySelectorAll('.ingredients li');
    ingredients.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function() {
        this.classList.toggle('ingredient-done');
        
        // Play a subtle sound (in real implementation, add sound file)
        if (this.classList.contains('ingredient-done')) {
          speak(`Got ${this.textContent.trim()}`);
        }
      });
    });
  
    // Cooking steps with encouragement
    const steps = document.querySelectorAll('.instructions li');
    steps.forEach((step, i) => {
      step.insertAdjacentHTML('afterbegin', `<span class="step-number">${i+1}.</span> `);
      
      step.addEventListener('click', function() {
        const allDone = [...steps].every(s => s.classList.contains('step-complete'));
        
        if (!this.classList.contains('step-complete')) {
          this.classList.add('step-complete');
          speak(`Great job completing step ${i+1}!`);
          
          if (allDone) {
            speak("Congratulations! You've completed all steps. Time to enjoy your delicious mac and cheese pizza!");
          }
        }
      });
    });
  
    // Servings adjuster with friendly messages
    const createServingsTool = () => {
      const tool = document.createElement('div');
      tool.className = 'servings-tool';
      tool.innerHTML = `
        <h3>👨‍👩‍👧‍👦 Adjust for your group size</h3>
        <div class="servings-controls">
          <button aria-label="Fewer servings">−</button>
          <span class="count">1</span>
          <button aria-label="More servings">+</button>
        </div>
        <p class="servings-message">Perfect for 1 hungry chef!</p>
      `;
      
      const container = document.querySelector('.ingredients') || document.querySelector('.recipe__content');
      container.appendChild(tool);
      
      const messages = [
        { min: 1, max: 1, text: "Just right for you!" },
        { min: 2, max: 2, text: "A lovely meal for two" },
        { min: 3, max: 4, text: "Family dinner time!" },
        { min: 5, max: 8, text: "Party size coming up!" },
        { min: 9, max: Infinity, text: "Whoa! Big gathering!" }
      ];
      
      let servings = 1;
      const countEl = tool.querySelector('.count');
      const messageEl = tool.querySelector('.servings-message');
      const [minusBtn, plusBtn] = tool.querySelectorAll('button');
      
      const updateServings = (newVal) => {
        servings = Math.max(1, newVal);
        countEl.textContent = servings;
        
        // Find appropriate message
        const { text } = messages.find(m => servings >= m.min && servings <= m.max);
        messageEl.textContent = text;
        
        // Update ingredient amounts
        document.querySelectorAll('.ingredients li').forEach(li => {
          const text = li.textContent;
          const match = text.match(/([\d½¾⅔¼]+)/);
          if (match) {
            const amount = eval(match[1].replace('½', '0.5').replace('¾', '0.75').replace('⅔', '0.66').replace('¼', '0.25'));
            const newAmount = amount * servings;
            li.textContent = text.replace(match[1], newAmount % 1 === 0 ? newAmount : newAmount.toFixed(2));
          }
        });
      };
      
      minusBtn.addEventListener('click', () => updateServings(servings - 1));
      plusBtn.addEventListener('click', () => updateServings(servings + 1));
    };
    
    createServingsTool();
  
    // Celebration when reaching nutrition section
    const nutritionSection = document.querySelector('.nutrition');
    if (nutritionSection) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          speak("Check out these nutrition facts. Everything in moderation!");
          nutritionSection.style.animation = 'celebrate 2s';
          setTimeout(() => nutritionSection.style.animation = '', 2000);
        }
      }, { threshold: 0.5 });
      
      observer.observe(nutritionSection);
    }
  
    // Friendly print button
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.innerHTML = '📄 Print This Recipe';
    printBtn.addEventListener('click', () => {
      speak("Getting your recipe ready for printing");
      setTimeout(window.print, 800);
    });
    document.querySelector('.recipe__content').appendChild(printBtn);
  });