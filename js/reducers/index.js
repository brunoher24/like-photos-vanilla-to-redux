function reducer(state, action) {
    if (typeof state === 'undefined') {
        console.log("Initialisation du state");
        return {
            items: [],
            globalLikes: 0, 
            globalDislikes: 0, 
            itemsElt: null, 
            indexItemToModify: -1
        };
    }
    const items = [...state.items];
    let item, index;

    switch (action.type) {
        case 'INIT_STATE':
            return {
                ...state,
                items: action.items,
                globalLikes: action.globalLikes,
                globalDislikes: action.globalDislikes,
                itemsElt: action.itemsElt,

            };
        case 'LIKE':
            index = items.findIndex(item => item.id == action.id);
            item = {...items[index]};
            let globalLikes = state.globalLikes;
            if(item.alreadyLiked) {
                item.likes --;
                globalLikes --;
            } else {
                item.likes ++;
                globalLikes ++;
            }
            item.alreadyLiked = !item.alreadyLiked;
            items[index] = item;
            return {...state, items, globalLikes, indexItemToModify: index};
        case 'DISLIKE':
            index = items.findIndex(item => item.id == action.id);
            item = {...items[index]};
            let globalDislikes = state.globalDislikes;
            if(item.alreadyDisliked) {
                item.dislikes --;
                globalDislikes --;
            } else {
                item.dislikes ++;
                globalDislikes ++;
            }
            item.alreadyDisliked = !item.alreadyDisliked;
            items[index] = item;
            return {...state, items, globalDislikes, indexItemToModify: index};
        default:
            return state
        }
  }

  const store = Redux.createStore(reducer);