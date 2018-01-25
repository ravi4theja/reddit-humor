import gifInfo from 'gif-info'

export const isGIF = img => img.variants.gif? img.variants.gif.source: img.source;

export const gifDuration = async (url) => {
    const gif = await fetch(url).then(res => res.arrayBuffer())
    return gifInfo(gif).duration
}

export const fetchPosts = urls => {
    return Promise.all(
        urls.map(url => fetch(url).then(res => res.json()))
    )
}