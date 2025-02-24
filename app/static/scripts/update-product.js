import { fetchData, updateData } from "./helpers.js"

const submitBtn = document.querySelector('#submit-btn')

const categoryMenuEl = document.querySelector('#category')
const warningMsgEl = document.querySelector('#warning-message')
const productCodeInput = document.querySelector('#product-code')
const productDescriptionInput= document.querySelector('#description')
const unitPriceInput= document.querySelector('#unit-price')

const urlParams = window.location.pathname.split('/')
const productId = urlParams[3]

const loadCategories = async () => {
    const categoryApiUrl = 'http://127.0.0.1:8001/api/category/?limit=0'
    warningMsgEl.textContent = '' 

    //remove warning 

    try {
        const categoryData = await fetchData(categoryApiUrl)

        if (categoryData.length > 0) {
            categoryMenuEl.innerHTML = ``
            
            const defaultOption = document.createElement('option')
            defaultOption.value = ''
            defaultOption.disabled = true
            defaultOption.textContent = 'Select a Category'
            defaultOption.selected = false 
            
            categoryMenuEl.appendChild(defaultOption)

            categoryData.forEach(({name, id}) => {
                const menuOption = document.createElement('option')
                
                menuOption.id = `category-${id}`
                menuOption.value = id
                menuOption.textContent = name

                categoryMenuEl.appendChild(menuOption)
            })

            loadProductInfo()
            
        }
        
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
    }
}

const loadProductInfo = async () => {
    const productsApiUrl = `http://127.0.0.1:8001/api/products/${productId}`

    try {
        const { product_code, description, unit_price, categories } = await fetchData(productsApiUrl)
        // const targetCategoryOption = document.querySelector(`#category-${category_id}`)
        
        productCodeInput.value = product_code
        productDescriptionInput.value = description 
        unitPriceInput.value = unit_price 

        categories.forEach((category) => {
            const targetCategoryOption = document.querySelector(`#category-${category.id}`)
            targetCategoryOption.selected = true
        })
        
    } catch (error) {
        console.error('There was an error finding target product:', error)        
    }


}

const limitDecimal = () => {
    let value = parseFloat(unitPriceInput.value)
    if (!isNaN(value)) {
        unitPriceInput.value = value.toFixed(2)
    }
}

const validateForm = async (productId, productCode, productDescription, unitPrice, categoryArr) => {
    // Clear validation problems
    let isValid = true
    const productsApiUrl = 'http://127.0.0.1:8001/api/products/?limit=0'

    productCodeInput.classList.remove('is-invalid')
    productDescriptionInput.classList.remove('is-invalid')
    unitPriceInput.classList.remove('is-invalid')
    categoryMenuEl.classList.remove('is-invalid')


    // if no input --> return & show message
    
    try {
        if (!productCode) {
            warningMsgEl.textContent = 'Product code cannot be empty'
            productCodeInput.classList.add('is-invalid')
            isValid = false
        } else if (!productDescription) {
            warningMsgEl.textContent = 'Product description cannot be empty'
            productDescriptionInput.classList.add('is-invalid')
            isValid = false
            // invalid form styles from boostrap on productDescriptionInput
        } else if (!unitPrice) {
            warningMsgEl.textContent = 'Unit price cannot be empty'
            unitPriceInput.classList.add('is-invalid')
            isValid = false
        } else if (categoryArr.length === 0) {
            warningMsgEl.textContent = 'Must choose a category '
            categoryMenuEl.classList.add('is-invalid')
            isValid = false
        }

        // check if product code already in use
        const productData = await fetchData(productsApiUrl)

        if (productData.length > 0) {
            productData.forEach(({product_code, id})=>{
                if (product_code == productCode & productId != id) {
                    warningMsgEl.textContent = `Product with code ${productCode} already exists.`
                    productCodeInput.classList.add('is-invalid')
                    isValid = false
                }
            })

        }
        
        if (isValid) {
            warningMsgEl.textContent = ''
            productCodeInput.classList.remove('is-invalid')
            productDescriptionInput.classList.remove('is-invalid')
            unitPriceInput.classList.remove('is-invalid')
            categoryMenuEl.classList.remove('is-invalid')

            return {
                product_code: productCode,
                description: productDescription,
                unit_price: unitPrice,
                category_ids: categoryArr,
            }
        }


    } catch (error) {
        warningMsgEl = 'There was an error validating new product'
        console.error('Error fetching product data:', error)
        
    }
    
}

const onSubmission = async (e) => {
    e.preventDefault()

    const productCodeVal = productCodeInput.value.trim()
    const productDescriptionVal = productDescriptionInput.value.trim()
    const unitPriceVal = unitPriceInput.value.trim()
    const selectedCategoryOptions = Array.from(categoryMenuEl.selectedOptions)
    const selectedCategoryValues = selectedCategoryOptions.map(category => category.value)

    const validData = await validateForm(productId, productCodeVal, productDescriptionVal, unitPriceVal, selectedCategoryValues)

    // console.log(validData)

    const patchedData = await updateData(productId, validData)

    if (patchedData) {
        window.location.href = '/products'
    }

}

console.log('yeye')

loadCategories()

submitBtn.addEventListener('click', onSubmission)
unitPriceInput.addEventListener('blur', limitDecimal)