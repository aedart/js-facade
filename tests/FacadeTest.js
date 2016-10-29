'use strict';

import Facade from '../src/Facade';
import Concrete from './helpers/Concrete';
import IoC from '@aedart/js-ioc';
import faker from 'faker';

describe('Facade', function(){

    beforeEach(function(){
        Facade.ioc = IoC;
    });

    afterEach(function(){
        IoC.flush();

        Facade.ioc = null;
        Facade.clearResolvedInstances();
    });

    /*****************************************************************
     * Helpers
     ****************************************************************/

    /**
     * Abstract identifier
     *
     * @type {string}
     */
    const concreteIdentifier = '@myConcrete';

    /**
     * Returns a new concrete class
     * @return {Concrete}
     */
    const makeConcreteClass = () => {
        return new Concrete();
    };

    /**
     * Returns a concrete facade
     *
     * @return {ConcreteFacade}
     */
    const makeConcreteFacade = () => {
        class ConcreteFacade extends Facade {
            constructor(){
                super(concreteIdentifier);
            }
        }

        return new ConcreteFacade();
    };

    /*****************************************************************
     * Actual tests
     ****************************************************************/

    it('can set and get ioc instance', function(){
        // Reset before
        Facade.ioc = null;

        let dummyIoC = {};

        Facade.ioc = dummyIoC;

        expect(Facade.ioc).toBe(dummyIoC);
    });

    it('fails when attempting to create Facade instance', function(){
       let f = () => {
           return new Facade('foo');
       };

       expect(f).toThrowError(TypeError);
    });

    it('set and get facade accessor', function(){
        class DummyFacade extends Facade {
            constructor(){
                super('dummy');
            }
        }

        let dummy = new DummyFacade();

        expect(dummy.facadeAccessor).toBe('dummy');
    });

    it('can resolve instances', function(){

        class A {}

        let alpha = new A();
        let key = 'alpha';

        IoC.bind(key, () => {
           return alpha;
        });

        let result = Facade.resolveFacadeInstance(key);

        //console.log('Resolved Facade Instance for "' + key + '"', result);

        expect(result).toBe(alpha);
    });

    /*****************************************************************
     * The proxy tests
     ****************************************************************/

    describe('Facade Proxy Handler', function(){

        it('can obtain facade root', function(){
            IoC.singleton(concreteIdentifier, makeConcreteClass);
            let facade = makeConcreteFacade();

            let fromIoC = IoC.make(concreteIdentifier);

            let result = facade.facadeRoot;

            expect(result instanceof Concrete).toBe(true, 'Incorrect proxy');
            expect(result).toBe(fromIoC, 'Incorrect instance');
        });

        it('can proxy property', function(){
            IoC.bind(concreteIdentifier, makeConcreteClass);
            let facade = makeConcreteFacade();

            let name = faker.name.findName();
            facade.name = name;

            let result = facade.name;

            expect(result).toBe(name);
        });

        it('can proxy dynamic property', function(){
            IoC.bind(concreteIdentifier, makeConcreteClass);
            let facade = makeConcreteFacade();

            let result = facade.foo;

            expect(result).toBe('bar');
        });

        it('can proxy method', function(){
            IoC.bind(concreteIdentifier, makeConcreteClass);
            let facade = makeConcreteFacade();

            let name = faker.name.findName();
            facade.name = name;

            let result = facade.sayHi();

            expect(result).toBe('Hi ' + name);
        });

        it('can proxy method with args', function(){
            IoC.bind(concreteIdentifier, makeConcreteClass);
            let facade = makeConcreteFacade();

            let name = faker.name.findName();
            let result = facade.sayHallo(name);

            expect(result).toBe('Hallo ' + name);
        });

        it('can proxy dynamic method', function(){
            IoC.bind(concreteIdentifier, makeConcreteClass);
            let facade = makeConcreteFacade();

            let result = facade.bar();

            expect(result).toBe('foo');
        });
    });
});