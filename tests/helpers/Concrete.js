/**
 * Dummy class
 *
 * FOR TESTING ONLY
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
export default class Concrete {

    constructor(){
        this.foo = 'bar';
        this.bar = function(){
            return 'foo';
        };
    }

    set name(value){

        //console.log('Concrete name set', value);

        this._name = value;
    }

    get name(){

        //console.log('Concrete name get');

        return this._name;
    }

    sayHi(){

        //console.log('Concrete sayHi');

        return 'Hi ' + this.name;
    }

    sayHallo(name){
        //console.log('Concrete sayHallo', name);

        return 'Hallo ' + name;
    }
}