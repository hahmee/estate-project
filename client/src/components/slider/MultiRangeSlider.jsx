import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import "./multiRangeSlider.scss";
import Input from "../../UI/Input.jsx";
import {currencyFormatter} from "../../util/formatting.js";

const MultiRangeSlider = ({ min, max, onChange,step }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);

    const [stepVal, setStepVal] = useState(step);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    const handleInputChange = (e) => {
        // console.log(e.currentTarget.value);
        // setCurrentStepIndex(e.currentTarget.value);
    };

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    return (
        <div className="multiRangeSlider">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                step={stepVal}
                ref={minValRef}
                onChange={(event) => {
                    if (event.target.value < 500000000) {
                        setStepVal(50000000);
                    } else {
                        setStepVal(100000000);
                    }
                    const value = Math.min(+event.target.value, maxVal - stepVal);
                    setMinVal(value);
                    event.target.value = value.toString();
                }}
                className={`thumb thumb--zindex-3 ${minVal > max - 100 && 'thumb--zindex-5'}`}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                step={stepVal}
                ref={maxValRef}
                onChange={(event) => {
                    if (event.target.value < 500000000) {
                        setStepVal(50000000);
                    } else {
                        setStepVal(100000000);
                    }
                    const value = Math.max(+event.target.value, minVal + stepVal);
                    setMaxVal(value);
                    event.target.value = value.toString();
                }}
                className="thumb thumb--zindex-4"
            />

            <div className="range_slider">
                <div className="slider__track"/>
                <div ref={range} className="slider__range"/>
                <div className="slider__column__left"/>
                <div className="slider__left-value">최소</div>
                <div className="slider__column__middle"/>
                <div className="slider__middle-value">{currencyFormatter.format(max/2)}</div>
                <div className="slider__column__right"/>
                <div className="slider__right-value">최대</div>

            </div>

            <div className="sliderResult">
                <div className="sliderValue">
                    {currencyFormatter.format(minVal)}
                </div>
                <div className="divideLine"/>
                <div className="sliderValue">
                    {
                        (max === maxVal) ? <p className="infinite">무제한</p> : <p>{currencyFormatter.format(maxVal)}</p>
                    }
                </div>
            </div>

        </div>
    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    // onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;