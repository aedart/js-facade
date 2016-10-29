'use strict';

/**
 * IoC Service Container
 *
 * @typedef {Object} IoC
 */

/**
 * Binding Exception
 *
 * Throw this exception whenever a binding is invalid
 *
 * @typedef {Error} BindingException
 */

/**
 * Build Exception
 *
 * Throw this exception whenever a binding could not be built
 *
 * @typedef {Error} BuildException
 */

/**
 * Resolve the registered abstract from the container
 *
 * @function
 * @name IoC#make
 * @param {string} abstract
 * @param {Array} [parameters]
 *
 * @returns {object}
 *
 * @throws {BindingException}
 * @throws {BuildException}
 */

/**
 * IoC Service Container instance
 *
 * @type {IoC}
 *
 * @private
 */
let _iocInstance = null;

/**
 * Facade Accessor symbol
 *
 * @type {Symbol}
 * @private
 */
const _facadeAccessor = Symbol('facade-accessor');

/**
 * Facade Root symbol
 *
 * @type {Symbol}
 * @private
 */
const _facadeRoot = Symbol('facade-root');

/**
 * Facade
 *
 * @description Abstract Facade class
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
export default class Facade {

    constructor(accessor){
        if(new.target === Facade){
            throw new TypeError('Cannot create Facade instance, class is abstract');
        }

        // Set accessor
        this.facadeAccessor = accessor;

        // Return facade proxy
        return new Proxy(this, this.makeFacadeProxy());
    }

    /**
     * Set the facade accessor
     *
     * @param {string|null} accessor
     */
    set facadeAccessor(accessor){
        this[_facadeAccessor] = accessor;
    }

    /**
     * Get the facade accessor
     *
     * @return {string|null}
     */
    get facadeAccessor(){
        if(this[_facadeAccessor] == undefined){
            this.facadeAccessor = null;
        }

        return this[_facadeAccessor];
    }

    /**
     * Get the instance behind this facade
     *
     * @return {object}
     *
     * @throws {BindingException}
     */
    get facadeRoot(){
        if(this[_facadeRoot] == undefined){
            this[_facadeRoot] = this.resolveFacadeInstance();
        }

        return this[_facadeRoot];
    }

    /**
     * Set the IoC Service Container
     *
     * @param {IoC} container
     */
    static set ioc(container){
        _iocInstance = container;
    }

    /**
     * Get the IoC Service Container
     *
     * @return {IoC}
     */
    static get ioc(){
        return _iocInstance;
    }

    /**
     * Resolve the facade root, based on the accessor
     *
     * @return {Object}
     *
     * @throws {BindingException}
     * @throws {BuildException}
     */
    resolveFacadeInstance(){
        return this.constructor.ioc.make(this.facadeAccessor);
    }

    /**
     * Returns a new proxy handler
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler
     *
     * @return {object}
     */
    makeFacadeProxy(){

        return {

            // TODO: apply?
            // apply: function(facade, thisArg, argumentsList) {
            //     let insteance = facade.facadeRoot;
            //
            //     insteance[]
            // },

            // set : function(facade, property, value, receiver){
            //     // TODO: what if facade method invoked?
            //
            //     let instance = facade.facadeRoot;
            //
            //     instance[property].apply()
            // },

            get: function(facade, property, receiver) {
                // TODO: what if facade method invoked?

                let instance = facade.facadeRoot;

                if(typeof instance[property] === 'function'){
                    return (...args) => {
                        return instance[property].apply(this, args);
                    }
                }

                // TODO: Must be a property then
            },
            //
            // has: function(facade, prop) {
            //
            // },
            //
            // ownKeys: function(facade) {
            //
            // },


        };
    }
}