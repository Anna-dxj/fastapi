import { fetchData } from './helpers.js';

const allCategoriesDiv = document.querySelector('#all-categories-list');

const populateAllCategories = async () => {
    allCategoriesDiv.innerHTML = ''
    
    const categoryApiUrl = 'http://127.0.0.1:8001/api/category/'
    
    try {
        const categoryData = await fetchData(categoryApiUrl)
        
        if (categoryData.length > 0) {
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

populateAllCategories()