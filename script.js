const $=id=>document.getElementById(id);
$('menuBtn').addEventListener('click',()=>$('nav').classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));

// Randomized five-question quiz banks, with answer explanations.
const questionBanks={
 patterns:[
  {q:'What number comes next? 2, 4, 6, 8, ___',a:['9','10','12','14'],correct:1,why:'The sequence adds 2 each time, so the next number is 10.'},
  {q:'What comes next in the Fibonacci sequence? 1, 1, 2, 3, 5, 8, ___',a:['10','11','12','13'],correct:3,why:'Add the two previous terms: 5 + 8 = 13.'},
  {q:'A sequence doubles each time: 2, 4, 8, 16, ___. What is next?',a:['18','24','32','36'],correct:2,why:'Multiply the previous term by 2: 16 × 2 = 32.'},
  {q:'What number comes next? 1, 4, 9, 16, ___',a:['20','24','25','36'],correct:2,why:'These are square numbers: 1², 2², 3², 4², then 5² = 25.'},
  {q:'Why are patterns useful in mathematics?',a:['They remove the need to think','They help us notice regularities and make predictions','They always make every answer even','They only apply to geometry'],correct:1,why:'Recognizing patterns helps us describe regularities and predict what may happen next.'}
 ],
 symbols:[
  {q:'Which of these is a mathematical expression?',a:['2x + 5','2x + 5 = 9','x >','= 7 +'],correct:0,why:'An expression combines numbers, variables, and operations without an equality or comparison statement.'},
  {q:'How do you write “7 more than x” as an expression?',a:['7 − x','7x','x + 7','x ÷ 7'],correct:2,why:'“More than” means addition, so the expression is x + 7.'},
  {q:'Which symbol means “is equal to”?',a:['≠','≤','=','∈'],correct:2,why:'The equals sign (=) states that two quantities have the same value.'},
  {q:'If A = {1, 2, 3}, which statement is true?',a:['4 ∈ A','2 ∈ A','A ∈ 2','0 ∈ A'],correct:1,why:'The symbol ∈ means “is an element of.” Since 2 is in the set, 2 ∈ A.'},
  {q:'“Twice a number is 14.” If the number is x, which equation represents the statement?',a:['x + 2 = 14','x ÷ 2 = 14','2x = 14','x − 2 = 14'],correct:2,why:'Twice a number means 2 multiplied by x, so 2x = 14.'}
 ],
 reasoning:[
  {q:'According to Polya’s problem-solving steps, what should you do first?',a:['Check the answer','Understand the problem','Guess randomly','Write the final answer'],correct:1,why:'First understand what is given and what you need to find.'},
  {q:'What is inductive reasoning?',a:['Using examples to suggest a general rule','Starting with a rule and applying it to a case','Ignoring evidence','Repeating a calculation without checking'],correct:0,why:'Inductive reasoning observes examples or patterns and uses them to suggest a general conclusion.'},
  {q:'All squares have four sides. This shape is a square. Therefore, it has four sides. This is an example of…',a:['Inductive reasoning','Deductive reasoning','Guessing','Estimation only'],correct:1,why:'Deductive reasoning applies a general rule to a specific case.'},
  {q:'A ₱1,000 item has a 20% discount. What is the sale price?',a:['₱200','₱800','₱820','₱1,200'],correct:1,why:'20% of ₱1,000 is ₱200. Subtract the discount: ₱1,000 − ₱200 = ₱800.'},
  {q:'What should you do in Polya’s final step, “Look back”?',a:['Stop before solving','Change the question','Check the result and the method','Skip the calculations'],correct:2,why:'Looking back means checking whether the answer makes sense and whether the method worked.'}
 ]
};
let activeTopic='patterns',questions=[],questionIndex=0,score=0,answered=false;
function shuffle(items){const arr=[...items];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function startQuiz(topic=activeTopic){activeTopic=topic;questions=shuffle(questionBanks[topic]);questionIndex=0;score=0;answered=false;document.querySelectorAll('.quiz-tab').forEach(b=>{const active=b.dataset.topic===topic;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderQuestion();}
function renderQuestion(){const q=questions[questionIndex];$('quizProgress').textContent=`Question ${questionIndex+1} of ${questions.length}`;$('quizScore').textContent=`Score: ${score} / ${questions.length}`;$('nextQuestion').disabled=true;$('nextQuestion').textContent=questionIndex===questions.length-1?'See results':'Next question';const box=$('quizQuestion');box.innerHTML=`<strong>Question ${questionIndex+1}</strong><p class="quiz-question-text"></p><div class="quiz-answer-options"></div><p class="quiz-feedback" aria-live="polite"></p>`;box.querySelector('.quiz-question-text').textContent=q.q;const options=box.querySelector('.quiz-answer-options');shuffle(q.a.map((text,index)=>({text,original:index}))).forEach(item=>{const btn=document.createElement('button');btn.type='button';btn.textContent=item.text;btn.addEventListener('click',()=>answerQuestion(item.original,btn));options.appendChild(btn);});}
function answerQuestion(choice,button){if(answered)return;answered=true;const q=questions[questionIndex],buttons=[...$('quizQuestion').querySelectorAll('.quiz-answer-options button')];buttons.forEach(b=>{b.disabled=true;if(b.textContent===q.a[q.correct])b.classList.add('correct');});if(choice===q.correct){score++;button.classList.add('correct');$('quizQuestion').querySelector('.quiz-feedback').textContent='Correct! '+q.why;}else{$('quizQuestion').querySelector('.quiz-feedback').textContent='Not quite. '+q.why;button.classList.add('wrong');}$('quizScore').textContent=`Score: ${score} / ${questions.length}`;$('nextQuestion').disabled=false;}
$('nextQuestion').addEventListener('click',()=>{if(!answered)return;if(questionIndex<questions.length-1){questionIndex++;answered=false;renderQuestion();}else{showResults();}});
function showResults(){const pct=Math.round(score/questions.length*100);$('quizProgress').textContent='Quiz complete';$('quizScore').textContent=`Score: ${score} / ${questions.length}`;$('quizQuestion').innerHTML=`<div class="quiz-complete"><h3>${pct>=80?'Great work!':pct>=60?'Good effort!':'Keep practicing!'}</h3><p>You scored <strong>${score} out of ${questions.length}</strong> (${pct}%). ${pct>=80?'You have a strong grasp of this topic.': 'Review the explanations and try the shuffled quiz again.'}</p></div>`;$('nextQuestion').disabled=true;$('nextQuestion').textContent='Quiz complete';}
document.querySelectorAll('.quiz-tab').forEach(btn=>btn.addEventListener('click',()=>startQuiz(btn.dataset.topic)));
$('restartQuiz').addEventListener('click',()=>startQuiz(activeTopic));
startQuiz();

function calculate(){let price=Math.max(0,Number($('price').value)||0),discount=Math.min(100,Math.max(0,Number($('discount').value)||0));let saved=price*discount/100,final=price-saved;let fmt=n=>'₱'+n.toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});$('save').textContent=fmt(saved);$('final').textContent=fmt(final);$('explain').textContent=`${discount}% of ${fmt(price)} is ${fmt(saved)}. Subtract the discount to get a final price of ${fmt(final)}.`;}
$('calculate').addEventListener('click',calculate);$('price').addEventListener('input',calculate);$('discount').addEventListener('input',calculate);calculate();
const choices=['Look for a pattern','Use a formula','Draw it','Guess and check'],key='mathbits_votes';
function votes(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}}
function render(){let v=votes();$('total').textContent=v.length?`${v.length} vote${v.length===1?'':'s'} recorded in this browser`:'No votes yet.';$('bars').innerHTML=choices.map(c=>{let n=v.filter(x=>x===c).length,p=v.length?Math.round(n/v.length*100):0;return `<div class="bar-row"><div class="bar-label"><span>${c==='Draw it'?'Draw or visualize it':c}</span><b>${p}% (${n})</b></div><div class="bar-bg"><div class="bar-fill" style="width:${p}%"></div></div></div>`}).join('');}
$('pollForm').addEventListener('submit',e=>{e.preventDefault();let choice=new FormData(e.currentTarget).get('method');let v=votes();v.push(choice);localStorage.setItem(key,JSON.stringify(v));render();e.currentTarget.reset()});render();


// Temperature converter: Celsius, Fahrenheit, and Kelvin.
const tempUnits={C:{name:'Celsius',symbol:'°C'},F:{name:'Fahrenheit',symbol:'°F'},K:{name:'Kelvin',symbol:'K'}};
function toCelsius(value,unit){if(unit==='C')return value;if(unit==='F')return (value-32)*5/9;return value-273.15;}
function fromCelsius(value,unit){if(unit==='C')return value;if(unit==='F')return value*9/5+32;return value+273.15;}
function convertTemperature(){
 const raw=$('tempValue').value;const value=Number(raw);const from=$('tempFrom').value;const to=$('tempTo').value;
 if(raw.trim()===''||!Number.isFinite(value)){$('tempResult').textContent='Enter a temperature';$('tempExplain').textContent='Type a valid number to convert.';return;}
 const celsius=toCelsius(value,from);
 if(celsius < -273.15-1e-9){$('tempResult').textContent='Invalid temperature';$('tempExplain').textContent='That value is below absolute zero (0 K / −273.15 °C). Please enter a physically possible temperature.';return;}
 const result=fromCelsius(celsius,to);
 const clean=n=>Math.abs(n)<0.005?0:Number(n.toFixed(2));
 const fmt=n=>clean(n).toLocaleString('en-US',{maximumFractionDigits:2});
 $('tempResult').textContent=`${fmt(result)} ${tempUnits[to].symbol}`;
 let formula='';
 if(from===to) formula=`Both units are the same, so the temperature remains ${fmt(result)} ${tempUnits[to].symbol}.`;
 else if(from==='C'&&to==='F') formula=`${fmt(value)} × 9/5 + 32 = ${fmt(result)} °F`;
 else if(from==='F'&&to==='C') formula=`(${fmt(value)} − 32) × 5/9 = ${fmt(result)} °C`;
 else if(from==='C'&&to==='K') formula=`${fmt(value)} + 273.15 = ${fmt(result)} K`;
 else if(from==='K'&&to==='C') formula=`${fmt(value)} − 273.15 = ${fmt(result)} °C`;
 else if(from==='F'&&to==='K') formula=`(${fmt(value)} − 32) × 5/9 + 273.15 = ${fmt(result)} K`;
 else formula=`(${fmt(value)} − 273.15) × 9/5 + 32 = ${fmt(result)} °F`;
 $('tempExplain').textContent=formula;
}
$('convertTemp').addEventListener('click',convertTemperature);
$('tempValue').addEventListener('input',convertTemperature);
$('tempFrom').addEventListener('change',convertTemperature);
$('tempTo').addEventListener('change',convertTemperature);
convertTemperature();
