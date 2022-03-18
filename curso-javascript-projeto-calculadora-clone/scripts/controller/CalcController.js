class CalcController {

    constructor(){
        // Codigo temporario da Aula 20. Vi as aulas em casa, fiz os métodos e anotei tudo certinho mas esqueci de commitar, tá salvo so no meu PC, vou atualizar assim que chegar em casa.
        this._lastOperator = '';
        this._lastNumber = '';

        this._audio = new Audio('click.mp3'); // Essa classe Audio é de uma webAPI, não é nativa do JS
        this._audioOnOff = false;

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }


    copyToClipboard() {

        let input = document.createElement('input'); // Criação dinâmica de eventos na tela.

        input.value = this.displayCalc; // Atribuindo o objeto displayCalc no valor do input

        document.body.appendChild(input); // Passando o input pro body do html como elemento filho para que ele possa ser selecionado.

        input.select(); // Selecionando o input.

        document.execCommand('Copy'); // Executando o 'copy' pro clipboard.

        input.remove(); // Eliminando o input já que estamos trabalhando com SVG.
    }

    pasteFromClipboard() { // Colar o conteúdo da clipboard
       
        document.addEventListener('paste', e=> { // Adiciona um eventListener, evento paste (colar) e arrow function

            let text = e.clipboardData.getData('Text'); // Pega os dados de tipo 'Text' da clipboard e atribui a variável text   

            this.displayCalc = parseFloat(text); // Pega a variável text, transforma ela em float e aloca no objeto displayCalc (visor da calculadora)

        });
 
    }

    initialize(){

        this.setDisplayDateTime()

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{ // query selector all pq tem mais de 1 btn-ac, pra cada um (foreach) btn arrow function

            btn.addEventListener('dblclick', e=>{ // adiciona o eventListener dblclick pro btn

                this.toggleAudio();

            });

        });
    }

    toggleAudio(){ // Como é um toggle, funciona como se fosse um interruptor, alterando entre dois estados

        this._audioOnOff = !this._audioOnOff; // Se ele tá ligado, ele vai desligar com o evento e vice-versa. É como um loop de uma linha só, com atribuição de valores.
        
    }

    playAudio() {

        if(this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    initKeyboard(){ // Manusear eventos de teclado, é um método eventListener

        this.playAudio();

        document.addEventListener('keyup', e =>{ // Adiciona o eventListener 'keyup' que é quando o usuário solta a tecla. Depois, a função que vai ser executada quando o evento ocorrer.
                                                 // O console fornece o "key" que é o código da tecla que foi pressionada
            console.log(e.key); 

            switch (e.key) { // Switch em cima do evento (e) e 'key' é a propriedade que retorna o valor digitado.

                case 'Escape': // Caso a teclaa pressionada seja "ESCape", cleana a calculadora.
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '/': // Todos eles ficariam "case x this.addOperation(x)" então essa forma simplifica o código.
                case '*':
                case '%':
                    this.addOperation(e.key);
                break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;
                
                case ',':x  
                case '.':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                break;

                case 'c': // Quando o usuário aperta a tecla "C"
                    if(e.ctrlKey) this.copyToClipboard(); // Checa se a tecla "Control" estava sendo segurada junto com "C" e, se sim, copia a informação pra clipboard.
            
                break;

                case 'v': 
                    if(e.ctrlKey) this.pasteFromClipboard();
                break;
            
            }

    
        });

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        })
    
    }

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    isOperator(value){

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    pushOperation(value){

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult(){
        try { // Tenta executar o código abaixo

            return eval(this._operation.join(""));
        }

        catch(e) { // Se não conseguir, executa esse código 
            setTimeout(()=> { // Esse setTimeout é pra, como o setError é chamado em outros lugares que atribuem o número 0 ao display, ele acaba sendo passado por cima. Então, com o setTimeout, ele espera a definição de "0" no display e sobrescreve com o texto "ERROR"
                this.setError();

            }, 1); // Quanto tempo (em ms) esperar até a execução do código
        }
    }

    // Try catch é comumente usado em áreas sensíveis do código, aonde pode estourar um erro.

    calc(){

        let last = '';
        
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];

            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }
        
        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){

            if (this.isOperator(this._operation[i]) == isOperator) {
    
                lastItem = this._operation[i];
    
                break;
    
            }

        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value){


        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);

            } else {

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)){

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();

                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }

    }

    setError(){

        this.displayCalc = "Error";
        
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; // testa se o tipo da última operação é string pra poder usar o split.  Splita ela em vazio pra criar um array e pegar o index.

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();this.playAudio();
        
    }   

    execBtn(value){

        this.playAudio(); // Como o execBtn é o método que define as ações quando os botões são executados, essa linha vai fazer com que assim que um dos botões for executado, o som toca.

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }

    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.baseVal.replace("btn-","");

                this.execBtn(textBtn);

            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";

            })

        })

    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        return this._timeEl.innerHTML = value;

    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        return this._dateEl.innerHTML = value;

    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value){
        if(value.toString().length > 10) { // O value precisa ser convertido pra string pra não retornar undefined depois de uma operação aritmética e acabar estourando o limite da calculadora.
            this.setError();
        } else {
            this._displayCalcEl.innerHTML = value;
        }

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){

        this._currentDate = value;

    }

}
