import propTypes from 'prop-types'
import React from 'react'
import { Pagination } from 'antd'
import Movie from '../Movie/Movie'
import './MovieList.css'

export default function MovieList({
    movies,
    notFound,
    currentPage,
    totalPages,
    onPageChange,
    ratedMode,
}) {
    const elements = movies.map((movie) => (
        <li className="movie" key={movie.id}>
            <Movie movie={movie} />
        </li>
    ))

    const pagination =
        movies.length > 0 && !notFound && !ratedMode ? (
            <Pagination
                current={currentPage}
                total={totalPages * 10}
                onChange={onPageChange}
                showSizeChanger={false}
            />
        ) : null

    const notFind = ratedMode ? null : (
        <span className="notFind">Cant find this Movie</span>
    )

    return !notFound ? (
        <>
            <ul className="MovieList">{elements}</ul>
            {pagination}
        </>
    ) : (
        notFind
    )
}

MovieList.defaultProps = {
    movies: [],
}

MovieList.prototype = {
    movies: propTypes.array,
}
