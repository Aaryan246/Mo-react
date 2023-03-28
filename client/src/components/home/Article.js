import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ArticleCard from '../ArticleCard'

import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { ARTICLE_TYPES } from '../../redux/actions/articleAction'


const Articles = () => {
    const { articlePosts, auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    return (
        <div className="posts">
            {
                articlePosts.article.map(post => (
                    <ArticleCard key={post._id} post={post} theme={theme} />
                ))
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
        </div>
    )
}

export default Articles
