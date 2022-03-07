export default class GetData {
    constructor() {
        this.apiBase = 'https://api.themoviedb.org/3/'

        this.apiKey = 'api_key=b727a2cabcd29a2ee698338dc451a5f5'
    }

    async getFilmData(url) {
        let result = ''
        try {
            const res = await fetch(`${this.apiBase}${url}`)
            if (!res.ok)
                throw new Error(
                    `Could not fetch ${url}, received ${res.status}`
                )
            result = await res.json()
        } catch (err) {
            if (!window.navigator.onLine) {
                throw new Error('Internet')
            }
        }
        return result
    }

    getMovieData(value, num) {
        const query = `query=${value}`
        const page = `page=${num}`
        return this.getFilmData(
            `search/movie?${this.apiKey}&${query}&${page}&include_adult=false`
        )
    }

    getGenre() {
        return this.getFilmData(
            `genre/movie/list?${this.apiKey}&language=en-US`
        )
    }
}
