import React, { Component } from 'react'
import { Input, Spin, Menu, Alert } from 'antd'
import { debounce } from 'lodash'
import MovieList from '../MovieList/MovieList'
import './App.css'
import GetData from '../GetData/GetData'

export const GenresContext = React.createContext([])

export default class App extends Component {
    state = {
        movies: [],
        genres: [],
        value: '',
        loading: true,
        notFound: false,
        totalPages: 1,
        currentPage: 1,
        ratedMode: false,
        Error: false,
    }

    getData = new GetData()

    updateMovie = debounce(async (str, page) => {
        try {
            let data = await this.getData.getMovieData(str, page)
            if (data.results.length !== 0) {
                this.setState({ notFound: false })
                let newMovies = data.results.map((film) => {
                    const movie = {
                        id: film.id,
                        poster: film.poster_path,
                        title: film.original_title,
                        date: film.release_date,
                        genresId: film.genre_ids,
                        overview: film.overview,
                        voteAverage: film.vote_average,
                    }
                    return movie
                })
                this.setState({ movies: newMovies })
                this.setState({ totalPages: data.total_pages })
            } else this.setState({ notFound: true })
            this.setState({ loading: false })
        } catch (err) {
            if (err.message === 'Internet') {
                this.setState({ Error: true })
                this.setState({ loading: false })
                setTimeout(() => {
                    this.setState({ Error: false })
                }, 3000)
            }
        }
    }, 500)

    componentDidMount() {
        this.getData
            .getGenre()
            .then((data) => this.setState({ genres: data.genres }))
        this.setState({ loading: false })
    }

    componentDidUpdate(prevProps, prevState) {
        const { value, currentPage } = this.state
        if (
            prevState.value !== value ||
            prevState.currentPage !== currentPage
        ) {
            if (value.length > 0) {
                this.updateMovie(value, currentPage)
                this.loadingOn()
            } else {
                this.clearMovies()
            }
        }
    }

    loadingOn = () => {
        this.setState({ loading: true })
    }

    clearMovies = () => {
        this.setState({ movies: [] })
    }

    onPageChange = (e) => {
        this.setState({ currentPage: e })
    }

    onValueChange = (e) => {
        this.setState(() => ({ value: e.target.value }))
    }

    ratedModeToogle = ({ key }) => {
        if (key === '2') {
            this.setState((state) => ({
                ratedMode: !state.ratedMode,
            }))
        } else this.setState({ ratedMode: false })
    }

    render() {
        const {
            movies,
            genres,
            value,
            loading,
            notFound,
            totalPages,
            currentPage,
            ratedMode,
            Error,
        } = this.state
        const spin = loading ? <Spin size="large" /> : null
        const error = Error ? (
            <Alert
                className="error"
                message="Erorr"
                description="Check your internet connection"
                type="error"
            />
        ) : null
        const filmsList = ratedMode
            ? JSON.parse(localStorage.getItem('rated'))
            : movies
        const input = !ratedMode ? (
            <Input
                size="large"
                placeholder="Type to search..."
                className="search"
                onChange={this.onValueChange}
                value={value}
            />
        ) : null
        const movieList = !loading ? (
            <MovieList
                movies={filmsList}
                ratedMode={ratedMode}
                notFound={notFound}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={this.onPageChange}
            />
        ) : null

        return (
            <div className="wrap">
                <Menu
                    className="nav"
                    mode="horizontal"
                    onClick={this.handleClick}
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    onSelect={this.ratedModeToogle}
                >
                    <Menu.Item key="1">Search</Menu.Item>
                    <Menu.Item key="2">Rated</Menu.Item>
                </Menu>
                {error}
                {input}
                {spin}
                <GenresContext.Provider value={genres}>
                    {movieList}
                </GenresContext.Provider>
            </div>
        )
    }
}
