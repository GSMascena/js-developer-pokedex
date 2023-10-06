
// model of a Pokemon
class Pokemon {
    id;
    name;
    mainType;
    types = [];
    photo;
}

// Detailed model of a Pokemon
class PokemonDetailed extends Pokemon {
    species = class {
        speciesName;
        eggGroups;
    };
    height;
    weight;
    abilities = [];
    baseStats = [];
    nextEvolution;
    prevEvolution;
    moves = [];
    evolutionChain = class {
        evolvesTo = [];
        evolvedFrom = [];
    };
}

// Object used to create an array of stats of the pokemon
class PokeStat {
    name;
    value;
}
