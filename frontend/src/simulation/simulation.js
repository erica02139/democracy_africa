import React from 'react';
// import { getCookie }from "../common";

// import PropTypes from 'prop-types';

/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

const FAKE_PEOPLE = [
    {
        "name": "person0",
        "traits": {
            "lives_in_rural_area": true,
            "has_access_to_electricity": false,
            "has_access_to_water": true,
            "has_access_to_sanitation": false,
            "is_educated": true,
        },
        "will_support": false,
    },
    {
        "name": "person1",
        "traits": {
            "lives_in_rural_area": true,
            "has_access_to_electricity": false,
            "has_access_to_water": false,
            "has_access_to_sanitation": false,
            "is_educated": true,
        },
        "will_support": false,
    },
    {
        "name": "person2",
        "traits": {
            "lives_in_rural_area": false,
            "has_access_to_electricity": false,
            "has_access_to_water": true,
            "has_access_to_sanitation": true,
            "is_educated": true,
        },
        "will_support": false,
    },
];



export class Simulation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            population: FAKE_PEOPLE,
            budgetResponse: null,
        }

    }
    simulateCitizenResponse = async () => {
        const url = '/api/budget_response/';
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-type': 'application/json',
            }
        });
        const response_json = await response.json();
        console.log(response_json);
        this.setState({
            budgetResponse: response_json,
        })
    }

    render() {
        let result = "Submit budget";
        if (this.state.budgetResponse) {
            result = `yay = ${this.state.budgetResponse.yay} 
            and nay = ${this.state.budgetResponse.nay}`
        }
        return(
            <>
                <button
                    type="submit"
                    onClick={this.simulateCitizenResponse}
                >
                    Submit
                </button>

                {result}

            </>
        )
    }
}

