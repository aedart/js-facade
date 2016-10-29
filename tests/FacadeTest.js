'use strict';

import Facade from '../src/Facade';
import Concrete from './helpers/Concrete';
import ConcreteFacade from './helpers/ConcreteFacade';
import { identifier } from './helpers/ConcreteFacade';
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
     * Returns a new concrete class
     * @return {Concrete}
     */
    const makeConcreteClass = () => {
        return new Concrete();
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

        expect(Facade.hasResolvedInstance(key)).toBe(true);
        expect(result).toBe(alpha);
    });

    it('can clear a resolved instance', function(){
        class A {}

        let alpha = new A();
        let key = 'alpha';

        IoC.bind(key, () => {
            return alpha;
        });

        // First resolve, then clear it
        Facade.resolveFacadeInstance(key);
        Facade.clearResolvedInstance(key);

        //console.log('Resolved Facade Instance for "' + key + '"', result);

        expect(Facade.hasResolvedInstance(key)).toBe(false);
    });

    /*****************************************************************
     * The proxy tests
     ****************************************************************/

    describe('Facade Proxy Handler', function(){

        it('can obtain facade root', function(){
            IoC.singleton(identifier, makeConcreteClass);

            let fromIoC = IoC.make(identifier);

            let result = ConcreteFacade.facadeRoot;

            expect(result instanceof Concrete).toBe(true, 'Incorrect proxy');
            expect(result).toBe(fromIoC, 'Incorrect instance');
        });

        it('can proxy property', function(){
            IoC.bind(identifier, makeConcreteClass);

            let name = faker.name.findName();
            ConcreteFacade.name = name;

            let result = ConcreteFacade.name;

            expect(result).toBe(name);
        });

        it('can proxy dynamic property', function(){
            IoC.bind(identifier, makeConcreteClass);

            let result = ConcreteFacade.foo;

            expect(result).toBe('bar');
        });

        it('can proxy method', function(){
            IoC.bind(identifier, makeConcreteClass);

            let name = faker.name.findName();
            ConcreteFacade.name = name;

            let result = ConcreteFacade.sayHi();

            expect(result).toBe('Hi ' + name);
        });

        it('can proxy method with args', function(){
            IoC.bind(identifier, makeConcreteClass);

            let name = faker.name.findName();
            let result = ConcreteFacade.sayHallo(name);

            expect(result).toBe('Hallo ' + name);
        });

        it('can proxy dynamic method', function(){
            IoC.bind(identifier, makeConcreteClass);

            let result = ConcreteFacade.bar();

            expect(result).toBe('foo');
        });
    });
});