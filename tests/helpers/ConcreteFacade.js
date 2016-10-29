
import Facade from '../../src/Facade';

export const identifier = '@myConcrete';

/**
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class ConcreteFacade extends Facade {
    constructor(){
        super(identifier);
    }
}

export default new ConcreteFacade();