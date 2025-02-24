import { fetchData } from './helpers.js';


const allProductsDiv = document.getElementById('all-product-list')
const titleTxt = document.getElementById('title')

const populateCategoryProducts = async () => {
    allProductsDiv.innerHTML = ''
    titleTxt.innerHTML = ''

    const urlParams = window.location.pathname.split('/')
    const categoryId = urlParams[2]


    const categoryProductsApiUrl = `http://127.0.0.1:8001/api/category/${categoryId}/products/`
    const categoryApiUrl = 'http://127.0.0.1:8001/api/category/'
    
    try{
        const productData = await fetchData(categoryProductsApiUrl)
        const categoryData = await fetchData(categoryApiUrl)
    
        if (productData.length > 0 && categoryData.length > 0) {
            productData.sort((a, b) => a.description.localeCompare(b.description))
            
            const targetCategory = categoryData.find(category => category.id == categoryId)

            titleTxt.innerHTML = `View All Products in ${targetCategory.name}`
    
            productData.forEach(({product_code, description, unit_price, categories, id}) => {
                const productCard = document.createElement('div')
    
    
                productCard.setAttribute('id', `product-${id}`)
                productCard.classList.add('card', 'p-3', 'd-flex', 'flex-row', 'justify-content-around', 'align-items-center', 'my-2')
    
                productCard.innerHTML = `
                    <div class='d-flex flex-column m-1'>
                        <h2 class='card-title product-description'>${description} - ${product_code}</h2>
                        <p class='card-subtitle text-body-secondary'>$${unit_price.toFixed(2)}</p>
                        <div id='product-${id}-category' class='d-flex flex-row align-items-center justify-content-start'>
                        </div>
                    </div>
                    <div class='d-flex'>
                        <a href='/products/update/${id}' class='btn btn-primary m-2'>Edit</a>
                        <button class='btn btn-danger m-2 del-btn' data-bs-toggle='modal' data-bs-target='#confirm-del-modal' data-product-id='${id}' data-product-description='${description}'>Delete</button>
                    </div>
                `
    
                allProductsDiv.appendChild(productCard)

                const categoryDiv = document.querySelector(`#product-${id}-category`)

                categories.forEach((category, index) => {
                    if (category.id == targetCategory.id) {
                        const categoryP = document.createElement('p')
                        categoryP.classList.add('mb-0')
                        if (index < categories.length - 1) {
                            categoryP.classList.add('me-2')
                            categoryP.textContent = `${category.name},`
                        } else {
                            categoryP.textContent = category.name
                        }
                        categoryDiv.appendChild(categoryP)
                    } else {
                        const categoryLink = document.createElement('a')
                        categoryLink.href=`/categories/${category.id}/products`
                        categoryLink.classList.add('link-offset-1', 'me-2', 'link-offset-2-hover', 'link-underline', 'link-underline-opacity-0', 'link-underline-opacity-75-hover')
                        
                        if (index < categories.length - 1) {
                            categoryLink.textContent = `${category.name},`
                        } else {
                            categoryLink.textContent = category.name
                        }
                        categoryDiv.appendChild(categoryLink)
                    }
                })

                const delBtn = productCard.querySelector('.del-btn')
                delBtn.addEventListener('click', () => {
                    const productId = delBtn.getAttribute('data-product-id')
                    const productDescription = delBtn.getAttribute('data-product-description')
                    createModal(productId, productDescription)
                })

            })
        } else {
            allProductsDiv.innerHTML = `<p>There are no products. Please <a href='/products/add-product' class='link-offset-1 link-offset-2-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'>add products</a> first to view them.</p`
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
        allProductsDiv.innerHTML = `<p>Failed to load products. Please try again later.</p>`
    }
}

// Creates modal & shows it
const createModal = (productId, productName) => {
    const existingModal = document.getElementById('confirm-del-modal')
    if (existingModal) {
        existingModal.remove()
    }

    const modalDiv = document.createElement('div')
    
    modalDiv.setAttribute('id', 'confirm-del-modal')
    modalDiv.setAttribute('aria-hidden', 'true')
    modalDiv.setAttribute('data-bs-backdrop', 'static')
    modalDiv.setAttribute('data-bs-keyboard', 'false')
    modalDiv.setAttribute('tabIndex', '-1')
    modalDiv.classList.add('modal', 'fade')

    modalDiv.innerHTML = `
        <div class='modal-dialog modal-dialog-centered'>
            <div class='modal-content'>
                <div class='modal-header'>
                    <h3 class='modal-title'>Delete ${productName}</h3>
                    <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                </div>
                <div class='modal-body'>
                    <p>Are you sure you want to delete ${productName}?</p>
                </div>
                <div class='modal-footer'>
                    <button class='btn btn-outline-danger' type='button' id='confirm-delete-btn' data-product-id='${productId}'>Yes, delete</button>
                    <button class='btn btn-outline-primary' type='button' data-bs-dismiss='modal'>No, keep</button>
                </div>
            </div>
        </div>
    `

    document.body.appendChild(modalDiv)

    const modalInstance = new bootstrap.Modal(modalDiv)

    const confirmDelBtn = document.getElementById('confirm-delete-btn')

    confirmDelBtn.addEventListener('click', (e) => onConfirmDelBtn(e, modalInstance))

    modalInstance.show()
}

const onConfirmDelBtn = (event, modal) => {
    const targetId = event.target.getAttribute('data-product-id')
    deleteProduct(targetId, modal)
    modal.hide()
}

const deleteProduct = async (productId, modal) => {
    const deleteApiUrl = `http://127.0.0.1:8001/api/products/${productId}`

    try {
        const response = await fetch(deleteApiUrl, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })

        if (response.ok){
            const productCard = document.getElementById(`product-${productId}`)
            productCard.remove()
        }

    } catch (error) {
        console.error('Failed to delete product:', error)
    }
}

populateCategoryProducts()