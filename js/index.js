// let items = [], globalLikes = 0, globalDislikes = 0, itemsElt, indexItemToModify;

const addLikeDislikeListener = elt => {
    const btns = elt.querySelectorAll("button");
    
    btns[0].addEventListener("click", () => {
        store.dispatch({
            type:"LIKE", 
            id: elt.dataset.id
        });
    });

    btns[1].addEventListener("click", () => {
        store.dispatch({
            type:"DISLIKE", 
            id: elt.dataset.id
        });
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
            alreadyLiked: false,
            alreadyDisLiked: false
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
    let globalLikes = 0;
    let globalDislikes = 0;
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
    return {items, globalLikes, globalDislikes};
};

const addListeners = itemsElt => {
    itemsElt.forEach(itemElt => {
        addLikeDislikeListener(itemElt);
    });
}

const render = () => {
    const {globalLikes, globalDislikes, items, itemsElt, indexItemToModify} = store.getState();
    document.getElementById("global-likes-nbr").innerText = "Likes : " + globalLikes;
    document.getElementById("global-dislikes-nbr").innerText = "Dislikes : " + globalDislikes;
    if(indexItemToModify > -1) {
        itemsElt[indexItemToModify].querySelector(".item-like-nbr").innerText = items[indexItemToModify].likes;
        itemsElt[indexItemToModify].querySelector(".item-dislike-nbr").innerText = items[indexItemToModify].dislikes;
    }
};

initMockItemsHtml().then(({items, globalLikes, globalDislikes}) => {
    const itemsElt =  document.querySelectorAll(".items-list > section");
    store.dispatch({
        type:"INIT_STATE", 
        items,
        globalLikes,
        globalDislikes,
        itemsElt
    });
    
    addListeners(itemsElt);
    render();
});

store.subscribe(render);


