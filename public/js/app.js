document.addEventListener('DOMContentLoaded', () => {
    const postsFeed = document.getElementById('postsFeed');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const postContent = document.getElementById('postContent');

    async function fetchPosts() {
        const res = await fetch('/api/posts');
        const posts = await res.json();
        
        postsFeed.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('glass-card', 'post-card');
            
            let commentsHtml = post.comments.map(c => `<div class="comment-item">${c}</div>`).join('');

            postElement.innerHTML = `
                <div class="post-meta">
                    <img src="https://api.dicebear.com/7.x/identicon/svg?seed=${post.username}" class="mini-avatar" alt="Avatar">
                    <div class="meta-info">
                        <h5>@${post.username}</h5>
                        <span>Verified Alpha Creator</span>
                    </div>
                </div>
                <div class="post-body">${post.content}</div>
                <div class="post-actions-row">
                    <button class="action-trigger" onclick="likePost(${post.id})">
                        <i class="fa-regular fa-heart"></i> Like <strong>${post.likes}</strong>
                    </button>
                    <button class="action-trigger">
                        <i class="fa-regular fa-comment"></i> Reply <strong>${post.comments.length}</strong>
                    </button>
                </div>
                <div class="comments-container">
                    <div class="comments-list">${commentsHtml}</div>
                    <div class="comment-composer">
                        <input type="text" id="comment-in-${post.id}" placeholder="Type your reply...">
                        <button class="btn-send-comment" onclick="addComment(${post.id})"><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            `;
            postsFeed.appendChild(postElement);
        });
    }

    submitPostBtn.addEventListener('click', async () => {
        const content = postContent.value.trim();
        if(!content) return;

        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'intern_alpha', content })
        });

        postContent.value = '';
        fetchPosts();
    });

    window.likePost = async (id) => {
        await fetch(`/api/posts/${id}/like`, { method: 'POST' });
        fetchPosts();
    };

    window.addComment = async (id) => {
        const input = document.getElementById(`comment-in-${id}`);
        const comment = input.value.trim();
        if(!comment) return;

        await fetch(`/api/posts/${id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        });

        input.value = '';
        fetchPosts();
    };

    fetchPosts();
});