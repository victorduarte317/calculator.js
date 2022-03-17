class CalcController {

        constructor() { // Inicia os atributos e funções
            this._operation = []; // Vai dar clear no array inteiro, função executada pelo método clearAll()
            this._locale ='pt-br'
            this._currentDate;         
            this._displayCalcEl = document.querySelector('#display');
            this._dateEl = document.querySelector('#data');
            this._timeEl = document.querySelector('#hora');
            this.initialize(); 
            this.initButtonsEvents();
               
        }

        initialize(){ // Inicia esses métodos no carregar da página
            this.setDisplayDateTime();

            setInterval(() => {
                this.setDisplayDateTime();
            }, 1000);
        }

        addEventListenerAll(element, events, fn) { // Recebe os parâmetros que o this.addEventListenerAll passa
            events.split(' ').forEach(event => { // Quando criado o events.split, o parâmetro se torna um array, então usamos forEach com arrow function pra definir a função que será executada
        
                element.addEventListener(event, fn, false); // A cada evento, o botão vai receber no eventlistener qual foi o event, qual foi a function (fn) e declarar falso por conta das duas camadas svg dos botões.
            });
        }

        clearAll() {   
            this._operation = [];
        }

        clearEntry() {
            this._operation.pop(); // Vai eliminar o último item do array por causa do "pop" (nativo)
        }

        setError() {
            this.displayCalc ='Error';
        }

        getLastOperation() {
            return this._operation[this._operation.length-1];
        }

        _setLastOperation(value) {
            this._operation[this._operation.length - 1] = value;
        }

        isOperator(value) {
             return (['+', '-', '*', '%', '/', '.'].indexOf(value) > -1); // Esse método vai buscar o valor digitado dentro do array e trazer o index. Se não encontrar, retorna -1. Se encontrar, retorna a posição do elemento.
        }

        addOperation(value) { // Esse value é o que o usuário digitou
            if (isNaN(this.getLastOperation())) { // Mas antes de tratar ele, é preciso verificar se o último caractere foi outro numero ou não. Se foi um sinal, por exemplo, é preciso realizar a função que condiz com o sinal.
            //string
                if(this.isOperator(value)) {
                    //Trocar o operador
                    this._setLastOperation(value); // Se o último elemento digitado for um nretornar -1) ele vai concatenar com o valor atual.
                }

                else if (isNaN(value)){

                    console.log(value);
                }

                else {
                    this._operation.push(value);
                }

            }

            else {
            //number
                let newValue = this.getLastOperation().toString() + value.toString();
                this._setLastOperation(parseInt(newValue));
            }

            

            console.log(this._operation);
        }

        execBtn(value) {
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
                    
                break;

                case 'ponto':
                    this.addOperation('.');
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

        initButtonsEvents() { // Inicia os eventos do botão
            let buttons = document.querySelectorAll('#buttons > g, #parts > g')

            buttons.forEach((btn, index)=> { // Vai realizar a arrow function pra cada botão percorrido
                this.addEventListenerAll(btn, 'click drag', e=>{

                    let textBtn = btn.className.baseVal.replace("btn-", "");

                    this.execBtn(textBtn);

                });

                this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                    btn.style.cursor='pointer';
                })
            })
        }

        setDisplayDateTime() {
            this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
            
            this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
                day: '2-digit', 
                month: 'long',
                year: 'numeric'

            });
        
        }
        get displayTime() {
            return this._timeEl.innerHTML;
        }

        set displayTime(value) {
            this._timeEl.innerHTML = value;
        }

        get displayDate() {
            return this._dateEl.innerHTML;
        }

        set displayDate(value) {
            this._dateEl.innerHTML = value;
        }

        get displayCalc() {
            return this._displayCalcEl.innerHTML;
        }

        set displayCalc(value) {
            this._displayCalcEl.innerHTML = value;
        }

        get currentDate() {
            return new Date();
        }

        set currentDate(value) {
            this._currentDate = value;
        }
}