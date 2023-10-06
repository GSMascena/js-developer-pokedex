const pokemonList = document.getElementById('pokemonList')
const pokePageSection = document.getElementById('pokePageSection')
const pokeHeader = document.getElementById('pokeHeader')
const pokeContent = document.getElementById('pokeContent')
const pokedexSection = document.getElementById('pokedexSection')
const loadMoreButton = document.getElementById('loadMoreButton')
const returnButton = document.getElementById('returnButton')
const aboutButton = document.getElementById('aboutButton')
const statsButton = document.getElementById('statsButton')
const evoButton = document.getElementById('evoButton')
const movesButton = document.getElementById('movesButton')
let currentPokemonId
let lastType

const maxRecords = 151
const limit = 10
let offset = 132;

// Converts the Pokemon model to Li HTML element
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.mainType}" onclick="showPokePage(${pokemon.id})">
            <span class="number">#${pokemon.id}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                    alt="${pokemon.name} Photo">
            </div>
        </li>
    `
}

// Converts the Pokemon model to pokeHeader HTML element
function convertPokemonToPokeHeader(pokemon) {
    return `
    <h1 class="name">${pokemon.name}</h1>
    <span class="number">#${pokemon.id}</span>
    <ol class="types">
        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
    </ol>
    <img src="${pokemon.photo}" alt="${pokemon.name} Photo">
    `
}

// Converts the Pokemon model to pokeContent HTML element
function convertPokemonToPokeAbout(pokemon) {
    return `
    <span class="pokeStat">
        Species
    </span>
    <span class="pokeStatValue">
        ${pokemon.species.speciesName}
    </span>
    <span class="pokeStat">
        Height
    </span>
    <span class="pokeStatValue">
        ${pokemon.height}
    </span>
    <span class="pokeStat">
        Weight
    </span>
    <span class="pokeStatValue">
        ${pokemon.weight}
    </span>
    <span class="pokeStat">
        Abilities
    </span>
    <span class="pokeStatValue">
        ${pokemon.abilities.map((ability) => ability.split('-').join(" "))}
    </span>
    <span class="pokeStatTitle">
        Breeding
    </span>
    <span class="pokeStat">
        Egg Groups
    </Span>
    <span class="pokeStatValue">
        ${pokemon.species.eggGroups}
    </Span>
    `
}

// Converts the Pokemon model to pokeContent HTML element
function convertPokemonToPokeBaseStats(pokemon) {
    return `
        <ul class="pokeStatList">
            ${pokemon.baseStats.map((pokeStat) => `<li class="pokeStat">${(pokeStat.name.split("-").join(" "))}</li>
                                                <li class="pokeStatValue">${pokeStat.value}</li>`).join('')}
        </ul>
    `
}

// Converts the Pokemon model to pokeContent HTML element
function convertPokemonToPokeEvolution(pokemon) {
    console.log(pokemon.evolutionChain.evolvedFrom)
    return `
        <ul class="pokeEvolutionList">
            <span class="pokePrevEvolution">
            <h2 class="pokeEvolutionTitle">Evolved From</h2>
            ${pokemon.evolutionChain.evolvedFrom}
            </span>
            
            
            <ul class="pokeNextEvolution">
                <li> <h2 class="pokeEvolutionTitle">Evolves To</h2> </li>
                ${pokemon.evolutionChain.evolvesTo.map((evolvesTo) => `<li class="pokeStatValue">${evolvesTo}</li>`).join('')}
            </ul>
        </ul>
    `
}

// Converts the Pokemon model to pokeContent HTML element
function convertPokemonToPokeMoves(pokemon) {
    return `
        <ul class="pokeStatList">
            ${pokemon.moves.map((move) => `<li class="pokeMove">${(move.split("-")).join(" ")}</li>`).join('')}
        </ul>
    `
}

// Load the Pokemons from the PokeApi
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

// First loading of the page
loadPokemonItens(offset, limit)

// Load more pokemons in the pokemon list
loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Returns to the pokemon list
returnButton.addEventListener('click', () => {
    pokePageSection.style.display = "none"
    pokedexSection.style.display = "block"
    pokeHeader.innerHTML = ""
    pokeContent.innerHTML = ""
})

// Resets the selected element of the Pokemon page nav
function resetSelected () {
    aboutButton.classList.remove("selected")
    statsButton.classList.remove("selected")
    evoButton.classList.remove("selected")
    movesButton.classList.remove("selected")
}

// Switchs to about section of a pokemon
aboutButton.addEventListener('click', () => {
    pokeApi.getPokemonById(currentPokemonId)
    .then((pokemon) => {
        pokeContent.innerHTML = convertPokemonToPokeAbout(pokemon) 
    })
    resetSelected()
    aboutButton.classList.add("selected")
})

// Switchs to stats section of a pokemon
statsButton.addEventListener('click', () => {
    pokeApi.getPokemonById(currentPokemonId)
    .then((pokemon) => {
        pokeContent.innerHTML = convertPokemonToPokeBaseStats(pokemon) 
    })
    resetSelected()
    statsButton.classList.add("selected")
})

// Switchs to evolution section of a pokemon
evoButton.addEventListener('click', () => {
    pokeApi.getPokemonById(currentPokemonId)
    .then((pokemon) => {
        pokeContent.innerHTML = convertPokemonToPokeEvolution(pokemon) 
    })
    resetSelected()
    evoButton.classList.add("selected")
})

// Switchs to moves section of a pokemon
movesButton.addEventListener('click', () => {
    pokeApi.getPokemonById(currentPokemonId)
    .then((pokemon) => {
        pokeContent.innerHTML = convertPokemonToPokeMoves(pokemon) 
    })
    resetSelected()
    movesButton.classList.add("selected")
})

// Shows a pokemon page of a clicked pokemon
function showPokePage (pokeId) {
    pokeApi.getPokemonById(pokeId)
        .then((pokemon) => {
            pokePageSection.classList.remove(lastType)
            console.log(lastType)
            lastType = pokemon.mainType
            console.log(lastType)
            pokePageSection.classList.add(lastType)
            pokeHeader.innerHTML = convertPokemonToPokeHeader(pokemon)
            pokeContent.innerHTML = convertPokemonToPokeAbout(pokemon) 
            pokePageSection.style.display = "block"
            pokedexSection.style.display = "none"
            currentPokemonId = pokeId
            resetSelected()
            aboutButton.classList.add("selected")
        })
}
