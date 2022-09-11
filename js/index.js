let items = [], globalLikes = 0, globalDislikes = 0, itemsElt;
const globalLikesNbrELt =  document.getElementById("global-likes-nbr");
const globalDislikesNbrELt =  document.getElementById("global-dislikes-nbr");

const addLike = id => {
    const index = items.findIndex(item => item.id == id);
    if(items[index].alreadyLiked) {
        items[index].likes --;
        globalLikes --;
    } else {
        items[index].likes ++;
        globalLikes ++;
    }
    items[index].alreadyLiked = !items[index].alreadyLiked;
    document.getElementById("global-likes-nbr").innerText = "Likes : " + globalLikes;
    itemsElt[index].querySelector(".item-like-nbr").innerText = items[index].likes;
}

const addDislike = id => {
    const index = items.findIndex(item => item.id == id);
    if(items[index].alreadyDisLiked) {
        items[index].dislikes --;
        globalDislikes --;
    } else {
        items[index].dislikes ++;
        globalDislikes ++;
    }
    items[index].alreadyDisliked = !items[index].alreadyDisliked;
    document.getElementById("global-dislikes-nbr").innerText = "Dislikes : " + globalDislikes;
    itemsElt[index].querySelector(".item-dislike-nbr").innerText = items[index].dislikes;
}

const addLikeDislikeListener = elt => {
    const btns = elt.querySelectorAll("button");
    
    btns[0].addEventListener("click", () => {
        addLike(elt.dataset.id);
    });

    btns[1].addEventListener("click", () => {
        addDislike(elt.dataset.id);
    });
};

const initMockItems = async () => {
    const res   = await fetch('../mock-imgs-data.json')
    const imgs  = await res.json();
    const randomFilteredImgs = selectRandomMockItems(8, imgs);

    return randomFilteredImgs.map(img => {
        return {
            id: img.id, 
            alt: img.alt || "Likez moi SVP !",
            url: img.src.small, 
            likes : Math.round(Math.random() * 1000),
            dislikes : Math.round(Math.random() * 1000),
            alreadyLiked: false
        };
    });
}

const selectRandomMockItems = (nbr = 10, arr) => {
    const arr_ = [...arr];
    const output = [];
    for(let i = arr.length, lastIndex = i - nbr; i > lastIndex && i > 0; i--) {
        const randIndex = Math.floor(Math.random() * i);
        output.push(arr_[randIndex]);
        arr_.splice(randIndex, 1);
    }
    return output;
}
  
   

const initMockItemsHtml = async () => {
    items = await initMockItems();
    let innerHTML = "<article class=\"items-list\">";
    items.forEach(item => {
        innerHTML += `<section data-id=${item.id}>
                <img src=${item.url}/>
                <div class="items-like-section">
                    <span class="item-likes">
                        <button><i class="fas fa-thumbs-up like-icon"></i></button>
                        <span class="item-like-nbr">${item.likes}</span>
                    </span>
                    <span class="item-dislikes">
                        <button><i class="fas fa-thumbs-down dislike-icon"></i></button>
                        <span class="item-dislike-nbr">${item.dislikes}</span>
                    </span>
                </div>
            </section>
        `;
        globalLikes += item.likes;
        globalDislikes += item.dislikes;
    });
    innerHTML += "</article>";
    document.querySelector("main").innerHTML = innerHTML;   
};

const addListeners = () => {
    itemsElt = document.querySelectorAll(".items-list > section");
    itemsElt.forEach(itemElt => {
        addLikeDislikeListener(itemElt);
    });
}

initMockItemsHtml().then(() => {
    addListeners();
    globalLikesNbrELt.innerText = "Likes : " + globalLikes;
    globalDislikesNbrELt.innerText = "Dislikes : " + globalDislikes; 
});


