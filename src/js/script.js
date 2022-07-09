// rendering posts while loading posts page

const postList = document.querySelector(".post-list")

const limit = 6
let from = 0;
let to = limit;
let page = 1

window.addEventListener('load' , async () => {
    if(!JSON.parse(localStorage.getItem('posts'))){
        postList.innerHTML = postLoadingCard()
        const res = await fetchGetPosts()

        localStorage.setItem('posts', JSON.stringify(res))
        pageCounterHandler()
        const result = mapArrayToString(res)
        postList.innerHTML = result
    }else{
        pageCounterHandler()
        const posts = JSON.parse(localStorage.getItem('posts'))
        const result = mapArrayToString(posts)
        postList.innerHTML = result
    }
})

// posts loading card 

function postLoadingCard(){
    return `
        <div class='loader'>
            <div class='lds_roller'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>  
    `
}

// fetching posts from api

async function fetchGetPosts(){
    return fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
}

// turning array into string

function mapArrayToString(arr, empty_text){
    if(arr.length){
        return arr.reverse().slice(from, to).reduce((prev, post) => {
            return prev += postListCard(post)
        }, '')
    }else{
        return `
            <div class='empty-post'>
                <h2>
                    ${empty_text ? `No posts by ${empty_text}` : 'No posts'}
                </h2>
            </div>
        `
    }
}

// post-card 

function postListCard({ id, title, body }){
    return `
        <div class="post-item">
            <div class="post-item__header">
                <h3>${title}</h3>
            </div>
            <div class="post-item__body ${body.length > 170 && 'post-item__body__scroll'}">
                <p>${body}</p>
            </div>
            <div class="post-item__footer">
                <button 
                    onclick='deletePostHandler(${id})'
                    class="delete-btn"
                >
                    DELETE
                </button>
                <button 
                    onclick='editPostHandler(${id})'
                    class="edit-btn"
                >
                    EDIT
                </button>
                <button 
                    onclick='singlePageHandler(${id})' 
                    class="more-btn"
                >
                    MORE
                </button>
            </div>
        </div>
    `
}

// post searching handler

const post_selector = document.querySelector('.post-search__selector')
const search_input = document.querySelector('.post-search__input')
const search_result = document.querySelector('.post-search__result')

search_input.addEventListener('input' , e => {
    const posts = JSON.parse(localStorage.getItem('posts'))
    const value = e.target.value.toLowerCase()

    const filteredPosts = posts.filter(post => post[post_selector.value].toLowerCase().includes(value))

    if(!value.trim() || !filteredPosts.length){
        search_result.classList.add('invisible')
    }else{
        search_result.classList.remove('invisible')
    }
    const result = filteredPosts.reduce((prev, post) => prev += searchResultCard(post), '')
    search_result.innerHTML = result
})

function searchResultCard({ id, title }){
    return `<p onclick='singlePageHandler(${id})'>${title}</p>`
}

// single post page handler

function singlePageHandler(id){
    localStorage.setItem('post-id', JSON.stringify(id))
    window.open('post.html', '_self')
}

// single post delete handler

function deletePostHandler(id){
    const isConfirm = confirm("Are you sure ?")

    if(!isConfirm) return

    const posts = JSON.parse(localStorage.getItem('posts'))
    const result = posts.filter(post => post.id !== id)

    localStorage.setItem("posts", JSON.stringify(result));
    window.location.reload()
}

// single post edit handler 

function editPostHandler(id){
    const posts = JSON.parse(localStorage.getItem('posts'))

    const newTitle = prompt("New title")
    const newBody = prompt("New body")

    const result = posts.map(post => post.id === id ? {
            ...post, 
            title: !newTitle ? post.title : newTitle ,
            body: !newBody ? post.body : newBody
        } : post
    )

    localStorage.setItem("posts", JSON.stringify(result));
    window.location.reload()
}

// posts pagination handler

const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')
const pageCounter = document.querySelector('.page-counter')
const postPagination = document.querySelector('.post-pagination')

function pageCounterHandler(){
    const posts = JSON.parse(localStorage.getItem('posts'))
    
    if(posts.length < 7){
        postPagination.classList.add('invisible')
    }else{
        postPagination.classList.remove('invisible')
    }

    if(page === 1){
        prevBtn.classList.add('disabled-btn')
    }else{
        prevBtn.classList.remove('disabled-btn')
    }

    if(page === Math.ceil(posts.length / limit)){
        nextBtn.classList.add('disabled-btn')
    }else{
        nextBtn.classList.remove('disabled-btn')
    }

    pageCounter.innerHTML = `${page} / ${Math.ceil(posts.length / limit)}`
}

function nextPaginationHandler(){
    const posts = JSON.parse(localStorage.getItem('posts'))

    if(page < Math.ceil(posts.length / limit)){
        from = from + limit
        to = from + limit
        page++
        
        pageCounterHandler()
        const result = mapArrayToString(posts)
        postList.innerHTML = result
    }
}

nextBtn.addEventListener('click', nextPaginationHandler)

function prevPaginationHandler(){
    const posts = JSON.parse(localStorage.getItem('posts'))

    if(page > 1){
        from = from - limit
        to = to - limit
        page--

        pageCounterHandler()
        const result = mapArrayToString(posts)
        postList.innerHTML = result
    }
}

prevBtn.addEventListener('click', prevPaginationHandler)