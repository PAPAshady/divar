import { setUrlParam, getUrlParam } from "../../utils/sharedUtils.js";

const $ = document;
const globalSearchInput = $.getElementById('globalSearchInput')

// handle global seach input
const searchValue = getUrlParam('search')
if(searchValue){
    globalSearchInput.value = searchValue
}

globalSearchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter' && e.target.value.trim()) {
        setUrlParam('search', e.target.value.trim())
    }
})