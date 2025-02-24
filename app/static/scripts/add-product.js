import { fetchData, postData } from "./helpers.js"

const submitBtn = document.querySelector('#submit-btn')
const categoryMenuEl = document.querySelector('#category')
const warningMsgEl = document.querySelector('#warning-message')
const productCodeInput = document.querySelector('#product-code')
const productDescriptionInput= document.querySelector('#description')
const unitPriceInput= document.querySelector('#unit-price')

const loadCategories = async () => {
    const categoryApiUrl = 'http://127.0.0.1:8001/api/category/'
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
            defaultOption.selected = true 
            
            categoryMenuEl.appendChild(defaultOption)

            categoryData.forEach(({name, id}) => {
                const menuOption = document.createElement('option')
                
                menuOption.value = id
                menuOption.textContent = name

                categoryMenuEl.appendChild(menuOption)
            })


            
        }
        
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
    }
}

const limitDecimal = () => {
    let value = parseFloat(unitPriceInput.value)
    if (!isNaN(value)) {
        unitPriceInput.value = value.toFixed(2)
    }
}

const validateForm = async (productCode, productDescription, unitPrice, category) => {
    // Clear validation problems
    let isValid = true
    const productsApiUrl = 'http://127.0.0.1:8001/api/products/'

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
        } else if (!category) {
            warningMsgEl.textContent = 'Must choose a category '
            categoryMenuEl.classList.add('is-invalid')
            isValid = false
        }

        // check if product code already in use
        const productData = await fetchData(productsApiUrl)

        if (productData.length > 0) {
            productData.forEach(({product_code})=>{
                if (product_code == productCode) {
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
                category_id: category,
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
    const cateogoryVal = categoryMenuEl.value.trim()

    const validData = await validateForm(productCodeVal, productDescriptionVal, unitPriceVal, cateogoryVal)

    const productsApiUrl = 'http://127.0.0.1:8001/api/products/add'
    
    const postedData = await postData(productsApiUrl, validData)

    if (postedData) {
        window.location.href = '/products'
    }

    // redirect to all products
}

loadCategories()

submitBtn.addEventListener('click', onSubmission)
unitPriceInput.addEventListener('blur', limitDecimal)
