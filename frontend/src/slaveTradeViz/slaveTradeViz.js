import React from 'react';
import * as PropTypes from 'prop-types';
// import StartView from './startView.js';

import {
    project_features_and_create_svg_paths,
} from "../common";

import { MapPath } from "../UILibrary/components";
import * as d3 from "d3";
import "./slaveTradeViz.scss";

// TODO: once district maps are in (1) allow for options btwn countries and hardcode fake data
// TODO: probably DRC, MOZ, NGA, MLI


class AfricaMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
        };
    }

    async changeCountry() {
        try {
            const res = await fetch(`/api/state_map_geojson/${this.props.country}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            // const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = project_features_and_create_svg_paths(
                geo_json,
                this.props.width,
                this.props.height
            );
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }
    // async componentDidUpdate(prevProps) {
    //     if (prevProps.country !== this.props.country) {
    //         console.log("I have changed!");
    //         try {
    //             const res = await fetch(`/api/state_map_geojson/${this.props.country}/`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-type': 'application/json',
    //                 }
    //             });
    //             // const res = await fetch('/api/africa_map_geojson/');
    //             const geo_json = await res.json();
    //             const map_data = project_features_and_create_svg_paths(
    //                 geo_json,
    //                 this.props.width,
    //                 this.props.height
    //             );
    //             this.setState({
    //                 map_data: map_data,
    //             });
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    // }

    render() {
        // if (!this.prop.map_data) {
        //     return(<div>Loading!</div>);
        // }
        const colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(['yellow', 'red']);
        return(
            <>
                <svg
                    height={this.props.height}
                    width={this.props.width}
                >
                    {this.props.map_data.map((country, i) => {
                        const random_num = Math.random();

                        return (
                            <MapPath
                                key={i}
                                path={country.svg_path}
                                fill={colorScale(random_num)}
                                stroke="black"
                                strokeWidth="1"
                                useColorTransition={true}
                                handle_country_click={
                                    () => this.props.handleCountryClick(country.name)
                                }
                                handle_country_mouseover={
                                    () => this.props.handleMouseOver(country.name)
                                }
                            />
                        );
                    })}

                </svg>
            </>
        );
    }
}
AfricaMap.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    country: PropTypes.string,
    map_data: PropTypes.object,
    handleCountryClick: PropTypes.func,
    handleMouseOver: PropTypes.func,
};

class DistrictInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }
    render() {
        return(
            <div className={this.state.show ? "" : "d-hidden"}>
                <h3>{this.props.name}</h3>
                <strong> Initial: </strong>
                {this.props.initial_value}
                <br/>
                <strong> Current: </strong>
                {this.props.current_value}
            </div>
        );
    }
}
DistrictInfo.propTypes = {
    name: PropTypes.string,
    initial_value: PropTypes.number,
    current_value: PropTypes.number,
};

class AggregateData extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h6>
                    Aggregate Data
                </h6>
                min, mean, median mode

            </div>
        );
    }
}

export class SlaveTradeViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "0",
            view: 'intro',
            map_data: null,
            clicked_country: "",
            hovered_country: "",
            show_aggregate_data: false,
        };
        this.map_height = 600;
        this.map_width = 550;


    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.country !== this.state.country) {
            console.log("I have changed!");
            try {
                const res = await fetch(`/api/state_map_geojson/${this.state.country}/`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    }
                });
                // const res = await fetch('/api/africa_map_geojson/');
                const geo_json = await res.json();
                const map_data = project_features_and_create_svg_paths(
                    geo_json,
                    this.map_width,
                    this.map_height
                );
                this.setState({
                    map_data: map_data,
                });
            } catch (e) {
                console.log(e);
            }
        }
    }

    handleSliderChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleCountryClick = (name) => {
        this.setState({
            clicked_country: name,
        });
    }

    handleMouseOver = (name) => {
        this.setState({
            hovered_country: name,
        });
    }

    handleCountryChange = (e) => {
        this.setState({
            country: e.target.value,
        });
    }

    render() {
        let district_info;
        if (this.state.hovered_country) {
            // hardcoded values until we get data from the backend
            district_info = (
                <DistrictInfo
                    name={this.state.hovered_country}
                    initial_value={10}
                    current_value={12}
                />
            );
        }

        return (
            <>
                <select
                    value={this.state.country}
                    onChange={this.handleCountryChange}
                >
                    <option value="none" selected disabled hidden>Select a country to start</option>
                    <option value="MOZ">Mozambique</option>
                    <option value="COD">Democratic Republic of the Congo</option>
                    <option value="NGA">Nigeria</option>
                    <option value="MLI">Mali</option>
                </select>
                <div>
                    <h1>{this.state.resource_counter} left</h1>
                </div>
                <div className="slave-trade-viz">
                    <div
                        className="map-container"
                    >
                        <h3>Slave Exports</h3>
                        {this.state.map_data
                            ? <AfricaMap
                                height={this.map_height}
                                width={this.map_width}
                                country="MOZ"
                                map_data={this.state.map_data}
                                handleCountryClick={this.handleCountryClick}
                                handleMouseOver={this.handleMouseOver}
                            />
                            : ""
                        }
                        {
                            this.state.show_aggregate_data
                                ? <AggregateData/>
                                : ""
                        }

                    </div>
                    <div className="map-container">
                        <h3>Interpersonal Trust</h3>
                        { this.state.map_data
                            ? <AfricaMap
                                map_data={this.state.map_data}
                                height={this.map_height}
                                width={this.map_width}
                                country="MOZ"
                            />
                            : ""

                        }

                    </div>
                </div>
                <h5>
                    {this.state.clicked_country}
                </h5>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={this.state.value}
                    onChange={this.handleSliderChange}
                />
                <button
                    type="submit"
                    onClick={
                        () => this.setState({show_aggregate_data: !this.state.show_aggregate_data})
                    }
                >
                    Submit
                </button>
                {district_info}

            </>);
    }
}
SlaveTradeViz.propTypes = {
    value: PropTypes.string,
    current_country: PropTypes.string,
};
