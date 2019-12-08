import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from '../../../store/router/actions';

import {
    Div,
    Progress,
    Cell,
    Avatar,
    Link,
    Button,
    Separator
} from '@vkontakte/vkui';

import {createdTimeToString} from '../../../services/_functions';
import OutlineMessage from '../../atoms/OutlineMessage';

import classnames from 'classnames';

import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';

import './Reviews.css';

class Reviews extends React.Component {
    
    renderStars (stars=null) {
        let starsArray = [1,2,3,4,5];
        
        if (stars === null) return (<></>);

        return starsArray.map((star, i) => {
            let isActive = starsArray[i] <= stars;
            return (<i key={"star_"+i} className={
                classnames("fa", "star", {
                    "fa-star": isActive,
                    "fa-star-o": !isActive,
                    "active": isActive
                })
            }></i>);
        });
    }

    upVoteReview = (reviewId=-1) => {
        let {serverId} = this.props;
        if (serverId) {
            window.rest.get('upVoteReview', {
                server_id: serverId,
                review_id: reviewId
            }).then(res => {
                /// Update server
            });
        }
    }

    render() {
        let reviews = this.props.reviews;
        const titleStyles = {paddingTop: 8, paddingBottom: 0}
        return (
            <div className="server-reviews">
                {reviews.length ? <Div style={titleStyles}>
                    <span className="description">{this.props.title ? this.props.title : "Отзывы"}</span>
                </Div> : null}
                {reviews.map((review, i) => {
                    return (
                        <div className="server-review" key={"review_" + i}>
                        <div>
                            <Cell 
                                before={<Avatar src={review.owner.photo_200} size={24}/>} 
                                description={<span>{this.renderStars(review.stars)}<span className="created">{createdTimeToString(review.created)}</span></span>}
                                asideContent={this.props.userVKId === review.owner_id ? null : <Button level="tertiary" onClick={() => {this.upVoteReview(review.id)}}><Icon16LikeOutline/></Button>}
                            >
                                <span className="server-review--author">
                                {review.owner.first_name} {review.owner.last_name}
                                </span>
                            </Cell>
                            <div className="server-review--text">
                                {review.review_text}
                            </div>
                        </div>
                        {i !== reviews.length - 1 ? <Separator className="server-review--separator"/> : null}
                        </div>
                    );
                })}
                {!reviews.length ? this.props.showNoReviews ? <Div><span className="description">Отзывов пока нет. Добавьте свой :) </span></Div> : null : null}
            </div>
        );
    }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {
        userVKId: state.app.userVKId
    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);