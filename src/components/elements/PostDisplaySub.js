import React, {Component} from "react";
import ReactPaginate from 'react-paginate';
import "../../styles/pagination_style.css"
import Post from "../elements/Post"
import Spinner from "../elements/Spinner"
import axios from "axios";
import "../../styles/posts_style.css"
import "../../styles/image_gallery_style.css"
import "../../config";

export class PostDisplaySub extends Component {

    state = {
        posts: [],
        isLoaded: false,
        offset: 0
    }

    loadPosts() {
        const {offset} = this.state;
        const {postCategoryIDs, postsCount, postsPerPage} = this.props;
        let getPostsUrl = global.config.proxy + "/wp-json/wp/v2/news?orderby=modified";

        if (postCategoryIDs !== undefined){
            getPostsUrl += "&categories=" + postCategoryIDs.toString();

            if (postsCount === -1){
                getPostsUrl += "&per_page=" + postsPerPage;
                getPostsUrl += "&offset=" + offset;
            }
        }

        axios.get(getPostsUrl)
            .then(res => this.setState({
                posts: res.data,
                isLoaded: true,
                pageCount: Number(res.headers["x-wp-totalpages"])
            }))
            .catch(err => console.log(err));
    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.postsPerPage);

        this.setState({ offset: offset }, () => {
            this.loadPosts();
        });

        setTimeout(function () {
            window.scrollTo({
                top: document.getElementById("post-container-id").offsetTop - 200,
                behavior: "smooth"
            });
        }, 500);
    };

    componentDidMount() {
        this.loadPosts();
        this.timer = setInterval(() => this.loadPosts(), 30000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    render() {
        let {posts, isLoaded, pageCount} = this.state;
        const {postsCount} = this.props;

        if(isLoaded) {
            if (posts.length === 0){
                return (
                    <div className={"posts-container posts-container-empty"}>
                        <h4><i>Brak aktualności</i></h4>
                    </div>
                )
            }
            if (postsCount === -1) {
                return (
                    <div className={"posts-container"} id={"post-container-id"}>
                        {posts.map((post, index) => {
                            return <Post key={post.id} post={post} postNr={index} />;
                        })}
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                    </div>
                );
            } else {
                return (
                    <div className={"posts-container"}>
                        {posts.slice(0, postsCount).map((post, index) => {
                            return <Post key={post.id} post={post} postNr={index} />;
                        })}
                    </div>
                );
            }
        }

        return <Spinner/>
    }
}

export default PostDisplaySub;
