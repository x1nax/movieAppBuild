import { Card, Rate } from 'antd'
import './Movie.css'
import holder from './noImg.png'

import { GenresContext } from '../App/App'

export default function Movie({ movie }) {
    const { poster, title, date, genresId, overview, voteAverage } = movie
    let rated = JSON.parse(localStorage.getItem('rated'))
    const getDefaultVote = () => {
        let vote = 0
        if (!rated) {
            return vote
        }
        rated.map((film) => {
            if (film.id === movie.id) vote = film.vote
            return film
        })
        return vote
    }

    let windowWidth =
        window.outerWidth > 551
            ? { padding: '0 0 0 21px' }
            : { padding: '0 0 0 10px' }

    const getRealeaseDate = (relDate) => {
        if (relDate) {
            const dateData = relDate.split('-')
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December ',
            ]
            let [year, month, day] = dateData
            if (month[0] === '0') month = month.slice(1)
            month -= 1
            if (day[0] === '0') day = day.slice(1)
            const newFormatDate = `${months[month]} ${day}, ${year}`
            return newFormatDate
        }
        return ''
    }

    const Genres = (genres) => {
        let movieGenres = genres.filter(
            (genre) => genresId.indexOf(genre.id) > -1
        )
        return movieGenres.map((genre) => (
            <span className="genre" key={genre.id}>
                {genre.name}
            </span>
        ))
    }

    const shortOverview = (text) => {
        let newStr = text.split(' ').slice(0, 25)
        if (newStr.length < text.split(' ').length) {
            newStr.push('...')
            return newStr.join(' ')
        }
        return text
    }

    const average = (num) => {
        let color = ''
        switch (true) {
            case num < 3:
                color = '#E90000'
                break
            case num >= 3 && num < 5:
                color = '#E97E00'
                break
            case num >= 5 && num < 7:
                color = '#E9D100'
                break
            case num >= 7:
                color = '#66E900'
                break
            default:
                break
        }
        return (
            <span
                style={{
                    border: `2px solid ${color}`,
                }}
                className="voteAverage"
            >
                {voteAverage}
            </span>
        )
    }

    const saveMovie = (num) => {
        let json = JSON.stringify(movie)
        let newMovie = JSON.parse(json)
        newMovie.vote = num
        if (!localStorage.getItem('rated')) {
            json = JSON.stringify([newMovie])
            localStorage.setItem('rated', json)
        } else {
            let newRated = rated.map((film) => {
                if (film.id === newMovie.id) {
                    return newMovie
                }
                return film
            })
            let len = newRated.filter((film) => film.id === newMovie.id)
            if (len.length === 0) {
                newRated.push(newMovie)
            }
            json = JSON.stringify(newRated)
            localStorage.setItem('rated', json)
        }
    }

    return (
        <GenresContext.Consumer>
            {(genres) => (
                <Card
                    bodyStyle={windowWidth}
                    className="Card"
                    cover={
                        <img
                            alt="poster"
                            src={
                                movie.poster
                                    ? `https://image.tmdb.org/t/p/w500${poster}`
                                    : holder
                            }
                        />
                    }
                >
                    <h2 className="Movie-title">{title}</h2>
                    {average(voteAverage)}
                    <span className="movie__date">{getRealeaseDate(date)}</span>
                    <ul className="genres">{Genres(genres)}</ul>
                    <p className="overview">{shortOverview(overview)}</p>
                    <Rate
                        style={{ fontSize: 16 }}
                        count={10}
                        onChange={saveMovie}
                        defaultValue={getDefaultVote()}
                    />
                </Card>
            )}
        </GenresContext.Consumer>
    )
}
