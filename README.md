# Js Facade

Static interface to concrete classes via an [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) Service Container.

Before you continue reading, you should know that this package is heavily inspired by [Taylor Otwell's](https://github.com/taylorotwell) [Facades](https://laravel.com/docs/master/facades) in [Laravel](https://laravel.com/).
Please go read the documentation, to gain a better understanding of what facades are and how they are intended to work.

## Contents

* [How to install](#how-to-install)
* [Quick start](#quick-start)
  * [Set the IoC instance](#set-the-ioc-instance)
  * [Create a facade](#create-a-facade)
  * [Using your facade](#using-your-facade)
* [Contribution](#contribution)
* [Acknowledgement](#acknowledgement)
* [Versioning](#versioning)
* [License](#license)


## How to install

```console
npm install @aedart/js-facade
```

## Quick start

### Set the IoC instance

The Facade requires an [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) Service Container instance, so that it can resolve the facade's accessor (a string identifier) and obtain a concrete class instance. 

There is no check of kind of IoC implementation you should use. But, your IoC is required to have a `make` method; 

**Required Make method**

```javascript
/**
 * Resolve the registered abstract from the container
 * 
 * @param {string} abstract
 * @param {Array.<*>} [parameters]
 * 
 * @return {Object}
 * 
 * @throw {Error}
 */
function make(abstract, parameters = []){
    // ... not shown ... //
};
```

Whenever the make method is invoked, the facade assumes that the IoC is able to return a concrete instance or fail. 

As long as your desired IoC has such a method, you can use this facade. Alternatively, you can use my [`@aedart/js-ioc`](https://www.npmjs.com/package/@aedart/js-ioc) package.

**Setting IoC instance on Facade**

```javascript
import Facade from '@aedart/js-facade';
import IoC from '@aedart/js-ioc';

// Somewhere in you bootstrap / setup logic, set the IoC on the Facade
Facade.ioc = IoC;
```

### Create a facade

Given that you have a concrete class, and that you somehow have registered (bound) an instance to it in your IoC;

**A simple Box class**

```javascript
'use strict';

class Box {
    set width(value){
        // ... not shown .../
    }
    
    get width(){
        // ... not shown .../
    }

    set height(value){
        // ... not shown .../
    }
    
    get height(){
        // ... not shown .../
    }
}

export default Box;
```

**A facade for the Box class**

```javascript
'use strict';

import Facade from '@aedart/js-facade';

class BoxFacade extends Facade {
    constructor(){
        // Accessor - MUST match the identifier you used to
        // register your Box with, in your IoC.
        super('my-box-identifier');
    }
}

// You MUST export a initialised instance of this facade.
export default new BoxFacade();
```

Behind the scene, a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) is used by the facade to trap method calls. Those traps ensure to invoke the correct methods on the concrete class, via the IoC Service Container.

### Using your facade

Whenever you need to use your concrete class, via a facade, you simply just import it and invoke the methods or properties that you require from it. 

**Using BoxFacade**

```javascript
'use strict';

import BoxFacade from './src/Facades/BoxFacade'; // Location where you stored your BoxFacade...

// ... somewhere in your application or inside a component ... //

BoxFacade.width = 25;
BoxFacade.height = 50;

console.log(BoxFacade.width, BoxFacade.height); // Output 25, 50 

```

## Contribution

Have you found a defect ( [bug or design flaw](https://en.wikipedia.org/wiki/Software_bug) ), or do you wish improvements? In the following sections, you might find some useful information
on how you can help this project. In any case, I thank you for taking the time to help me improve this project's deliverables and overall quality.

### Bug Report

If you are convinced that you have found a bug, then at the very least you should create a new issue. In that given issue, you should as a minimum describe the following;

* Where is the defect located
* A good, short and precise description of the defect (Why is it a defect)
* How to replicate the defect
* (_A possible solution for how to resolve the defect_)

When time permits it, I will review your issue and take action upon it.

### Fork, code and send pull-request

A good and well written bug report can help me a lot. Nevertheless, if you can or wish to resolve the defect by yourself, here is how you can do so;

* Fork this project
* Create a new local development branch for the given defect-fix
* Write your code / changes
* Create executable test-cases (prove that your changes are solid!)
* Commit and push your changes to your fork-repository
* Send a pull-request with your changes
* _Drink a [Beer](https://en.wikipedia.org/wiki/Beer) - you earned it_ :)

As soon as I receive the pull-request (_and have time for it_), I will review your changes and merge them into this project. If not, I will inform you why I choose not to.

## Acknowledgement

* [Taylor Otwell](https://github.com/taylorotwell), for his [Facade](https://laravel.com/docs/master/facades) implementation

## Versioning

This package follows [Semantic Versioning 2.0.0](http://semver.org/)

## License

[BSD-3-Clause](http://spdx.org/licenses/BSD-3-Clause), Read the LICENSE file included in this package