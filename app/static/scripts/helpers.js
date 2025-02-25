
const fetchData = async (apiUrl) => {
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
        return[]
    }
}

 
const postData = async (apiUrl, formResponse) => {     
    try {
        const response = await fetch(apiUrl, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
               },
               body: JSON.stringify(formResponse)
            })        
            
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`)
            }
            
            const data = await response.json()
            return data
        } catch (error) {
            console.error(`Error posting data: ${error}`)
            return null
        }
    }
const updateData = async (productId, formResponse) => {
    const apiUrl = `http://127.0.0.1:8001/api/products/update/${productId}`

    try {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formResponse)
        })

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Error patching data: ${error}`)
        return null
    }

}

const renderPaginationControls = (paginationDiv, currentPage, totalPages) => {
    paginationDiv.innerHTML = ''

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button')
        button.textContent = i; 
        button.classList.add('btn', 'mx-1', 'btn-secondary')
        if (i === currentPage) {
            button.classList.add('disabled')
        }
        button.addEventListener('click', () => {
            currentPage = i 
            renderPage()
        })
        paginationDiv.appendChild(button)
    }
}

export { fetchData, postData, updateData, renderPaginationControls}