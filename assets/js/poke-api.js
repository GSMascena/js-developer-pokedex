
const pokeApi = {}

// creates a Pokemon receiving the object and details json
function createPokemon(pokemon, pokeDetail) {
    pokemon.id = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [mainType] = types

    pokemon.types = types
    pokemon.mainType = mainType

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon
}

// creates a Pokemon model for HTML manipulation
function convertPokeApiDetailToPokemon(pokeDetail) {
    return createPokemon(new Pokemon(), pokeDetail)
}

// creates a PokemonDetailed model for HTML manipulation
function convertPokeApiDetailToDetailedPokemon(pokeDetail, pokeSpecies, pokeEvolutionChain){
    const pokemon = createPokemon(new PokemonDetailed(), pokeDetail)

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    pokemon.abilities = pokeDetail.abilities.map((ability) => ability.ability.name)
    pokemon.baseStats = pokeDetail.stats.map((stat) => {
        const pokeStat =  new PokeStat()
        pokeStat.name = stat.stat.name
        pokeStat.value = stat.base_stat
        return pokeStat
    })
    pokemon.moves = pokeDetail.moves.map((move) => move.move.name)

    pokemon.species.speciesName = pokeSpecies.name

    pokemon.species.eggGroups = pokeSpecies.egg_groups.map((eggGroup) => eggGroup.name)

    let evolutionChain = pokeEvolutionChain.chain
    
    function findPokemonInEvolutionChain(pokePrev, pokeName, pokeChain) {
        if (pokeChain.length > 0){
            for (const evolutionIndex in pokeChain) {
                if (pokeName == pokeChain[evolutionIndex].species.name) {
                    return [pokePrev.species.name, pokeChain[evolutionIndex].evolves_to.map((evolution) => evolution.species.name)]
                }
                findPokemonInEvolutionChain(pokeChain, pokeName, pokeChain[evolutionIndex].evolves_to)
            }
        }
        return []
    }

    if (evolutionChain.species.name == pokemon.name) {
        pokemon.evolutionChain.evolvedFrom = []
        pokemon.evolutionChain.evolvesTo = evolutionChain.evolves_to.map((evolution) => evolution.species.name)
    } else {
        [pokemon.evolutionChain.evolvedFrom, 
            pokemon.evolutionChain.evolvesTo] = 
                findPokemonInEvolutionChain(evolutionChain, pokemon.name, evolutionChain.evolves_to)
    }

    return pokemon
}

// querys the PokeApi for the detail json of a pokemon
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

// querys the PokeApi for the evolution chain json of a pokemon
pokeApi.getPokemonEvolution = (pokemonSpecies) => {

    return fetch(pokemonSpecies.evolution_chain.url)
        .then((response) => response.json())
}

// querys the PokeApi for the species json of a pokemon
pokeApi.getPokemonSpecies = (pokemon) => {

    return fetch(pokemon.species.url)
        .then((response) => response.json())
}

// main function used for pokemon list
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

// querys the PokeApi for a specific pokemon, using id
// this pokemon comes detailed with species and evolution info
pokeApi.getPokemonById = (pokeId) => {
    const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${pokeId}/`
    let pokeDetail
    let pokeSpecies

    return fetch(pokeUrl)
        .then((response) => response.json())
        .then((pokemon) => {
            pokeDetail = pokemon
            return pokeApi.getPokemonSpecies(pokemon)
        })
        .then((species) => {
            pokeSpecies = species
            return pokeApi.getPokemonEvolution(species)
        })
        .then((pokeEvolution) => convertPokeApiDetailToDetailedPokemon(pokeDetail, pokeSpecies, pokeEvolution)) 
}

