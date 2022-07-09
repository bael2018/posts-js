// rendering post info while loading post page

const singlePostWrapper = document.querySelector('.post-wrapper')

window.addEventListener('load' , () => {
    const postId = JSON.parse(localStorage.getItem('post-id'))
    const posts = JSON.parse(localStorage.getItem('posts'))

    singlePostWrapper.innerHTML = singlePostCard(posts.find(post => post.id === postId))
})

// single post card

function singlePostCard({ title, body }){
    return `
        <div class='post-card'>
            <div class='post-card__header'>
                <h1>${title}</h1>
            </div>
            <div class='post-card__body'>
                <p>${body}</p>
            </div>
        </div>
    `
}

// back to posts page button handling

const returnBackBtn = document.querySelector('.post-return__btn')

returnBackBtn.addEventListener('click' , () => {
    window.open('index.html', '_self')
})