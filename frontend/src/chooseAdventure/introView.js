import React from 'react';
import * as PropTypes from "prop-types";
import sample_img from './sample.jpg';


/**
 * Component for displaying choose your own adventure skeleton
 */

class IntroView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <div className={'col-6'}>
                        {this.props.desc}
                    </div>
                    <img className= 'col-6' src={sample_img} alt="Sample" />

                </div>

                <button className='col-5 cyoa-button' onClick={() => this.props.setView('stage')}>
                    Get started
                </button>
            </div>





        );

    }
}

IntroView.propTypes = {
    desc: PropTypes.string,
    setView: PropTypes.func,
};

export default IntroView;
