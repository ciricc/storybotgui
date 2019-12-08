import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from '../../../store/router/actions';

import {
    Div,
    Progress
} from '@vkontakte/vkui';

import {decOfNum} from '../../../services/_functions';

import './Marks.css';

class Marks extends React.Component {
    render() {
        const {id} = this.props;
        let averageRating = 0;
        let totalCounts = 0;

        let marks = this.props.marks || [];
        let percents = new Array(5).fill(0);

        marks.forEach(mark => {
            averageRating += mark.mark * mark.count;
            totalCounts += mark.count;
        });

        marks.forEach(mark => {
            percents[mark.mark - 1] = Math.floor(mark.count / totalCounts * 100) || 0;
        });

        averageRating = Math.floor(averageRating / totalCounts * 10) / 10;
        averageRating = String(!averageRating ? 0 : averageRating % 1 ? averageRating : String(averageRating) + ".0");
        
        return (
            <Div className="server-rating">
                <div className="server-rating--full">
                    <div className="server-rating--full-rate">
                        {averageRating}
                    </div>
                    <div className="server-rating--full-total-count">
                        {totalCounts || "0"} {decOfNum(totalCounts, ["проголосовавший", "проголосовавших", "проголосовавших"])}
                    </div>
                </div>
                <div className="server-rating--percents">
                    {percents.reverse().map((percent, i) => {
                        return (
                            <div key={"rating-percent" + i} className="server-rating--percent">
                                <div className="server-rating--percent-before">
                                    {5 - (i)}
                                </div>
                                <div className="server-rating--percent-range">
                                    <Progress value={percent + 1}/>
                                </div>
                                <div className="server-rating--percent-after">
                                    {percent}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Div>
        );
    }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {

    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(Marks);