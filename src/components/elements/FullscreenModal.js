import React, {Component} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "../elements/Spinner";
import {ReactComponent as IconCross} from "../../images/cross.svg";

export class FullscreenModal extends Component {
    state = {
        isLoaded: false,
        image: 0,
    }

    componentDidMount() {
        this.setState({
            image: this.props.image,
            url: this.props.url,
            alt: this.props.alt,
            isLoaded: true
        })
    }

    render() {
        const {image, url, alt, isLoaded} = this.state;

        if (isLoaded) {
            return (
                <div className={"fullscreen-container"}>
                    <img src={image} alt={alt}/>
                    <div className="image-button" id={"close-button"}>
                        <IconCross onClick={this.props.closeFullscreen}/>
                    </div>
                    {
                        url !== undefined && url !== "" ?
                            <a href={url.url} rel="noopener noreferrer" target="_blank">
                                <button className={"button-accent-2"}>
                                    Szczegóły
                                </button>
                            </a>
                        : ""
                    }
                </div>
            )
        }
        return (
            <Spinner />
        );
    }
}

export default FullscreenModal;