import Store  from './store';
/*
* Class : Vocabulary
*/
class Vocabulary {
  
   constructor() {
     /*
     * @var form || Main Form selector
     * @var table || Words Table
     * @var Store || localStorage
     */
     this.form  = document.querySelector('#submitWords');
     this.table = document.querySelector('#activeWords');
     this.Store = new Store();
     this.wordId = 0;
     this.wordsArr = [];
     this.form.addEventListener("submit", (e) => { this.wordsInput(e); });
   
   }
  /*
  * Get User submitted data
  * @param e | events
  */
   wordsInput(e) {
     //prevent reloading the page after submitting
     e.preventDefault();
     let wordsObj = {},
         formValues = this.form.querySelectorAll( "input" );
     
     for( var i = 0; i < formValues.length; ++i ) {
        let element = formValues[i], 
            name = element.name,
            value = element.value;
        if( name ) {
          wordsObj[ name ] = value;
          wordsObj[ 'id'] = this.wordId++;
        }
		  }
     
     if(this.Store.readStore("vocabulary-list"))
        this.wordsArr = this.Store.readStore("vocabulary-list");
    
     this.wordsArr.push(wordsObj)
     //Update Store
     this.Store.createStore("vocabulary-list", JSON.stringify(this.wordsArr));
     if(wordsObj)
       this.updateHTML(wordsObj);
     //Reset Form data once it sent
     this.form.reset();
   }
    
  
  deleteWords(e) {
    let loadStore = this.Store.readStore("vocabulary-list"),
        word = e.srcElement.dataset.word;
    for(var i = 0; i < loadStore.length; i++){
      if(loadStore[i].italian === word) {
        loadStore.splice(i,1);
      }
    }
    this.Store.createStore("vocabulary-list", JSON.stringify(loadStore));
    this.renderHTML(loadStore);
    location.reload();
  }
  
  /*
  * Render HTML Elm
  * @param elm | Arr
  */
  renderHTML(elm) {
    var activeTable = document.querySelector('#activeWords');
    if(elm && elm !== null) {
      //Reset Table    
      activeTable.innerHTML = '';
      elm.forEach(data => {
          let row = activeTable.insertRow(),
                  english = row.insertCell(0),
                  italian = row.insertCell(1);
              english.innerHTML = data.english;
              italian.innerHTML = `${data.italian} - <button id='delete-word-${data.italian}' data-word="${data.italian}">X</button>`;
        //Add delete event
        document.querySelector(`#delete-word-${data.italian}`).addEventListener("click", (e) => {  this.deleteWords(e); });
      });
      }
    
  }
  /*
  * Update HTML
  * @pram elm | Array
  */
  updateHTML(htmlDATA) {
    var activeTable = document.querySelector('#activeWords');
    let row = activeTable.insertRow(),
        english = row.insertCell(0),
        italian = row.insertCell(1);
    english.innerHTML = htmlDATA.english;
    italian.innerHTML = `${htmlDATA.italian} - <button id='delete-word-${htmlDATA.italian}' >X</button>`;
    //Add delete event
    document.querySelector(`#delete-word-${htmlDATA.italian}`).addEventListener("click", (e) => {  this.deleteWords(e); });
    location.reload();
  }
  
 /*
  * Start Test
  */
  startTest() {
    let startBtn = document.querySelector('#start-test'),
        nextBtn = document.querySelector('#nextBtn');
        startBtn.style.display = "none";
        if(startBtn && this.Store.readStore("vocabulary-list").length !== 0) 
           startBtn.style.display = "block";
           startBtn.addEventListener("click", (e) => { this.renderTestView(); });
  }
  /*
  * RenderTestView
  */
  renderTestView() {
    this.wordId = 0;
    let dashbordView = document.querySelector('.dashboard'),
        testView = document.querySelector('#testView'),
        testForm = testView.querySelector('#testForm'),
        randomNum = this.getRandomNumberHelper(this.Store.readStore("vocabulary-list").length);
    //Delete localstorage
    this.Store.removeStore('vocabulary-test');
    //Hide Dashbord View
    dashbordView.style.display = "none";
    //Show Test View
    testView.style.display = "block";
    //Genarate Exam
    this.genarateTest(null,randomNum);
    testForm.addEventListener("submit", (e) => { this.genarateTest(e,randomNum); });
  }
  /*
  * Genarate Test
  * @param e | current event
  * @param arndNum | arr
  */
  genarateTest(e,randNum) {
    if(e !== null)
      e.preventDefault();
    let testView = document.querySelector('#testView'),
        progress = testView.querySelector('#progress'),
        nextBtn  = testView.querySelector('#nextBtn'),
        savedWords = this.Store.readStore("vocabulary-list"),
        firstWordLabel = testView.querySelector('label'),
        secondWordLabel = testView.querySelector('input');
      if(this.wordId !== savedWords.length ) {
        let firstword = savedWords[randNum[this.wordId]].english,
            secondword = savedWords[randNum[this.wordId]].italian;
        firstWordLabel.innerHTML = firstword;
        progress.innerHTML = `${this.wordId + 1} of ${savedWords.length}`;
        if(e !== null)
          this.answerHelper(savedWords[randNum[this.wordId -1 ]].english,
                            savedWords[randNum[this.wordId -1]].italian,secondWordLabel.value,true);
        
          //reset input feild
        secondWordLabel.value = "";
        this.wordId++
      } else {
         this.answerHelper(savedWords[randNum[this.wordId -1 ]].english,
                            savedWords[randNum[this.wordId -1]].italian,secondWordLabel.value);
        testView.style.display = "none";
        this.renderResultView();
      }
    }
 /*
  * ResultView
  * @param 
  */
  renderResultView() {
    let resultView = document.querySelector('#resultView'),
        resultTable = resultView.querySelector('#activeResults'),
        score = resultView.querySelector('#scorePrestnt'),
        homeBtn = document.querySelector('#nav'), 
        totalCorrect = 0,
        resultList = this.Store.readStore("vocabulary-test");
    //Display Results
    resultView.style.display = "block";
    homeBtn.style.display = "block";
    homeBtn.addEventListener("click", (e) => { location.reload() });
    
    //Genarate Result Table
    resultTable.innerHTML = '';
    resultList.forEach(function(value) {
        if(value.correct)
          totalCorrect++
       let row = resultTable.insertRow(),
                  english = row.insertCell(0),
                  italian = row.insertCell(1),
                  yours = row.insertCell(2);
      english.innerHTML = value.english;
      italian.innerHTML = value.italian;
      row.classList.add(`answer-${value.correct}`);
      yours.innerHTML = value.answer;
    })
    //Genarate Score
    let scorePres = (totalCorrect / resultList.length) * 100;
    score.innerHTML = `${Math.round(scorePres)}%`;
  }
 /*
  * Answers Helper
  * @param  
  */
  answerHelper(...answers) {
      let helperArry = [],
          helperObj = {
        english: answers[0],
        italian: answers[1],
        answer : answers[2],
        correct: (answers[1].toLowerCase() === answers[2].toLowerCase()) ? true : false
      }
      if(this.Store.readStore("vocabulary-test"))
        helperArry = this.Store.readStore("vocabulary-test");
      helperArry.push(helperObj);
      this.Store.createStore("vocabulary-test", JSON.stringify(helperArry));
  }
  /*
  * getRandomNumberHelper
  * @param  pos | [] 
  */
  getRandomNumberHelper(pos) {
    var o = Array.from(new Array(pos),(val,index)=>index);
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
  
}
export default Vocabulary;
var vApp = new Vocabulary(),
    store = new Store();
//Render saved List
vApp.renderHTML(store.readStore("vocabulary-list"));
vApp.startTest();
