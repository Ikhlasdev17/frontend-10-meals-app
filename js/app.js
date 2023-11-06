const productsEl = document.querySelector('#products')
const cartCountEl = document.querySelector('#cart-count')
const titleEl = document.querySelector('#title')
const basketEl = document.querySelector('#basket')
const cartBtnEl = document.querySelector('#cart-toggler')
const emptyBasketEl = document.querySelector('#empty-basket')
const searchFormEl = document.querySelector('#search-form')
const searchInputEl = document.querySelector('#search-input')
const statusEl = document.querySelector('#status')

let products = []
let cartProducts = []

function fetchProducts(mealName) {
	fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
		.then(res => res.json())
		.then(data => {
			console.log(data.meals)
			renderMeals(data.meals)
			products = data.meals
		})
		.catch(error => console.log(error))
}

function renderMeals(meals) {
	if (!meals) {
		reloadFetchProducts()
	} else {
		statusEl.innerHTML = ''
	}

	productsEl.innerHTML = ''
	meals.map(item => {
		const currItemIsBasket = cartProducts.find(
			cartItem => cartItem.idMeal === item.idMeal
		)

		productsEl.innerHTML += `
      <div class='p-3 rouned-md bg-white shadow-md border relative'>
			<div class="px-2 py-1 text-xl rounded-md bg-slate-300  absolute top-2 right-[50px] ${
				currItemIsBasket ? 'block' : 'hidden'
			}">${currItemIsBasket?.count}</div>
			<button onclick="addToCart('${
				item.idMeal
			}')" class='px-2 py-1 text-xl rounded-md bg-orange-500 text-white absolute top-2 right-2 '><i
            class='bx bx-cart-add ${
							currItemIsBasket && 'bx-plus'
						}'></i></button>
        <img class='w-full h-[230px] rounded-md mb-2 object-cover' src='${
					item.strMealThumb
				}'>
        <h2>${item.strMeal}</h2>
      </div>
    `
	})
}

function addToCart(idMeal) {
	const product = products.find(item => item.idMeal === idMeal)

	if (!cartProducts.find(item => item.idMeal === idMeal)) {
		cartProducts.unshift({
			...product,
			count: 1,
		})
	} else {
		cartProducts = cartProducts.map(item => {
			if (item.idMeal === idMeal) {
				return {
					...item,
					count: item.count + 1,
				}
			} else {
				return item
			}
		})
	}

	changeCartCount()
	renderBasketProducts()
	renderMeals(products)
}

function changeCartCount() {
	cartCountEl.innerHTML = cartProducts.length
}

function changeScreenType(type) {
	titleEl.innerHTML = type
	cartBtnEl.querySelector('i').classList.toggle('bx-x')

	if (type === 'products') {
		productsEl.style.display = 'grid'
		basketEl.style.display = 'none'
		emptyBasketEl.classList.add('hidden')
	} else {
		basketEl.style.display = 'grid'
		productsEl.style.display = 'none'
		showOrHideEmptyBasketStatus()
	}
}

function renderBasketProducts() {
	basketEl.innerHTML = ''
	cartProducts.map(item => {
		basketEl.innerHTML += `
			<div class='p-3 rouned-md bg-white shadow-md border relative'>
			<div class="flex gap-2 absolute right-2 top-2">
			<button onclick="deleteProductFromBasket('${item.idMeal}')" class='px-2 py-1 text-xl rounded-md bg-orange-500 text-white  '><i
					class='bx bx-trash'></i></button>
			<button onclick="removeProductFromBasket('${item.idMeal}')" class='px-2 py-1 text-xl rounded-md bg-orange-500 text-white  '><i
					class='bx bx-minus'></i></button>
			
			<div class="px-2 py-1 text-xl rounded-md bg-slate-300   ">${item.count}</div>
			
			<button onclick="addToCart('${item.idMeal}')" class='px-2 py-1 text-xl rounded-md bg-orange-500 text-white  '><i
					class='bx bx-plus'></i></button></div>
			<img class='w-full h-[230px] rounded-md mb-2 object-cover' src='${item.strMealThumb}'>
			<h2>${item.strMeal}</h2>
		</div>
		`
	})
}

function removeProductFromBasket(idMeal) {
	const currProduct = cartProducts.find(x => x.idMeal === idMeal)

	if (currProduct.count === 1) {
		deleteProductFromBasket(idMeal)
	} else {
		cartProducts = cartProducts.map(item => {
			if (item.idMeal === idMeal) {
				return {
					...item,
					count: item.count - 1,
				}
			} else {
				return item
			}
		})
	}

	renderBasketProducts()
	changeCartCount()
	renderMeals(products)
	showOrHideEmptyBasketStatus()
}

function deleteProductFromBasket(idMeal) {
	cartProducts = cartProducts.filter(item => item.idMeal !== idMeal)
	renderBasketProducts()
	renderMeals(products)
	changeCartCount()
	showOrHideEmptyBasketStatus()
}

function showOrHideEmptyBasketStatus() {
	if (cartProducts.length === 0) {
		emptyBasketEl.classList.remove('hidden')
	} else {
		emptyBasketEl.classList.add('hidden')
	}
}

let interval

const clearCountdowner = () => {
	clearInterval(interval)
	fetchProducts('Beef')
	searchInputEl.value = ''
}

function reloadFetchProducts() {
	let count = 5

	statusEl.innerHTML = `Products with name <span class="underline">${searchInputEl.value}</span> not found! <span onclick="clearCountdowner()" class="px-2 py-1 rounded-md cursor-pointer bg-orange-200 hover:bg-orange-300 whitespace-nowrap	">reload after ${count}s</span>`

	interval = setInterval(() => {
		count -= 1
		statusEl.innerHTML = `Products with name <span class="underline">${searchInputEl.value}</span> not found! <span onclick="clearCountdowner()" class="px-2 py-1 rounded-md cursor-pointer bg-orange-200 hover:bg-orange-300 whitespace-nowrap	">reload after ${count}s</span>`
	}, 1000)

	setTimeout(() => {
		clearCountdowner()
	}, 5000)
}

cartBtnEl.addEventListener('click', () => {
	changeScreenType(titleEl.innerHTML === 'basket' ? 'products' : 'basket')
})

searchFormEl.addEventListener('submit', e => {
	e.preventDefault()
	fetchProducts(searchInputEl.value)
})

fetchProducts('Beef')
