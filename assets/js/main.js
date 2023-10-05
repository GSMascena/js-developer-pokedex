const pokemonList = document.getElementById('pokemonList')
const pokemonPage = document.getElementById('pokePage')
const pokedex = document.getElementById('pokedex')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

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

function convertPokemonToPage(pokemon) {
    return `
        <button id="returnButton" type="button" onclick="returnToPokedex()">
            Retorno
        </button>
        <h1>${pokemon.name}</h1>
        <span>#${pokemon.id}</span>
        <ol>
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name} Photo">

        <nav>
            <ul>
                <li>
                    About
                </li>
                <li>
                    Base Stats
                </li>
                <li>
                    Evolution
                </li>
                <li>
                    Moves
                </li>
            </ul>
        </nav>

        <table>
            <td>
                Height
            <td>
            <td>
                ${pokemon.height}
            <td>
            <td>
                Weight
            <td>
            <td>
                ${pokemon.weight}
            <td>
        </table>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

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

function returnToPokedex () {
    pokemonPage.style.display = "none"
    pokedex.style.display = "block"
    pokemonPage.innerHTML = ""
}

function showPokePage (pokeId) {
    pokeApi.getPokemonById(pokeId)
        .then((pokemon) => {
            const newHtml = convertPokemonToPage(pokemon)
            pokemonPage.innerHTML += newHtml
            pokemonPage.style.display = "block"
            pokedex.style.display = "none"
        })
}
