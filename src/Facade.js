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
 * Resolved instances
 *
 * @type {Map<string, object>}
 * @private
 */
let _resolvedInstances = new Map();

/**
 * @description Abstract Facade class
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class Facade {

    /**
     * @constructor
     *
     * @param {string} accessor
     *
     * @return {Proxy}
     *
     * @throws {TypeError} Abstract class
     */
    constructor(accessor){
        if(new.target === Facade){
            throw new TypeError('Cannot create Facade instance, class is abstract');
        }

        // Set accessor
        this.facadeAccessor = accessor;

        // Return facade proxy
        return new Proxy(this, Facade.makeFacadeProxy());
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
            this[_facadeRoot] = this.constructor.resolveFacadeInstance(this.facadeAccessor);
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
     * @param {string} name
     *
     * @return {Object}
     *
     * @throws {BindingException}
     * @throws {BuildException}
     */
    static resolveFacadeInstance(name){
        if(Facade.hasResolvedInstance(name)){
            return _resolvedInstances.get(name);
        }

        let resolvedInstance = Facade.ioc.make(name);

        _resolvedInstances.set(name, resolvedInstance);

        return resolvedInstance;
    }

    /**
     * Check if Facade has a resolved instance
     *
     * @param {string} name
     *
     * @return {boolean}
     */
    static hasResolvedInstance(name){
        return _resolvedInstances.has(name);
    }

    /**
     * Clear a resolved instance from the Facade
     *
     * @param {string} name
     */
    static clearResolvedInstance(name){
        _resolvedInstances.delete(name);
    }

    /**
     * Clear all resolved instances
     */
    static clearResolvedInstances(){
        _resolvedInstances.clear();
    }

    /**
     * Returns a new proxy handler
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler
     *
     * @return {object}
     */
    static makeFacadeProxy(){
        return {

            set : function(facade, property, value){
                // Set eventual property on facade, provided that
                // it exists in the facade.
                if (property in facade && property != 'name') {
                    return facade[property] = value;
                }

                // Set the property on the facade root.
                let facadeRoot = facade.facadeRoot;

                return facadeRoot[property] = value;
            },

            get: function(facade, property) {
                // Check if method or property exists in the facade.
                // If so, then it must be returned;
                if (property in facade && property != 'name') {
                    return facade[property];
                }

                // If the property was not in the facade, then we must attempt
                // to get it from the facade root.
                let facadeRoot = facade.facadeRoot;

                // Otherwise, we attempt to just return the property
                return facadeRoot[property];
            },
        };
    }
}

export default Facade;