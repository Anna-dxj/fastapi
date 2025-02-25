import { fetchData, renderPaginationControls } from './helpers.js';

const allCategoriesDiv = document.querySelector('#all-categories-list');
const paginationDiv = document.querySelector('#pagination-div')

const limit = 40
let currentPage = 1; 

const populateAllCategories = async () => {
    allCategoriesDiv.innerHTML = ''

    const offset = (currentPage - 1) * limit
    
    const categoryApiUrl = `http://127.0.0.1:8001/api/category/?limit=${limit}&offset=${offset}`
    
    try {
        const categoryData = await fetchData(categoryApiUrl)
        
        if (categoryData.length > 0) {
            categoryData.sort((a, b) => a.name.localeCompare(b.name))
            categoryData.forEach(({name, id}) => {
                const categoryLink = document.createElement('a')
                
                categoryLink.classList.add('col-6', 'link-offset-1', 'link-offset-2-hover', 'link-underline', 'link-underline-opacity-0', 'link-underline-opacity-75-hover')
                categoryLink.setAttribute('href', `/categories/${id}/products`)

                categoryLink.innerHTML = name

                allCategoriesDiv.appendChild(categoryLink)
            })
        } else {
            allCategoriesDiv.innerHTML = `<p>There are no categories. Please create add a category first to view them.</p>`
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
        allCategoriesDiv.innerHTML = `<p>Failed to load products. Please try again later.</p>`
    }
}

const renderPage = async () => {
    await populateAllCategories()

    const categoryUrl = 'http://127.0.0.1:8001/api/category/?limit=0';
    const totalCategories = await fetchData(categoryUrl)
    const totalPages = Math.ceil(totalCategories.length / limit)

    renderPaginationControls(paginationDiv, currentPage, totalPages)

}

renderPage()